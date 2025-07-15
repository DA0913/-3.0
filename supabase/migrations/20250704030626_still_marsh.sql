/*
  # 创建案例配置管理系统

  1. 新建表
    - `case_configurations` - 存储案例配置信息
      - `id` (uuid, 主键)
      - `title` (text, 配置标题)
      - `subtitle` (text, 配置副标题)
      - `description` (text, 配置描述)
      - `company_name` (text, 公司名称)
      - `company_logo` (text, 公司logo)
      - `stock_code` (text, 股票代码)
      - `image_url` (text, 配置图片URL)
      - `link_url` (text, 链接地址)
      - `is_active` (boolean, 是否激活)
      - `sort_order` (integer, 排序顺序)
      - `created_at` (timestamptz, 创建时间)
      - `updated_at` (timestamptz, 更新时间)

  2. 安全设置
    - 启用 RLS
    - 允许所有用户查看激活的配置
    - 只允许认证用户管理配置
*/

CREATE TABLE IF NOT EXISTS case_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  company_name text NOT NULL,
  company_logo text NOT NULL DEFAULT 'C',
  stock_code text,
  image_url text,
  link_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 启用行级安全
ALTER TABLE case_configurations ENABLE ROW LEVEL SECURITY;

-- 允许所有用户查看激活状态的配置
CREATE POLICY "Anyone can view active configurations"
  ON case_configurations
  FOR SELECT
  TO public
  USING (is_active = true);

-- 只允许认证用户管理配置
CREATE POLICY "Authenticated users can manage configurations"
  ON case_configurations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_case_configurations_is_active ON case_configurations(is_active);
CREATE INDEX IF NOT EXISTS idx_case_configurations_sort_order ON case_configurations(sort_order);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_case_configurations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_case_configurations_updated_at
  BEFORE UPDATE ON case_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_case_configurations_updated_at();

-- 插入示例数据
INSERT INTO case_configurations (title, subtitle, description, company_name, company_logo, stock_code, image_url, sort_order) VALUES
('上市企业「安克创新」：用久火ERP加速数字化建设', 'Anker Innovations', '安克创新通过与久火ERP合作，加速数字化建设，智能集成业务、销售、库存等环节的关键数据，高效管理分析业务情况。', '安克创新', 'A', '300866', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
('五金品牌「巨星集团」：借助久火ERP征战全球', 'Great Star Tools', '巨星集团通过久火ERP系统，实现了全球化业务管理和供应链优化，显著提升了运营效率和市场竞争力。', '巨星集团', '巨', '002444', 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
('办公品牌「齐心科技」：借助久火ERP实现精细化管理', 'Comix Group', '齐心科技通过久火ERP系统，提升了办公用品的精细化管理水平，优化了供应链流程和客户服务质量。', '齐心科技', 'C', '002301', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800', 3);