# 管理员账号设置指南

## 1. 创建管理员账号

### 方法一：在Supabase控制台创建
1. 登录您的 [Supabase 项目控制台](https://supabase.com/dashboard)
2. 进入 **Authentication** > **Users** 页面
3. 点击 **Add user** 按钮
4. 填写管理员信息：
   - **Email**: `admin@jiufire.com` (推荐使用公司域名)
   - **Password**: 设置一个强密码，如 `JiuFire2024!`
   - **Email Confirm**: 选择 `true` (已确认邮箱)
5. 点击 **Create user** 完成创建

### 方法二：使用SQL创建
在Supabase SQL编辑器中执行：

```sql
-- 创建管理员用户
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@jiufire.com',
  crypt('JiuFire2024!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

## 2. 推荐的管理员邮箱地址

### 主管理员账号
- **邮箱**: `admin@jiufire.com`
- **用途**: 系统主管理员
- **权限**: 完全访问权限

### 备用管理员账号
- **邮箱**: `manager@jiufire.com`
- **用途**: 业务管理员
- **权限**: 数据查看和处理权限

### 技术支持账号
- **邮箱**: `support@jiufire.com`
- **用途**: 技术支持人员
- **权限**: 系统维护权限

## 3. 安全建议

### 密码要求
- 至少8位字符
- 包含大小写字母
- 包含数字和特殊字符
- 示例：`JiuFire2024!`、`Admin@123456`

### 邮箱选择建议
1. **使用公司域名**: 如 `@jiufire.com`
2. **避免个人邮箱**: 不建议使用 `@gmail.com`、`@qq.com` 等
3. **功能性命名**: 如 `admin`、`manager`、`support`

## 4. 快速设置步骤

1. **创建管理员账号**：
   ```
   邮箱: admin@jiufire.com
   密码: JiuFire2024!
   ```

2. **测试登录**：
   - 访问 `/admin` 页面
   - 使用上述邮箱和密码登录

3. **验证权限**：
   - 确认能够查看表单提交记录
   - 测试数据筛选和导出功能

## 5. 常见问题解决

### 登录失败
- 确认邮箱地址拼写正确
- 确认密码大小写正确
- 检查Supabase项目连接状态

### 权限不足
- 确认用户已在Supabase中创建
- 检查RLS策略是否正确配置
- 验证环境变量配置

## 6. 环境变量检查

确认 `.env` 文件中的配置：
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 联系支持

如果遇到问题，请检查：
1. Supabase项目状态
2. 网络连接
3. 浏览器控制台错误信息