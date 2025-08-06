-- 为customer_cases表添加显示控制字段
-- 用于控制案例在首页、精选banner、合作案例区的显示

-- 添加新字段
ALTER TABLE customer_cases 
ADD COLUMN IF NOT EXISTS show_on_homepage boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS show_in_banner boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS show_in_partners boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS case_title text,
ADD COLUMN IF NOT EXISTS case_summary text,
ADD COLUMN IF NOT EXISTS detail_url text,
ADD COLUMN IF NOT EXISTS company_size text,
ADD COLUMN IF NOT EXISTS highlight_tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS company_description text,
ADD COLUMN IF NOT EXISTS image_url text;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_customer_cases_show_on_homepage ON customer_cases(show_on_homepage);
CREATE INDEX IF NOT EXISTS idx_customer_cases_show_in_banner ON customer_cases(show_in_banner);
CREATE INDEX IF NOT EXISTS idx_customer_cases_show_in_partners ON customer_cases(show_in_partners);

-- 更新现有数据的显示设置
-- 将is_featured为true的案例设置为在banner显示
UPDATE customer_cases 
SET show_in_banner = true 
WHERE is_featured = true;

-- 将is_featured为false的案例设置为在合作案例区显示
UPDATE customer_cases 
SET show_in_partners = true 
WHERE is_featured = false;

-- 添加注释说明字段用途
COMMENT ON COLUMN customer_cases.show_on_homepage IS '是否在首页客户案例区显示';
COMMENT ON COLUMN customer_cases.show_in_banner IS '是否在客户案例页banner区显示';
COMMENT ON COLUMN customer_cases.show_in_partners IS '是否在合作案例区显示';
COMMENT ON COLUMN customer_cases.case_title IS '案例标题';
COMMENT ON COLUMN customer_cases.case_summary IS '案例摘要';
COMMENT ON COLUMN customer_cases.detail_url IS '详情链接';
COMMENT ON COLUMN customer_cases.company_size IS '企业规模';
COMMENT ON COLUMN customer_cases.highlight_tags IS '高亮标签';
COMMENT ON COLUMN customer_cases.company_description IS '企业描述';
COMMENT ON COLUMN customer_cases.image_url IS '案例图片URL'; 