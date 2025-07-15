import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 数据库连接
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// 中间件
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP每15分钟最多100个请求
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// JWT认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// 错误处理函数
const handleDatabaseError = (error, res) => {
  console.error('Database error:', error);
  res.status(500).json({ error: 'Database operation failed' });
};

// 在创建 app 之后，配置静态资源
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(path.join(publicDir, 'uploads'))) {
  fs.mkdirSync(path.join(publicDir, 'uploads'), { recursive: true });
}
app.use(express.static(publicDir));

// Multer 配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(publicDir, 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
  }
});
const upload = multer({ storage });

// 图片上传接口
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const url = `${baseUrl}/uploads/${req.file.filename}`;
  res.json({ url });
});

// ================================
// 认证相关路由
// ================================

// 用户登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query(
      'SELECT * FROM admin_users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 更新最后登录时间
    await pool.query(
      'UPDATE admin_users SET last_login = now() WHERE id = $1',
      [user.id]
    );

    // 生成JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.SESSION_TIMEOUT || '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at
      }
    });
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// 获取当前用户信息
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, role, is_active, last_login, created_at FROM admin_users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// ================================
// 表单提交相关路由
// ================================

// 获取表单提交列表
app.get('/api/form-submissions', authenticateToken, async (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM form_submissions';
    let params = [];
    let conditions = [];

    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }

    if (search) {
      conditions.push(`(company_name ILIKE $${params.length + 1} OR user_name ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    
    // 获取总数
    let countQuery = 'SELECT COUNT(*) FROM form_submissions';
    let countParams = [];
    
    if (status) {
      countQuery += ' WHERE status = $1';
      countParams.push(status);
    }

    const countResult = await pool.query(countQuery, countParams);
    
    res.json({
      data: result.rows,
      count: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// 创建表单提交（公开接口）
app.post('/api/form-submissions', async (req, res) => {
  try {
    const { company_name, user_name, phone, company_types, source_url } = req.body;

    if (!company_name || !user_name || !phone || !source_url) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO form_submissions (company_name, user_name, phone, company_types, source_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [company_name, user_name, phone, company_types || [], source_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// 更新表单提交
app.put('/api/form-submissions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const result = await pool.query(
      'UPDATE form_submissions SET status = $1, notes = $2, updated_at = now() WHERE id = $3 RETURNING *',
      [status, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Form submission not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// 删除表单提交
app.delete('/api/form-submissions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM form_submissions WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Form submission not found' });
    }

    res.json({ message: 'Form submission deleted successfully' });
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// ================================
// 新闻文章相关路由
// ================================

// 获取新闻文章列表（公开接口）
app.get('/api/news-articles', async (req, res) => {
  try {
    const { category, featured, limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM news_articles';
    let params = [];
    let conditions = [];

    if (category) {
      conditions.push(`category = $${params.length + 1}`);
      params.push(category);
    }

    if (featured !== undefined) {
      conditions.push(`is_featured = $${params.length + 1}`);
      params.push(featured === 'true');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY publish_time DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// 获取单个新闻文章（公开接口）
app.get('/api/news-articles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 增加浏览量
    await pool.query(
      'UPDATE news_articles SET views = views + 1 WHERE id = $1',
      [id]
    );

    const result = await pool.query(
      'SELECT * FROM news_articles WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// 创建新闻文章
app.post('/api/news-articles', authenticateToken, async (req, res) => {
  try {
    const { title, category, publish_time, image_url, summary, content, is_featured } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const result = await pool.query(
      `INSERT INTO news_articles (title, category, publish_time, image_url, summary, content, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, category, publish_time || new Date(), image_url, summary, content, is_featured || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// 更新新闻文章
app.put('/api/news-articles/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, publish_time, image_url, summary, content, is_featured } = req.body;

    const result = await pool.query(
      `UPDATE news_articles 
       SET title = $1, category = $2, publish_time = $3, image_url = $4, 
           summary = $5, content = $6, is_featured = $7, updated_at = now()
       WHERE id = $8 RETURNING *`,
      [title, category, publish_time, image_url, summary, content, is_featured, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// 删除新闻文章
app.delete('/api/news-articles/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM news_articles WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// ================================
// 客户案例相关路由
// ================================

// 获取客户案例列表（公开接口）
app.get('/api/customer-cases', async (req, res) => {
  try {
    const { status = 'active', featured, industry, limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM customer_cases WHERE status = $1';
    let params = [status];

    if (featured !== undefined) {
      query += ` AND is_featured = $${params.length + 1}`;
      params.push(featured === 'true');
    }

    if (industry) {
      query += ` AND industry = $${params.length + 1}`;
      params.push(industry);
    }

    query += ` ORDER BY sort_order ASC, created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// 创建客户案例
app.post('/api/customer-cases', authenticateToken, async (req, res) => {
  try {
    const { 
      company_name, company_logo, industry, description, 
      results, image_url, metrics, is_featured, sort_order,
      case_title, case_summary, detail_url, company_size, 
      highlight_tags, company_description
    } = req.body;

    if (!company_name || !industry || !description || !results) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO customer_cases 
       (company_name, company_logo, industry, description, results, image_url, metrics, is_featured, sort_order,
        case_title, case_summary, detail_url, company_size, highlight_tags, company_description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [company_name, company_logo || 'C', industry, description, results, 
       image_url || null, JSON.stringify(metrics || {}), is_featured || false, sort_order || 0,
       case_title || null, case_summary || null, detail_url || null, company_size || null,
       highlight_tags || [], company_description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// 更新客户案例
app.put('/api/customer-cases/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      company_name, company_logo, industry, description, 
      results, image_url, metrics, is_featured, sort_order, status,
      case_title, case_summary, detail_url, company_size, 
      highlight_tags, company_description
    } = req.body;

    const result = await pool.query(
      `UPDATE customer_cases 
       SET company_name = $1, company_logo = $2, industry = $3, 
           description = $4, results = $5, image_url = $6, metrics = $7, 
           is_featured = $8, sort_order = $9, status = $10, updated_at = now(),
           case_title = $11, case_summary = $12, detail_url = $13, 
           company_size = $14, highlight_tags = $15, company_description = $16
       WHERE id = $17 RETURNING *`,
      [company_name, company_logo, industry, description, results, 
       image_url, JSON.stringify(metrics), is_featured, sort_order, status, 
       case_title, case_summary, detail_url, company_size, highlight_tags, company_description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer case not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// 删除客户案例
app.delete('/api/customer-cases/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM customer_cases WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer case not found' });
    }

    res.json({ message: 'Customer case deleted successfully' });
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// 健康检查
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// 404处理
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`ERP API Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 