/*
  # 创建新闻文章管理系统

  1. 新建表
    - `news_articles` 表用于存储新闻文章
      - `id` (uuid, 主键)
      - `title` (text, 文章标题)
      - `category` (text, 文章分类)
      - `publish_time` (timestamptz, 发布时间)
      - `image_url` (text, 文章图片URL)
      - `summary` (text, 文章摘要)
      - `content` (text, 文章内容)
      - `views` (integer, 阅读量)
      - `is_featured` (boolean, 是否精选)
      - `created_at` (timestamptz, 创建时间)
      - `updated_at` (timestamptz, 更新时间)

  2. 安全策略
    - 启用 RLS
    - 允许所有用户查看文章
    - 只允许认证用户管理文章
*/

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

-- 启用行级安全
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- 允许所有用户查看文章
CREATE POLICY "Anyone can view articles"
  ON news_articles
  FOR SELECT
  TO public
  USING (true);

-- 只允许认证用户创建文章
CREATE POLICY "Authenticated users can create articles"
  ON news_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 只允许认证用户更新文章
CREATE POLICY "Authenticated users can update articles"
  ON news_articles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 只允许认证用户删除文章
CREATE POLICY "Authenticated users can delete articles"
  ON news_articles
  FOR DELETE
  TO authenticated
  USING (true);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_publish_time ON news_articles(publish_time DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_featured ON news_articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_articles_created_at ON news_articles(created_at DESC);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_news_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON news_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_news_articles_updated_at();

-- 插入示例数据
INSERT INTO news_articles (title, category, publish_time, image_url, summary, views, is_featured) VALUES
('久火ERP助力外贸企业数字化转型，订单处理效率提升60%', '公司新闻', '2024-12-20 10:30:00', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', '久火ERP通过智能化管理系统，帮助众多外贸企业实现数字化转型，显著提升运营效率。', 1250, true),
('2024年外贸行业发展趋势分析：数字化成为核心竞争力', '行业动态', '2024-12-19 14:20:00', 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800', '深度解析2024年外贸行业发展趋势，数字化转型已成为企业提升竞争力的关键因素。', 980, false),
('新版外贸政策解读：跨境电商迎来新机遇', '政策解读', '2024-12-18 09:15:00', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800', '详细解读最新外贸政策变化，为跨境电商企业带来的新机遇和挑战。', 756, true),
('久火ERP新功能发布：AI智能决策模块正式上线', '公司新闻', '2024-12-17 16:45:00', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800', 'AI智能决策模块的上线，将为外贸企业提供更精准的市场预测和业务决策支持。', 1100, false),
('全球供应链管理最佳实践：如何应对市场变化', '市场分析', '2024-12-16 11:30:00', 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=800', '分享全球供应链管理的最佳实践，帮助企业更好地应对市场变化和挑战。', 890, false),
('ERP系统选择指南：中小外贸企业如何选择合适的管理系统', '操作指南', '2024-12-15 13:20:00', 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800', '为中小外贸企业提供ERP系统选择的详细指南，帮助企业做出明智的决策。', 1350, true),
('客户成功案例：某知名制造企业通过久火ERP实现业务增长300%', '新闻中心', '2024-12-14 10:00:00', 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800', '深度分析客户成功案例，展示久火ERP如何帮助企业实现显著的业务增长。', 2100, true),
('2025年外贸数字化趋势预测：AI与大数据的深度融合', '行业动态', '2024-12-13 15:30:00', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800', '预测2025年外贸行业的数字化发展趋势，AI与大数据技术的应用前景。', 1680, false);