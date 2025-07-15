# 久火ERP - 完整表单管理系统

这是一个完整的网站表单管理系统，包含前端表单收集和后台管理功能。

## 功能特性

### 前端功能
- 🎯 **智能表单按钮** - 替换所有原有按钮，点击后弹出表单
- 📝 **美观表单模态框** - 响应式设计，支持移动端
- ✅ **完整表单验证** - 实时验证，友好错误提示
- 🔒 **防垃圾提交** - 表单验证和提交限制
- 📱 **移动端优化** - 完美适配各种设备

### 后台管理
- 🔐 **安全登录系统** - 基于Supabase Auth
- 📊 **数据统计面板** - 实时统计各种状态数据
- 🔍 **多维度筛选** - 按状态、时间、关键词筛选
- 📋 **详细信息管理** - 查看、编辑、删除记录
- 📝 **状态管理** - 待处理、处理中、已完成、无效
- 💬 **备注系统** - 添加处理备注
- 📤 **Excel导出** - 一键导出筛选数据

### 数据库设计
- 🗄️ **完整数据模型** - 包含所有必要字段
- 🔒 **行级安全** - RLS策略保护数据
- ⚡ **性能优化** - 合理索引设计
- 🔄 **自动时间戳** - 创建和更新时间自动管理

## 技术栈

- **前端**: React + TypeScript + Tailwind CSS
- **后端**: Supabase (PostgreSQL + Auth + RLS)
- **路由**: React Router DOM
- **图标**: Lucide React
- **导出**: XLSX
- **状态管理**: React Hooks

## 快速开始

### 1. 环境配置

```bash
# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env
```

### 2. Supabase 设置

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 在项目设置中获取 URL 和 anon key
3. 更新 `.env` 文件：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 数据库初始化

在 Supabase SQL 编辑器中运行 `supabase/migrations/create_form_submissions.sql` 文件。

### 4. 创建管理员账号

在 Supabase Auth 面板中创建管理员用户账号。

### 5. 启动项目

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build
```

## 使用说明

### 前端表单使用

所有原有的按钮都已替换为 `FormButton` 组件，用户点击任何按钮都会弹出表单：

```tsx
import FormButton from './components/FormButton';

// 基础使用
<FormButton>免费试用</FormButton>

// 不同样式
<FormButton variant="outline">联系我们</FormButton>
<FormButton variant="secondary">了解更多</FormButton>
```

### 后台管理访问

访问 `/admin` 路径进入管理后台：

```
http://localhost:5173/admin
```

使用在 Supabase 中创建的管理员账号登录。

### 表单字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| company_name | string | ✅ | 公司名称 |
| user_name | string | ✅ | 用户姓名 |
| phone | string | ✅ | 联系电话（手机号验证） |
| company_types | array | ✅ | 公司类型（工厂/贸易商/工贸一体） |
| source_url | string | 自动 | 来源页面URL |
| status | enum | 自动 | 处理状态 |
| notes | string | 可选 | 处理备注 |

## 安全特性

### 数据安全
- ✅ 行级安全策略 (RLS)
- ✅ 表单提交公开，管理需认证
- ✅ SQL注入防护
- ✅ XSS防护

### 防垃圾提交
- ✅ 前端表单验证
- ✅ 手机号格式验证
- ✅ 必填字段检查
- ✅ 提交频率限制

## 部署说明

### 1. 构建项目
```bash
npm run build
```

### 2. 部署到静态托管
可以部署到 Netlify、Vercel、GitHub Pages 等平台。

### 3. 环境变量配置
在部署平台配置相同的环境变量。

## 数据备份

### 自动备份
Supabase 提供自动备份功能，在项目设置中可以配置。

### 手动导出
管理后台提供 Excel 导出功能，可以定期导出数据备份。

## 扩展功能

### 添加新字段
1. 修改数据库表结构
2. 更新 TypeScript 类型定义
3. 修改表单组件
4. 更新管理后台显示

### 自定义验证
在 `FormModal.tsx` 中的 `validateForm` 函数添加自定义验证逻辑。

### 邮件通知
可以集成邮件服务，在表单提交时发送通知邮件。

## 故障排除

### 常见问题

1. **表单提交失败**
   - 检查 Supabase 连接配置
   - 确认 RLS 策略正确设置

2. **管理后台无法登录**
   - 确认管理员账号已创建
   - 检查 Supabase Auth 配置

3. **数据不显示**
   - 检查数据库表是否创建成功
   - 确认 RLS 策略允许读取

### 调试模式

开启浏览器开发者工具，查看 Console 和 Network 面板获取详细错误信息。

## 技术支持

如有问题，请检查：
1. Supabase 项目状态
2. 环境变量配置
3. 数据库表结构
4. RLS 策略设置

## 许可证

MIT License