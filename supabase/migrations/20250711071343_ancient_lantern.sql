/*
  # Button Form Mapping System

  1. New Tables
    - `button_configs` - 存储按钮配置
      - `id` (uuid, primary key)
      - `name` (text, 按钮名称)
      - `description` (text, 按钮描述)
      - `module_name` (text, 所属模块)
      - `button_type` (text, 按钮类型)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `form_configs` - 存储表单配置
      - `id` (uuid, primary key)
      - `name` (text, 表单名称)
      - `description` (text, 表单描述)
      - `module_name` (text, 所属模块)
      - `form_url` (text, 表单API端点)
      - `form_config` (jsonb, 表单字段配置)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `button_form_mappings` - 存储按钮和表单的映射关系
      - `id` (uuid, primary key)
      - `button_id` (uuid, 关联按钮ID)
      - `form_id` (uuid, 关联表单ID)
      - `is_active` (boolean, 是否激活)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - 启用所有表的RLS
    - 添加适当的安全策略
*/

-- 创建按钮配置表
CREATE TABLE IF NOT EXISTS button_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  module_name text NOT NULL,
  button_type text NOT NULL DEFAULT 'primary',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建表单配置表
CREATE TABLE IF NOT EXISTS form_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  module_name text NOT NULL,
  form_url text NOT NULL,
  form_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建按钮表单映射表
CREATE TABLE IF NOT EXISTS button_form_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  button_id uuid NOT NULL REFERENCES button_configs(id) ON DELETE CASCADE,
  form_id uuid NOT NULL REFERENCES form_configs(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_button_configs_module_name ON button_configs(module_name);
CREATE INDEX IF NOT EXISTS idx_form_configs_module_name ON form_configs(module_name);
CREATE INDEX IF NOT EXISTS idx_button_form_mappings_button_id ON button_form_mappings(button_id);
CREATE INDEX IF NOT EXISTS idx_button_form_mappings_form_id ON button_form_mappings(form_id);
CREATE INDEX IF NOT EXISTS idx_button_form_mappings_is_active ON button_form_mappings(is_active);

-- 启用RLS
ALTER TABLE button_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE button_form_mappings ENABLE ROW LEVEL SECURITY;

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为每个表添加更新时间触发器
CREATE TRIGGER update_button_configs_updated_at
BEFORE UPDATE ON button_configs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_form_configs_updated_at
BEFORE UPDATE ON form_configs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_button_form_mappings_updated_at
BEFORE UPDATE ON button_form_mappings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 添加RLS策略
-- 匿名用户可以查看激活的映射
CREATE POLICY "Anyone can view active button form mappings"
ON button_form_mappings
FOR SELECT
TO anon
USING (is_active = true);

-- 已认证用户可以管理所有表
CREATE POLICY "Authenticated users can manage button configs"
ON button_configs
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage form configs"
ON form_configs
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage button form mappings"
ON button_form_mappings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 添加一些示例数据
INSERT INTO button_configs (name, description, module_name, button_type)
VALUES
  ('免费试用按钮', 'Hero区域的主要CTA按钮', 'hero', 'primary'),
  ('联系我们按钮', '联系页面的提交按钮', 'contact', 'primary'),
  ('获取方案按钮', '解决方案页面的咨询按钮', 'solutions', 'primary'),
  ('了解更多按钮', '产品页面的次要按钮', 'product', 'secondary'),
  ('预约演示按钮', '产品页面的主要按钮', 'product', 'primary');

INSERT INTO form_configs (name, description, module_name, form_url, form_config)
VALUES
  ('首页咨询表单', '首页Hero区域的主要咨询表单', 'hero', '/api/forms/hero-consultation', 
   '{
     "fields": [
       {"name": "company_name", "label": "公司名称", "type": "text", "required": true},
       {"name": "contact_name", "label": "联系人", "type": "text", "required": true},
       {"name": "phone", "label": "联系电话", "type": "tel", "required": true},
       {"name": "email", "label": "邮箱", "type": "email", "required": false}
     ],
     "styling": {"theme": "primary", "primaryColor": "#194fe8"},
     "behavior": {"showProgress": true, "autoSave": true}
   }'::jsonb),
  ('联系页表单', '联系我们页面的表单', 'contact', '/api/forms/contact-form',
   '{
     "fields": [
       {"name": "name", "label": "姓名", "type": "text", "required": true},
       {"name": "email", "label": "邮箱", "type": "email", "required": true},
       {"name": "message", "label": "留言内容", "type": "textarea", "required": true}
     ],
     "styling": {"theme": "secondary", "primaryColor": "#10b981"},
     "behavior": {"showProgress": false, "redirectAfterSubmit": "/thank-you"}
   }'::jsonb),
  ('解决方案咨询表单', '解决方案页面的咨询表单', 'solutions', '/api/forms/solutions-form',
   '{
     "fields": [
       {"name": "company_name", "label": "公司名称", "type": "text", "required": true},
       {"name": "industry", "label": "所属行业", "type": "select", "required": true, "options": ["制造业", "贸易", "服务业"]},
       {"name": "requirements", "label": "需求描述", "type": "textarea", "required": true}
     ],
     "styling": {"theme": "primary", "primaryColor": "#194fe8"},
     "behavior": {"showProgress": true, "autoSave": false}
   }'::jsonb),
  ('产品试用表单', '产品页面的试用申请表单', 'product', '/api/forms/product-trial',
   '{
     "fields": [
       {"name": "company_name", "label": "公司名称", "type": "text", "required": true},
       {"name": "industry", "label": "所属行业", "type": "select", "required": true, "options": ["制造业", "贸易", "服务业"]},
       {"name": "company_size", "label": "公司规模", "type": "radio", "required": true, "options": ["1-50人", "51-200人", "200+人"]},
       {"name": "requirements", "label": "具体需求", "type": "textarea", "required": false}
     ],
     "styling": {"theme": "secondary", "primaryColor": "#10b981"},
     "behavior": {"showProgress": false, "redirectAfterSubmit": "/thank-you"}
   }'::jsonb);

INSERT INTO button_form_mappings (button_id, form_id, is_active)
VALUES
  ((SELECT id FROM button_configs WHERE name = '免费试用按钮'), 
   (SELECT id FROM form_configs WHERE name = '首页咨询表单'), 
   true),
  ((SELECT id FROM button_configs WHERE name = '联系我们按钮'), 
   (SELECT id FROM form_configs WHERE name = '联系页表单'), 
   true),
  ((SELECT id FROM button_configs WHERE name = '获取方案按钮'), 
   (SELECT id FROM form_configs WHERE name = '解决方案咨询表单'), 
   true);