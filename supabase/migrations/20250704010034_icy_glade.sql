/*
  # 创建客户案例管理系统

  1. 新建表
    - `customer_cases` - 存储客户案例信息
      - `id` (uuid, 主键)
      - `company_name` (text, 公司名称)
      - `company_logo` (text, 公司logo字母或图片URL)
      - `industry` (text, 所属行业)
      - `description` (text, 案例描述)
      - `results` (text, 实施效果)
      - `metrics` (jsonb, 具体指标数据)
      - `is_featured` (boolean, 是否精选展示)
      - `sort_order` (integer, 排序顺序)
      - `status` (text, 状态：active/inactive)
      - `created_at` (timestamptz, 创建时间)
      - `updated_at` (timestamptz, 更新时间)

  2. 安全设置
    - 启用 RLS
    - 允许所有用户查看案例
    - 只允许认证用户管理案例
*/

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

-- 启用行级安全
ALTER TABLE customer_cases ENABLE ROW LEVEL SECURITY;

-- 允许所有用户查看激活状态的案例
CREATE POLICY "Anyone can view active cases"
  ON customer_cases
  FOR SELECT
  TO public
  USING (status = 'active');

-- 只允许认证用户管理案例
CREATE POLICY "Authenticated users can manage cases"
  ON customer_cases
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_customer_cases_status ON customer_cases(status);
CREATE INDEX IF NOT EXISTS idx_customer_cases_is_featured ON customer_cases(is_featured);
CREATE INDEX IF NOT EXISTS idx_customer_cases_sort_order ON customer_cases(sort_order);
CREATE INDEX IF NOT EXISTS idx_customer_cases_industry ON customer_cases(industry);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_customer_cases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_cases_updated_at
  BEFORE UPDATE ON customer_cases
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_cases_updated_at();

-- 插入示例数据
INSERT INTO customer_cases (company_name, company_logo, industry, description, results, metrics, is_featured, sort_order) VALUES
('华为技术有限公司', 'H', '通信设备', '华为作为全球领先的通信设备制造商，通过久火ERP系统实现了全球供应链的数字化管理。', '订单处理效率提升60%，库存周转率提高40%', '{"efficiency_improvement": "60%", "inventory_turnover": "40%", "cost_reduction": "25%"}', true, 1),
('比亚迪股份有限公司', 'B', '新能源汽车', '比亚迪通过久火ERP系统优化了新能源汽车的生产和供应链管理流程。', '供应链协同效率提升50%，成本降低25%', '{"supply_chain_efficiency": "50%", "cost_reduction": "25%", "delivery_time": "30%"}', true, 2),
('海康威视', 'H', '安防设备', '海康威视利用久火ERP系统提升了安防设备的客户服务和销售管理能力。', '客户响应速度提升70%，销售转化率提高35%', '{"response_speed": "70%", "conversion_rate": "35%", "customer_satisfaction": "90%"}', true, 3),
('大疆创新', 'D', '无人机制造', '大疆创新通过久火ERP系统实现了无人机产品的精细化生产管理。', '产品上市周期缩短30%，质量管控提升45%', '{"time_to_market": "30%", "quality_control": "45%", "production_efficiency": "35%"}', true, 4);