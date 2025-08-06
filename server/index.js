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
  origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:5174'],
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

// 权限验证中间件
const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId || req.user.id;
      const userTable = req.user.userTable;
      
      let role, permissions = [];
      
      if (userTable === 'admin_users') {
        // 从admin_users表获取
        const userResult = await pool.query(
          'SELECT role FROM admin_users WHERE id = $1',
          [userId]
        );
        
        if (userResult.rows.length === 0) {
          return res.status(403).json({ error: 'Admin user not found' });
        }
        
        role = userResult.rows[0].role;
        // admin用户默认拥有所有权限
        permissions = ['*'];
      } else {
        // 从users表获取
        const userResult = await pool.query(
          'SELECT role, permissions FROM users WHERE id = $1',
          [userId]
        );
        
        if (userResult.rows.length === 0) {
          return res.status(403).json({ error: 'User not found' });
        }
        
        const userData = userResult.rows[0];
        role = userData.role;
        permissions = Array.isArray(userData.permissions) ? userData.permissions : [];
      }
      
      // 超级管理员拥有所有权限
      if (role === 'super_admin' || role === 'admin' || permissions.includes('*')) {
        return next();
      }
      
      // 检查具体权限
      if (permissions.includes(permission)) {
        return next();
      }
      
      // 检查通配符权限
      const permissionParts = permission.split('.');
      for (let i = permissionParts.length - 1; i > 0; i--) {
        const wildcardPermission = permissionParts.slice(0, i).join('.') + '.*';
        if (permissions.includes(wildcardPermission)) {
          return next();
        }
      }
      
      return res.status(403).json({ error: '权限不足' });
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ error: 'Permission check failed' });
    }
  };
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

    let user = null;
    let userTable = '';
    let isValidPassword = false;

    // 先查询admin_users表
    const adminResult = await pool.query(
      'SELECT * FROM admin_users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (adminResult.rows.length > 0) {
      user = adminResult.rows[0];
      userTable = 'admin_users';
      isValidPassword = await bcrypt.compare(password, user.password_hash);
    } else {
      // 如果admin_users中没有，查询users表
      const userResult = await pool.query(
        'SELECT * FROM users WHERE email = $1 AND status = $2',
        [email, 'active']
      );

      if (userResult.rows.length > 0) {
        user = userResult.rows[0];
        userTable = 'users';
        isValidPassword = await bcrypt.compare(password, user.password_hash);
      }
    }

    if (!user || !isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 更新最后登录时间和登录次数
    if (userTable === 'admin_users') {
      await pool.query(
        'UPDATE admin_users SET last_login = now() WHERE id = $1',
        [user.id]
      );
    } else {
      await pool.query(
        'UPDATE users SET last_login = now(), login_count = login_count + 1 WHERE id = $1',
        [user.id]
      );
    }

    // 生成JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, userTable: userTable },
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
    const userId = req.user.userId || req.user.id;
    const userTable = req.user.userTable;
    
    let result;
    
    if (userTable === 'admin_users') {
      result = await pool.query(
        'SELECT id, email, role, is_active, last_login, created_at FROM admin_users WHERE id = $1',
        [userId]
      );
    } else {
      result = await pool.query(
        'SELECT id, email, role, status as is_active, last_login, created_at, full_name, username FROM users WHERE id = $1',
        [userId]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    
    // 统一返回格式
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      is_active: user.is_active === 'active' || user.is_active === true,
      last_login: user.last_login,
      created_at: user.created_at,
      full_name: user.full_name || user.email.split('@')[0],
      username: user.username || user.email.split('@')[0]
    });
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
// 渠道合作申请相关路由
// ================================

// 创建渠道合作申请（公开接口）
app.post('/api/partnership-applications', async (req, res) => {
  try {
    const { companyName, userName, contactPhone, joinReason, submittedAt, status } = req.body;

    if (!companyName || !userName || !contactPhone || !joinReason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 检查是否已有表，如果没有则创建
    await pool.query(`
      CREATE TABLE IF NOT EXISTS partnership_applications (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        company_name text NOT NULL,
        user_name text NOT NULL,
        contact_phone text NOT NULL,
        join_reason text NOT NULL,
        status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected')),
        submitted_at timestamptz DEFAULT now(),
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )
    `);

    const result = await pool.query(
      `INSERT INTO partnership_applications (company_name, user_name, contact_phone, join_reason, status, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [companyName, userName, contactPhone, joinReason, status || 'pending', submittedAt || new Date().toISOString()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Partnership application creation error:', error);
    handleDatabaseError(error, res);
  }
});

// 获取渠道合作申请列表（需要认证）
app.get('/api/partnership-applications', authenticateToken, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM partnership_applications';
    let params = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// 更新渠道合作申请状态（需要认证）
app.put('/api/partnership-applications/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE partnership_applications SET status = $1, updated_at = now() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Partnership application not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// ================================
// 系统配置相关路由
// ================================

// 获取系统配置（需要认证）
app.get('/api/system-config', authenticateToken, async (req, res) => {
  try {
    // 检查是否已有表，如果没有则创建
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_config (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        site_name text NOT NULL DEFAULT '久火ERP',
        site_url text NOT NULL DEFAULT 'www.jiufire.com',
        customer_service_code text DEFAULT '',
        baidu_analytics_code text DEFAULT '',
        google_analytics_code text DEFAULT '',
        seo_title text DEFAULT '久火ERP - 国内设计领先的外贸企业数字化解决方案服务商',
        seo_description text DEFAULT '久火ERP专注外贸及跨境电商企业数字化转型，提供PDM、SRM、CRM、OMS、TMS、WMS、FMS等全链路解决方案',
        seo_keywords text DEFAULT 'ERP,外贸ERP,跨境电商,数字化转型,PDM,SRM,CRM,OMS',
        contact_phone text DEFAULT '400-026-2606',
        contact_email text DEFAULT 'info@jiufire.com',
        company_address text DEFAULT '',
        icp_number text DEFAULT '',
        logo_url text DEFAULT '',
        favicon_url text DEFAULT '',
        primary_color text DEFAULT '#194fe8',
        secondary_color text DEFAULT '#1640c7',
        maintenance_mode boolean DEFAULT false,
        registration_enabled boolean DEFAULT true,
        email_notifications boolean DEFAULT true,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )
    `);

    const result = await pool.query('SELECT * FROM system_config ORDER BY created_at DESC LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No configuration found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// 保存系统配置（需要认证）
app.post('/api/system-config', authenticateToken, async (req, res) => {
  try {
    const {
      site_name, site_url, customer_service_code, baidu_analytics_code, google_analytics_code,
      seo_title, seo_description, seo_keywords, contact_phone, contact_email,
      company_address, icp_number, logo_url, favicon_url, primary_color, secondary_color,
      maintenance_mode, registration_enabled, email_notifications
    } = req.body;

    // 检查是否已有配置
    const existingConfig = await pool.query('SELECT id FROM system_config ORDER BY created_at DESC LIMIT 1');

    let result;
    if (existingConfig.rows.length === 0) {
      // 创建新配置
      result = await pool.query(
        `INSERT INTO system_config (
          site_name, site_url, customer_service_code, baidu_analytics_code, google_analytics_code,
          seo_title, seo_description, seo_keywords, contact_phone, contact_email,
          company_address, icp_number, logo_url, favicon_url, primary_color, secondary_color,
          maintenance_mode, registration_enabled, email_notifications
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *`,
        [
          site_name, site_url, customer_service_code, baidu_analytics_code, google_analytics_code,
          seo_title, seo_description, seo_keywords, contact_phone, contact_email,
          company_address, icp_number, logo_url, favicon_url, primary_color, secondary_color,
          maintenance_mode, registration_enabled, email_notifications
        ]
      );
    } else {
      // 更新现有配置
      result = await pool.query(
        `UPDATE system_config SET 
          site_name = $1, site_url = $2, customer_service_code = $3, baidu_analytics_code = $4, google_analytics_code = $5,
          seo_title = $6, seo_description = $7, seo_keywords = $8, contact_phone = $9, contact_email = $10,
          company_address = $11, icp_number = $12, logo_url = $13, favicon_url = $14, primary_color = $15, secondary_color = $16,
          maintenance_mode = $17, registration_enabled = $18, email_notifications = $19, updated_at = now()
         WHERE id = $20 RETURNING *`,
        [
          site_name, site_url, customer_service_code, baidu_analytics_code, google_analytics_code,
          seo_title, seo_description, seo_keywords, contact_phone, contact_email,
          company_address, icp_number, logo_url, favicon_url, primary_color, secondary_color,
          maintenance_mode, registration_enabled, email_notifications, existingConfig.rows[0].id
        ]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('System config save error:', error);
    handleDatabaseError(error, res);
  }
});

// ================================
// 数据统计相关路由
// ================================

// 获取网站统计数据（需要认证）
app.get('/api/analytics', authenticateToken, async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    
    // 创建访问统计表（如果不存在）
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_analytics (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        ip_address inet NOT NULL,
        user_agent text,
        page_url text NOT NULL,
        referrer text,
        visit_time timestamptz DEFAULT now(),
        session_id text,
        user_id text,
        country text,
        region text,
        city text,
        device_type text,
        browser text,
        os text,
        screen_resolution text,
        created_at timestamptz DEFAULT now()
      )
    `);

    // 创建索引以优化查询性能
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_site_analytics_visit_time ON site_analytics(visit_time);
      CREATE INDEX IF NOT EXISTS idx_site_analytics_ip ON site_analytics(ip_address);
      CREATE INDEX IF NOT EXISTS idx_site_analytics_page_url ON site_analytics(page_url);
    `);

    // 计算时间范围
    let dateFilter = '';
    const now = new Date();
    if (timeRange === '1d') {
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      dateFilter = `AND visit_time >= '${yesterday.toISOString()}'`;
    } else if (timeRange === '7d') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = `AND visit_time >= '${weekAgo.toISOString()}'`;
    } else if (timeRange === '30d') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = `AND visit_time >= '${monthAgo.toISOString()}'`;
    } else if (timeRange === '90d') {
      const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      dateFilter = `AND visit_time >= '${threeMonthsAgo.toISOString()}'`;
    }

    // 如果表为空，返回模拟数据
    const countResult = await pool.query('SELECT COUNT(*) as count FROM site_analytics WHERE 1=1 ' + dateFilter);
    const hasData = parseInt(countResult.rows[0].count) > 0;

    if (!hasData) {
      // 返回模拟数据
      const mockData = {
        overview: {
          pageViews: 192,
          uniqueVisitors: 125,
          ipCount: 101,
          visitTime: '131',
          avgPageTime: '1.47',
          avgUserTime: '1.54',
          avgVisitTime: '00:00:28',
          bounceRate: '84%'
        },
        trendData: [
          { date: '07-11', pv: 52, uv: 35 },
          { date: '07-12', pv: 42, uv: 28 },
          { date: '07-13', pv: 28, uv: 20 },
          { date: '07-14', pv: 65, uv: 45 },
          { date: '07-15', pv: 58, uv: 38 },
          { date: '07-16', pv: 85, uv: 62 },
          { date: '07-17', pv: 45, uv: 32 }
        ],
        topPages: [
          { url: 'https://www.jiufire.com/', views: 55 },
          { url: 'http://jiufire.com/', views: 45 },
          { url: 'https://www.jiufire.com/syc-rd-65.html', views: 10 },
          { url: 'https://www.jiufire.com/syc-rd-101.html', views: 7 },
          { url: 'https://www.jiufire.com/h-col-109.html', views: 6 },
          { url: 'https://www.jiufire.com/h-col-104.html', views: 6 },
          { url: 'https://www.jiufire.com/h-col-110.html', views: 5 },
          { url: 'https://jiufire.com/', views: 5 },
          { url: 'https://www.jiufire.com/h-col-102.html', views: 4 },
          { url: 'https://www.jiufire.com/h-col-119.html', views: 3 }
        ],
        geoData: [
          { region: '四川', views: 38, percentage: 32 },
          { region: '河南', views: 23, percentage: 19 },
          { region: '江苏', views: 19, percentage: 16 },
          { region: '广东', views: 11, percentage: 9 },
          { region: '黑龙江', views: 6, percentage: 5 },
          { region: '浙江', views: 5, percentage: 4 },
          { region: '陕西', views: 4, percentage: 3 },
          { region: '湖北', views: 4, percentage: 3 },
          { region: '山东', views: 4, percentage: 3 }
        ],
        deviceData: {
          desktop: 75,
          mobile: 20,
          tablet: 5
        },
        browserData: [
          { browser: 'Chrome', views: 120, percentage: 65 },
          { browser: 'Safari', views: 45, percentage: 24 },
          { browser: 'Firefox', views: 15, percentage: 8 },
          { browser: 'Edge', views: 6, percentage: 3 }
        ],
        referrerData: [
          { source: 'https://map.mm.cn/', views: 2 }
        ]
      };
      return res.json(mockData);
    }

    // 如果有真实数据，查询统计信息
    const [overviewResult, trendResult, topPagesResult, geoResult, deviceResult, browserResult, referrerResult] = await Promise.all([
      // 总览数据
      pool.query(`
        SELECT 
          COUNT(*) as page_views,
          COUNT(DISTINCT ip_address) as unique_visitors,
          COUNT(DISTINCT ip_address) as ip_count,
          COUNT(DISTINCT session_id) as visit_time,
          AVG(EXTRACT(epoch FROM (
            SELECT MAX(visit_time) - MIN(visit_time) 
            FROM site_analytics sa2 
            WHERE sa2.session_id = site_analytics.session_id
          ))) as avg_session_time
        FROM site_analytics 
        WHERE 1=1 ${dateFilter}
      `),
      
      // 趋势数据（最近7天）
      pool.query(`
        SELECT 
          DATE(visit_time) as date,
          COUNT(*) as pv,
          COUNT(DISTINCT ip_address) as uv
        FROM site_analytics 
        WHERE visit_time >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(visit_time)
        ORDER BY date ASC
      `),
      
      // 热门页面
      pool.query(`
        SELECT 
          page_url as url,
          COUNT(*) as views
        FROM site_analytics 
        WHERE 1=1 ${dateFilter}
        GROUP BY page_url
        ORDER BY views DESC
        LIMIT 10
      `),
      
      // 地理分布
      pool.query(`
        SELECT 
          COALESCE(region, '未知') as region,
          COUNT(*) as views
        FROM site_analytics 
        WHERE 1=1 ${dateFilter}
        GROUP BY region
        ORDER BY views DESC
        LIMIT 10
      `),
      
      // 设备分布
      pool.query(`
        SELECT 
          CASE 
            WHEN device_type = 'desktop' THEN 'desktop'
            WHEN device_type = 'mobile' THEN 'mobile'
            WHEN device_type = 'tablet' THEN 'tablet'
            ELSE 'other'
          END as device,
          COUNT(*) as views
        FROM site_analytics 
        WHERE 1=1 ${dateFilter}
        GROUP BY device
      `),
      
      // 浏览器分布
      pool.query(`
        SELECT 
          COALESCE(browser, '未知') as browser,
          COUNT(*) as views
        FROM site_analytics 
        WHERE 1=1 ${dateFilter}
        GROUP BY browser
        ORDER BY views DESC
        LIMIT 10
      `),
      
      // 来源统计
      pool.query(`
        SELECT 
          COALESCE(referrer, '直接访问') as source,
          COUNT(*) as views
        FROM site_analytics 
        WHERE 1=1 ${dateFilter} AND referrer IS NOT NULL AND referrer != ''
        GROUP BY referrer
        ORDER BY views DESC
        LIMIT 10
      `)
    ]);

    // 组装响应数据
    const overview = overviewResult.rows[0];
    const totalViews = parseInt(overview.page_views);
    
    const geoDataWithPercentage = geoResult.rows.map(row => ({
      region: row.region,
      views: parseInt(row.views),
      percentage: Math.round((parseInt(row.views) / totalViews) * 100)
    }));

    const deviceData = deviceResult.rows.reduce((acc, row) => {
      acc[row.device] = parseInt(row.views);
      return acc;
    }, { desktop: 0, mobile: 0, tablet: 0 });

    const browserDataWithPercentage = browserResult.rows.map(row => ({
      browser: row.browser,
      views: parseInt(row.views),
      percentage: Math.round((parseInt(row.views) / totalViews) * 100)
    }));

    const analyticsData = {
      overview: {
        pageViews: totalViews,
        uniqueVisitors: parseInt(overview.unique_visitors),
        ipCount: parseInt(overview.ip_count),
        visitTime: overview.visit_time,
        avgPageTime: '1.47', // 这需要更复杂的计算
        avgUserTime: '1.54',
        avgVisitTime: overview.avg_session_time ? 
          new Date(overview.avg_session_time * 1000).toISOString().substr(14, 5) : '00:00:28',
        bounceRate: '84%' // 这需要跳出率的具体计算
      },
      trendData: trendResult.rows.map(row => ({
        date: new Date(row.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
        pv: parseInt(row.pv),
        uv: parseInt(row.uv)
      })),
      topPages: topPagesResult.rows.map(row => ({
        url: row.url,
        views: parseInt(row.views)
      })),
      geoData: geoDataWithPercentage,
      deviceData,
      browserData: browserDataWithPercentage,
      referrerData: referrerResult.rows.map(row => ({
        source: row.source,
        views: parseInt(row.views)
      }))
    };

    res.json(analyticsData);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    handleDatabaseError(error, res);
  }
});

// 记录访问统计（公开接口）
app.post('/api/analytics/track', async (req, res) => {
  try {
    const {
      page_url,
      referrer,
      user_agent,
      screen_resolution,
      session_id
    } = req.body;

    const ip_address = req.ip || req.connection.remoteAddress || '127.0.0.1';
    
    // 简单的User Agent解析
    const parseUserAgent = (ua) => {
      const userAgent = ua || '';
      let browser = '未知', os = '未知', device_type = 'desktop';
      
      if (userAgent.includes('Chrome')) browser = 'Chrome';
      else if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Safari')) browser = 'Safari';
      else if (userAgent.includes('Edge')) browser = 'Edge';
      
      if (userAgent.includes('Windows')) os = 'Windows';
      else if (userAgent.includes('Mac')) os = 'macOS';
      else if (userAgent.includes('Linux')) os = 'Linux';
      else if (userAgent.includes('Android')) os = 'Android';
      else if (userAgent.includes('iOS')) os = 'iOS';
      
      if (userAgent.includes('Mobile') || userAgent.includes('Android')) device_type = 'mobile';
      else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) device_type = 'tablet';
      
      return { browser, os, device_type };
    };

    const { browser, os, device_type } = parseUserAgent(user_agent);

    await pool.query(`
      INSERT INTO site_analytics (
        ip_address, user_agent, page_url, referrer, session_id,
        device_type, browser, os, screen_resolution,
        region, country
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      ip_address,
      user_agent,
      page_url,
      referrer || null,
      session_id,
      device_type,
      browser,
      os,
      screen_resolution,
      '未知', // 这里可以集成IP地理位置服务
      '中国'
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // 不影响用户体验，静默失败
    res.json({ success: false });
  }
});

// ================================
// 用户管理相关路由
// ================================

// 获取用户列表（需要认证和权限）
app.get('/api/users', authenticateToken, requirePermission('user.view'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', role = '' } = req.query;
    
    // 创建用户表（如果不存在）
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        username varchar(50) UNIQUE NOT NULL,
        email varchar(255) UNIQUE NOT NULL,
        password_hash text NOT NULL,
        full_name varchar(100) NOT NULL,
        phone varchar(20),
        avatar_url text,
        role varchar(20) DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
        status varchar(20) DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'locked', 'pending')),
        permissions jsonb DEFAULT '[]'::jsonb,
        department varchar(100),
        position varchar(100),
        notes text,
        last_login timestamptz,
        login_count integer DEFAULT 0,
        created_by uuid,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now(),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // 创建索引
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    `);

    // 构建查询条件
    let whereConditions = ['1=1'];
    let queryParams = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereConditions.push(`(username ILIKE $${paramCount} OR email ILIKE $${paramCount} OR full_name ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      whereConditions.push(`status = $${paramCount}`);
      queryParams.push(status);
    }

    if (role) {
      paramCount++;
      whereConditions.push(`role = $${paramCount}`);
      queryParams.push(role);
    }

    const whereClause = whereConditions.join(' AND ');
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // 获取用户列表
    const result = await pool.query(`
      SELECT 
        id, username, email, full_name, phone, avatar_url, role, status,
        permissions, department, position, notes, last_login, login_count,
        created_at, updated_at,
        (SELECT username FROM users u2 WHERE u2.id = users.created_by) as created_by_username
      FROM users 
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `, [...queryParams, parseInt(limit), offset]);

    // 获取总数
    const countResult = await pool.query(`
      SELECT COUNT(*) as total FROM users WHERE ${whereClause}
    `, queryParams);

    const users = result.rows.map(user => ({
      ...user,
      permissions: Array.isArray(user.permissions) ? user.permissions : []
    }));

    res.json({
      users,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / parseInt(limit))
    });
  } catch (error) {
    console.error('Get users error:', error);
    handleDatabaseError(error, res);
  }
});

// 创建用户（需要认证和权限）
app.post('/api/users', authenticateToken, requirePermission('user.create'), async (req, res) => {
  try {
    const {
      username, email, password, full_name, phone, role, status,
      permissions, department, position, notes
    } = req.body;

    if (!username || !email || !password || !full_name) {
      return res.status(400).json({ error: '缺少必填字段' });
    }

    // 检查用户名和邮箱是否已存在
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: '用户名或邮箱已存在' });
    }

    // 加密密码
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 获取当前用户ID
    const currentUserId = req.user.userId || req.user.id;

    const result = await pool.query(`
      INSERT INTO users (
        username, email, password_hash, full_name, phone, role, status,
        permissions, department, position, notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, username, email, full_name, phone, role, status,
                permissions, department, position, notes, created_at, updated_at
    `, [
      username, email, password_hash, full_name, phone || null,
      role || 'viewer', status || 'pending',
      JSON.stringify(permissions || []), department || null,
      position || null, notes || null, null  // 暂时设为null避免外键约束问题
    ]);

    // 记录操作日志
    await pool.query(`
      INSERT INTO operation_logs (user_id, username, action, target_type, target_id, details, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      null, req.user.email || req.user.username, 'CREATE_USER', 'user', result.rows[0].id,
      `创建用户: ${username}`, req.ip, req.get('User-Agent') || ''
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create user error:', error);
    handleDatabaseError(error, res);
  }
});

// 更新用户（需要认证和权限）
app.put('/api/users/:id', authenticateToken, requirePermission('user.edit'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username, email, full_name, phone, role, status,
      permissions, department, position, notes
    } = req.body;

    // 检查用户是否存在
    const existingUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 检查用户名和邮箱冲突（排除当前用户）
    if (username || email) {
      const conflictCheck = await pool.query(
        'SELECT id FROM users WHERE (username = $1 OR email = $2) AND id != $3',
        [username || existingUser.rows[0].username, email || existingUser.rows[0].email, id]
      );

      if (conflictCheck.rows.length > 0) {
        return res.status(400).json({ error: '用户名或邮箱已被其他用户使用' });
      }
    }

    const result = await pool.query(`
      UPDATE users SET
        username = $1, email = $2, full_name = $3, phone = $4, role = $5, status = $6,
        permissions = $7, department = $8, position = $9, notes = $10, updated_at = now()
      WHERE id = $11
      RETURNING id, username, email, full_name, phone, role, status,
                permissions, department, position, notes, created_at, updated_at
    `, [
      username || existingUser.rows[0].username,
      email || existingUser.rows[0].email,
      full_name || existingUser.rows[0].full_name,
      phone || existingUser.rows[0].phone,
      role || existingUser.rows[0].role,
      status || existingUser.rows[0].status,
      JSON.stringify(permissions || existingUser.rows[0].permissions),
      department || existingUser.rows[0].department,
      position || existingUser.rows[0].position,
      notes || existingUser.rows[0].notes,
      id
    ]);

    // 记录操作日志
    await pool.query(`
      INSERT INTO operation_logs (user_id, username, action, target_type, target_id, details, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      req.user.id, req.user.username, 'UPDATE_USER', 'user', id,
      `更新用户: ${username || existingUser.rows[0].username}`, req.ip, req.get('User-Agent') || ''
    ]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    handleDatabaseError(error, res);
  }
});

// 删除用户（需要认证和权限）
app.delete('/api/users/:id', authenticateToken, requirePermission('user.delete'), async (req, res) => {
  try {
    const { id } = req.params;

    // 检查用户是否存在
    const existingUser = await pool.query('SELECT username FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 防止删除自己
    if (id === req.user.id) {
      return res.status(400).json({ error: '不能删除自己的账户' });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    // 记录操作日志
    await pool.query(`
      INSERT INTO operation_logs (user_id, username, action, target_type, target_id, details, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      req.user.id, req.user.username, 'DELETE_USER', 'user', id,
      `删除用户: ${existingUser.rows[0].username}`, req.ip, req.get('User-Agent') || ''
    ]);

    res.json({ message: '用户删除成功' });
  } catch (error) {
    console.error('Delete user error:', error);
    handleDatabaseError(error, res);
  }
});

// 批量操作用户（需要认证和权限）
app.post('/api/users/batch', authenticateToken, requirePermission('user.edit'), async (req, res) => {
  try {
    const { action, userIds, data } = req.body;

    if (!action || !userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ error: '无效的批量操作参数' });
    }

    let result;
    let actionDesc = '';

    switch (action) {
      case 'activate':
        result = await pool.query(
          'UPDATE users SET status = $1, updated_at = now() WHERE id = ANY($2) RETURNING id, username',
          ['active', userIds]
        );
        actionDesc = '批量激活用户';
        break;

      case 'deactivate':
        result = await pool.query(
          'UPDATE users SET status = $1, updated_at = now() WHERE id = ANY($2) RETURNING id, username',
          ['inactive', userIds]
        );
        actionDesc = '批量停用用户';
        break;

      case 'lock':
        result = await pool.query(
          'UPDATE users SET status = $1, updated_at = now() WHERE id = ANY($2) RETURNING id, username',
          ['locked', userIds]
        );
        actionDesc = '批量锁定用户';
        break;

      case 'delete':
        // 防止删除自己
        if (userIds.includes(req.user.id)) {
          return res.status(400).json({ error: '不能删除自己的账户' });
        }
        
        result = await pool.query(
          'DELETE FROM users WHERE id = ANY($1) RETURNING id, username',
          [userIds]
        );
        actionDesc = '批量删除用户';
        break;

      case 'updateRole':
        if (!data.role) {
          return res.status(400).json({ error: '缺少角色参数' });
        }
        result = await pool.query(
          'UPDATE users SET role = $1, updated_at = now() WHERE id = ANY($2) RETURNING id, username',
          [data.role, userIds]
        );
        actionDesc = `批量更新用户角色为: ${data.role}`;
        break;

      default:
        return res.status(400).json({ error: '不支持的批量操作' });
    }

    // 记录操作日志
    for (const user of result.rows) {
      await pool.query(`
        INSERT INTO operation_logs (user_id, username, action, target_type, target_id, details, ip_address, user_agent)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        req.user.id, req.user.username, 'BATCH_OPERATION', 'user', user.id,
        `${actionDesc}: ${user.username}`, req.ip, req.get('User-Agent') || ''
      ]);
    }

    res.json({
      message: `${actionDesc}成功`,
      affected: result.rows.length,
      users: result.rows
    });
  } catch (error) {
    console.error('Batch operation error:', error);
    handleDatabaseError(error, res);
  }
});

// 获取角色列表（需要认证）
app.get('/api/roles', authenticateToken, async (req, res) => {
  try {
    // 创建角色表（如果不存在）
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(50) UNIQUE NOT NULL,
        description text,
        permissions jsonb DEFAULT '[]'::jsonb,
        is_system_role boolean DEFAULT false,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )
    `);

    // 插入默认角色（如果不存在）
    await pool.query(`
      INSERT INTO roles (name, description, permissions, is_system_role)
      VALUES 
        ('super_admin', '超级管理员', '["*"]', true),
        ('admin', '管理员', '["user.*", "content.*", "system.view"]', true),
        ('editor', '编辑员', '["content.*", "user.view"]', true),
        ('viewer', '查看员', '["content.view", "user.view"]', true)
      ON CONFLICT (name) DO NOTHING
    `);

    const result = await pool.query('SELECT * FROM roles ORDER BY is_system_role DESC, name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Get roles error:', error);
    handleDatabaseError(error, res);
  }
});

// 获取操作日志（需要认证）
app.get('/api/operation-logs', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 50, user_id = '', action = '', target_type = '' } = req.query;
    
    // 创建操作日志表（如果不存在）
    await pool.query(`
      CREATE TABLE IF NOT EXISTS operation_logs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid,
        username varchar(50) NOT NULL,
        action varchar(50) NOT NULL,
        target_type varchar(50),
        target_id varchar(255),
        details text,
        ip_address inet,
        user_agent text,
        created_at timestamptz DEFAULT now(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // 创建索引
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_operation_logs_user_id ON operation_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_operation_logs_action ON operation_logs(action);
      CREATE INDEX IF NOT EXISTS idx_operation_logs_created_at ON operation_logs(created_at);
    `);

    // 构建查询条件
    let whereConditions = ['1=1'];
    let queryParams = [];
    let paramCount = 0;

    if (user_id) {
      paramCount++;
      whereConditions.push(`user_id = $${paramCount}`);
      queryParams.push(user_id);
    }

    if (action) {
      paramCount++;
      whereConditions.push(`action = $${paramCount}`);
      queryParams.push(action);
    }

    if (target_type) {
      paramCount++;
      whereConditions.push(`target_type = $${paramCount}`);
      queryParams.push(target_type);
    }

    const whereClause = whereConditions.join(' AND ');
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await pool.query(`
      SELECT * FROM operation_logs
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `, [...queryParams, parseInt(limit), offset]);

    const countResult = await pool.query(`
      SELECT COUNT(*) as total FROM operation_logs WHERE ${whereClause}
    `, queryParams);

    res.json({
      logs: result.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / parseInt(limit))
    });
  } catch (error) {
    console.error('Get operation logs error:', error);
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
      highlight_tags, company_description, show_on_homepage, show_in_banner, show_in_partners,
      contact_avatar, contact_name, contact_position
    } = req.body;

    if (!company_name || !industry || !description || !results) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO customer_cases 
       (company_name, company_logo, industry, description, results, image_url, metrics, is_featured, sort_order,
        case_title, case_summary, detail_url, company_size, highlight_tags, company_description,
        show_on_homepage, show_in_banner, show_in_partners, contact_avatar, contact_name, contact_position)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *`,
      [company_name, company_logo || 'C', industry, description, results, 
       image_url || null, JSON.stringify(metrics || {}), is_featured || false, sort_order || 0,
       case_title || null, case_summary || null, detail_url || null, company_size || null,
       highlight_tags || [], company_description || null,
       show_on_homepage || false, show_in_banner || false, show_in_partners || false,
       contact_avatar || null, contact_name || null, contact_position || null]
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
      highlight_tags, company_description, show_on_homepage, show_in_banner, show_in_partners,
      contact_avatar, contact_name, contact_position
    } = req.body;

    const result = await pool.query(
      `UPDATE customer_cases 
       SET company_name = $1, company_logo = $2, industry = $3, 
           description = $4, results = $5, image_url = $6, metrics = $7, 
           is_featured = $8, sort_order = $9, status = $10, updated_at = now(),
           case_title = $11, case_summary = $12, detail_url = $13, 
           company_size = $14, highlight_tags = $15, company_description = $16,
           show_on_homepage = $17, show_in_banner = $18, show_in_partners = $19,
           contact_avatar = $20, contact_name = $21, contact_position = $22
       WHERE id = $23 RETURNING *`,
      [company_name, company_logo, industry, description, results, 
       image_url, JSON.stringify(metrics), is_featured, sort_order, status, 
       case_title, case_summary, detail_url, company_size, highlight_tags, company_description,
       show_on_homepage, show_in_banner, show_in_partners, contact_avatar, contact_name, contact_position, id]
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