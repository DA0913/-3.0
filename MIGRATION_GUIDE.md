# 从 Supabase 到 PostgreSQL 迁移指南

本指南将帮助您完成从 Supabase 到 PostgreSQL 的数据库迁移。

## 迁移状态

✅ **已完成的步骤：**
- 备份 Supabase 数据库结构
- 创建 PostgreSQL 模式文件
- 更新 package.json 依赖
- 创建环境变量模板
- 重写数据库客户端
- 创建后端 API 服务器
- 重构前端组件
- 实现触发器和约束

## 安装和配置步骤

### 1. 安装新依赖

```bash
npm install
```

这将安装所有必要的依赖包，包括：
- PostgreSQL 客户端 (pg)
- Express.js 后端框架
- JWT 认证
- bcryptjs 密码加密
- 其他必要的库

### 2. 设置 PostgreSQL 数据库

#### 选项 A: 本地 PostgreSQL
```bash
# 安装 PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# 创建数据库
createdb erp_database

# 创建用户
psql erp_database
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE erp_database TO your_username;
\q
```

#### 选项 B: 云服务
选择任何 PostgreSQL 云服务提供商：
- AWS RDS
- Google Cloud SQL  
- Azure Database for PostgreSQL
- DigitalOcean Managed Databases
- Supabase (仅使用数据库功能)

### 3. 配置环境变量

复制环境变量模板：
```bash
cp .env.example .env
```

编辑 `.env` 文件并填入您的数据库连接信息：
```env
# PostgreSQL 数据库连接
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/erp_database

# 或者单独配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=erp_database
DB_USER=your_username
DB_PASSWORD=your_password
DB_SSL=false

# JWT 密钥 (生成一个安全的随机字符串)
JWT_SECRET=your-super-secure-jwt-secret-key-here

# 其他配置
NODE_ENV=development
PORT=3000
VITE_API_BASE_URL=http://localhost:3000/api
```

### 4. 初始化数据库

运行数据库迁移脚本：
```bash
# 如果您有 psql 命令行工具
psql -U your_username -d erp_database -f backup/postgres_schema.sql

# 或者使用任何 PostgreSQL 客户端工具导入 backup/postgres_schema.sql
```

### 5. 启动应用

启动后端服务器：
```bash
npm run server
```

在另一个终端启动前端：
```bash
npm run dev
```

或者同时启动两者：
```bash
npm run dev:full
```

### 6. 验证迁移

1. 访问 http://localhost:5173 查看前端应用
2. 访问 http://localhost:3000/api/health 检查后端健康状态
3. 使用默认管理员账号登录：
   - 邮箱: admin@example.com
   - 密码: admin123

## 数据库模式

迁移后的数据库包含以下表：

- `form_submissions` - 表单提交记录
- `news_articles` - 新闻文章
- `customer_cases` - 客户案例
- `featured_cases` - 精选案例
- `partner_cases` - 合作伙伴案例
- `case_configurations` - 案例配置
- `admin_users` - 管理员用户

## 需要进一步完成的组件

以下组件已经重构但可能需要进一步调整：

1. **FormModal.tsx** - 表单提交组件
2. **FormManagement.tsx** - 表单管理
3. **NewsManagement.tsx** - 新闻管理
4. **UnifiedCaseManagement.tsx** - 案例管理
5. **AdminLogin.tsx** - 管理员登录
6. **其他使用 Supabase 的组件**

## 认证系统变更

### 旧的 Supabase 认证
```javascript
// 旧方式
import { supabase } from '../lib/supabase';
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
```

### 新的 JWT 认证
```javascript
// 新方式
import { db } from '../lib/database';
const response = await db.login('user@example.com', 'password');
if (response.data) {
  // 登录成功，token 已自动保存
  console.log('User:', response.data.user);
}
```

## API 端点

后端提供以下 API 端点：

### 认证
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户

### 表单提交
- `GET /api/form-submissions` - 获取表单列表 (需认证)
- `POST /api/form-submissions` - 创建表单提交 (公开)
- `PUT /api/form-submissions/:id` - 更新表单 (需认证)
- `DELETE /api/form-submissions/:id` - 删除表单 (需认证)

### 新闻文章
- `GET /api/news-articles` - 获取新闻列表 (公开)
- `GET /api/news-articles/:id` - 获取单个新闻 (公开)
- `POST /api/news-articles` - 创建新闻 (需认证)
- `PUT /api/news-articles/:id` - 更新新闻 (需认证)
- `DELETE /api/news-articles/:id` - 删除新闻 (需认证)

### 客户案例
- `GET /api/customer-cases` - 获取案例列表 (公开)
- `POST /api/customer-cases` - 创建案例 (需认证)
- `PUT /api/customer-cases/:id` - 更新案例 (需认证)
- `DELETE /api/customer-cases/:id` - 删除案例 (需认证)

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 `.env` 文件中的数据库连接信息
   - 确保 PostgreSQL 服务正在运行
   - 验证用户权限

2. **JWT 认证错误**
   - 确保 `JWT_SECRET` 已设置
   - 检查 token 是否正确传递

3. **CORS 错误**
   - 检查 `CORS_ORIGIN` 环境变量
   - 确保前端和后端端口匹配

4. **模块未找到错误**
   - 运行 `npm install` 安装所有依赖
   - 检查 Node.js 版本兼容性

### 日志调试

启用详细日志：
```env
LOG_LEVEL=debug
NODE_ENV=development
```

### 数据库调试

检查数据库连接：
```bash
psql -U your_username -d erp_database -c "SELECT version();"
```

## 安全注意事项

1. **生产环境配置**
   - 使用强密码和安全的 JWT 密钥
   - 启用 SSL/TLS 连接
   - 配置防火墙规则

2. **环境变量**
   - 不要在代码中硬编码敏感信息
   - 使用环境变量管理配置
   - 在生产环境中使用安全的密钥管理服务

3. **数据库安全**
   - 定期备份数据库
   - 限制数据库访问权限
   - 监控异常访问

## 性能优化

1. **数据库优化**
   - 定期运行 `VACUUM` 和 `ANALYZE`
   - 监控查询性能
   - 适当创建索引

2. **API 性能**
   - 实现缓存策略
   - 使用连接池
   - 监控 API 响应时间

## 备份和恢复

### 备份数据库
```bash
pg_dump -U your_username -h localhost erp_database > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 恢复数据库
```bash
psql -U your_username -h localhost erp_database < backup_file.sql
```

## 支持

如果您在迁移过程中遇到问题，请：

1. 检查本指南的故障排除部分
2. 查看应用日志文件
3. 验证数据库连接和配置
4. 确保所有依赖都已正确安装 