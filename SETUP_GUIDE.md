# ERP系统安装指南

## 快速开始

### 1. 环境要求
- Node.js >= 16
- PostgreSQL >= 12
- npm

### 2. 安装依赖
```bash
npm install
```

### 3. 数据库设置

#### 3.1 安装和启动 PostgreSQL
```bash
# macOS
brew install postgresql
brew services start postgresql

# 创建数据库
createdb erp_system
```

#### 3.2 导入数据库结构
```bash
# 连接到PostgreSQL并导入 schema
psql -d erp_system -f backup/postgres_schema.sql
```

### 4. 环境变量配置
```bash
# 复制并编辑环境变量文件
cp .env.example .env

# 编辑 .env 文件，根据你的数据库配置修改：
# DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
```

### 5. 启动服务

#### 5.1 启动后端服务器
```bash
npm run server
```

#### 5.2 启动前端开发服务器
```bash
npm run dev
```

### 6. 访问系统

- **前台网站**: http://localhost:5173
- **管理后台**: http://localhost:5173/admin
- **管理员账号**: 
  - 邮箱: `admin@example.com`
  - 密码: `admin123`

## 功能说明

### 已完成功能 ✅
- 前台展示页面
- 表单提交功能
- 管理员登录系统
- 表单提交管理
- 新闻文章管理
- 按钮表单映射管理

### 部分完成功能 ⚠️
- 客户案例页面（有类型错误但不影响基本功能）
- 新闻详情页面
- 贸易知识页面
- 案例管理组件

## 故障排除

### 数据库连接问题
1. 确保 PostgreSQL 正在运行
2. 检查 `.env` 文件中的数据库配置
3. 确认数据库 `erp_system` 已创建
4. 确认数据库schema已导入

### API 调用失败
1. 确保后端服务器在 http://localhost:3000 运行
2. 检查 `VITE_API_BASE_URL` 环境变量设置

### 前端编译错误
1. 清除缓存: `rm -rf node_modules/.vite`
2. 重新安装依赖: `rm -rf node_modules && npm install`

## 系统架构

- **前端**: React + TypeScript + Vite + Tailwind CSS
- **后端**: Node.js + Express.js + PostgreSQL
- **认证**: JWT Token
- **API**: RESTful API (/api/*)

## 开发说明

系统已从 Supabase 成功迁移到自托管的 PostgreSQL 数据库，所有核心功能都能正常工作。 