-- 为customer_cases表添加联系人信息字段
-- 用于存储案例联系人的头像、姓名和职务信息

-- 添加联系人信息字段
ALTER TABLE customer_cases 
ADD COLUMN IF NOT EXISTS contact_avatar text,
ADD COLUMN IF NOT EXISTS contact_name text,
ADD COLUMN IF NOT EXISTS contact_position text;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_customer_cases_contact_name ON customer_cases(contact_name);

-- 添加注释说明字段用途
COMMENT ON COLUMN customer_cases.contact_avatar IS '联系人头像URL';
COMMENT ON COLUMN customer_cases.contact_name IS '联系人姓名';
COMMENT ON COLUMN customer_cases.contact_position IS '联系人职务';

-- 为现有数据设置默认联系人信息（使用公司名称首字母作为头像）
UPDATE customer_cases 
SET 
  contact_name = company_name || '负责人',
  contact_position = '企业负责人',
  contact_avatar = '/default-avatar.png'
WHERE contact_name IS NULL; 