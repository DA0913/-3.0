# 数据库备份文件说明

## 备份时间
- 创建时间: 2025年7月17日 16:56

## 备份文件列表

### 1. full_database_backup.sql (20.9 KB)
- **内容**: 完整的数据库备份，包含表结构和所有数据
- **用途**: 完整恢复数据库
- **恢复命令**: 
  ```bash
  psql -d postgres -f full_database_backup.sql
  ```

### 2. schema_only_backup.sql (14.7 KB)
- **内容**: 仅包含数据库表结构，不包含数据
- **用途**: 创建新的空数据库结构
- **恢复命令**: 
  ```bash
  psql -d postgres -f schema_only_backup.sql
  ```

## 数据库表结构

### 主要表格:
1. **admin_users** - 管理员用户表
2. **case_configurations** - 案例配置表
3. **customer_cases** - 客户案例表
4. **featured_cases** - 精选案例表
5. **form_submissions** - 表单提交记录表
6. **news_articles** - 新闻文章表
7. **partner_cases** - 合作伙伴案例表

### 数据库特性:
- 包含完整的索引结构
- 包含触发器用于自动更新时间戳
- 包含约束和外键关系
- 支持UTF-8编码

## 恢复步骤

### 完整恢复:
```bash
# 1. 删除现有数据库（可选）
dropdb postgres

# 2. 创建新数据库
createdb postgres

# 3. 恢复数据
psql -d postgres -f full_database_backup.sql
```

### 仅恢复结构:
```bash
# 恢复表结构
psql -d postgres -f schema_only_backup.sql
```

## 注意事项
- 备份文件使用 `--clean --if-exists` 选项，恢复时会先删除现有表
- 不包含数据库用户和权限信息
- 适用于 PostgreSQL 数据库 