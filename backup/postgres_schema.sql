-- PostgreSQL Database Schema for ERP System
-- Generated from Supabase migrations

-- ================================
-- 1. Form Submissions Table
-- ================================

-- 创建表单提交表
CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  user_name text NOT NULL,
  phone text NOT NULL,
  company_types text[] NOT NULL DEFAULT '{}',
  source_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'invalid')),
  notes text,
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_company_name ON form_submissions(company_name);

-- ================================
-- 2. News Articles Table
-- ================================

CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT '公司新闻',
  publish_time timestamptz DEFAULT now(),
  image_url text,
  summary text,
  content text,
  views integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_publish_time ON news_articles(publish_time DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_featured ON news_articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_articles_created_at ON news_articles(created_at DESC);

-- ================================
-- 3. Customer Cases Table
-- ================================

CREATE TABLE IF NOT EXISTS customer_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  company_logo text NOT NULL DEFAULT 'C',
  industry text NOT NULL,
  description text NOT NULL,
  results text NOT NULL,
  metrics jsonb DEFAULT '{}',
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_customer_cases_status ON customer_cases(status);
CREATE INDEX IF NOT EXISTS idx_customer_cases_is_featured ON customer_cases(is_featured);
CREATE INDEX IF NOT EXISTS idx_customer_cases_sort_order ON customer_cases(sort_order);
CREATE INDEX IF NOT EXISTS idx_customer_cases_industry ON customer_cases(industry);

-- ================================
-- 4. Featured Cases Table
-- ================================

CREATE TABLE IF NOT EXISTS featured_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company_name text NOT NULL,
  industry text NOT NULL,
  description text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_featured_cases_is_active ON featured_cases(is_active);
CREATE INDEX IF NOT EXISTS idx_featured_cases_sort_order ON featured_cases(sort_order);

-- ================================
-- 5. Partner Cases Table
-- ================================

CREATE TABLE IF NOT EXISTS partner_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  logo_url text,
  industry text NOT NULL,
  description text NOT NULL,
  results text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_partner_cases_is_active ON partner_cases(is_active);
CREATE INDEX IF NOT EXISTS idx_partner_cases_sort_order ON partner_cases(sort_order);
CREATE INDEX IF NOT EXISTS idx_partner_cases_industry ON partner_cases(industry);

-- ================================
-- 6. Case Configuration Table (for unified management)
-- ================================

CREATE TABLE IF NOT EXISTS case_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  company_name text NOT NULL,
  company_logo text NOT NULL,
  stock_code text,
  image_url text,
  link_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_case_configurations_is_active ON case_configurations(is_active);
CREATE INDEX IF NOT EXISTS idx_case_configurations_sort_order ON case_configurations(sort_order);

-- ================================
-- 7. Admin Users Table
-- ================================

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text DEFAULT 'admin',
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- ================================
-- 8. Triggers for updated_at
-- ================================

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表创建触发器
CREATE TRIGGER update_form_submissions_updated_at
  BEFORE UPDATE ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON news_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_cases_updated_at
  BEFORE UPDATE ON customer_cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_featured_cases_updated_at
  BEFORE UPDATE ON featured_cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_cases_updated_at
  BEFORE UPDATE ON partner_cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_configurations_updated_at
  BEFORE UPDATE ON case_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 9. Sample Data
-- ================================

-- 插入示例新闻数据
INSERT INTO news_articles (title, category, publish_time, image_url, summary, views, is_featured) VALUES
('久火ERP助力外贸企业数字化转型，订单处理效率提升60%', '公司新闻', '2024-12-20 10:30:00', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', '久火ERP通过智能化管理系统，帮助众多外贸企业实现数字化转型，显著提升运营效率。', 1250, true),
('2024年外贸行业发展趋势分析：数字化成为核心竞争力', '行业动态', '2024-12-19 14:20:00', 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800', '深度解析2024年外贸行业发展趋势，数字化转型已成为企业提升竞争力的关键因素。', 980, false),
('新版外贸政策解读：跨境电商迎来新机遇', '政策解读', '2024-12-18 09:15:00', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800', '详细解读最新外贸政策变化，为跨境电商企业带来的新机遇和挑战。', 756, true);

-- 插入示例客户案例数据
INSERT INTO customer_cases (company_name, company_logo, industry, description, results, metrics, is_featured, sort_order) VALUES
('华为技术有限公司', 'H', '通信设备', '华为作为全球领先的通信设备制造商，通过久火ERP系统实现了全球供应链的数字化管理。', '订单处理效率提升60%，库存周转率提高40%', '{"efficiency_improvement": "60%", "inventory_turnover": "40%", "cost_reduction": "25%"}', true, 1),
('比亚迪股份有限公司', 'B', '新能源汽车', '比亚迪通过久火ERP系统优化了新能源汽车的生产和供应链管理流程。', '供应链协同效率提升50%，成本降低25%', '{"supply_chain_efficiency": "50%", "cost_reduction": "25%", "delivery_time": "30%"}', true, 2);

-- 创建默认管理员用户（密码: admin123，请在生产环境中修改）
INSERT INTO admin_users (email, password_hash) VALUES
('admin@example.com', '$2b$10$rOKjTKUAEBRTBLF/mJPZ5.RU6VWfRDYzb4G8hFiVGmHw6H.E3pJ.S'); 