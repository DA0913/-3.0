/*
  # 创建表单提交管理系统

  1. 新建表
    - `form_submissions` - 存储表单提交记录
      - `id` (uuid, 主键)
      - `company_name` (text, 公司名称)
      - `user_name` (text, 用户姓名)
      - `phone` (text, 联系电话)
      - `company_types` (text[], 公司类型数组)
      - `source_url` (text, 来源页面URL)
      - `status` (text, 处理状态)
      - `notes` (text, 处理备注)
      - `created_at` (timestamptz, 创建时间)
      - `updated_at` (timestamptz, 更新时间)

  2. 安全设置
    - 启用 RLS
    - 添加管理员访问策略
    - 添加公开提交策略
*/

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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 启用 RLS
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_company_name ON form_submissions(company_name);

-- 允许任何人插入表单数据（公开提交）
CREATE POLICY "Anyone can submit forms"
  ON form_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 只有认证用户可以查看和更新表单数据（管理员功能）
CREATE POLICY "Authenticated users can view all submissions"
  ON form_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update submissions"
  ON form_submissions
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete submissions"
  ON form_submissions
  FOR DELETE
  TO authenticated
  USING (true);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
CREATE TRIGGER update_form_submissions_updated_at
  BEFORE UPDATE ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();