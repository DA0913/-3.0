-- 更新客户案例表，添加图片URL支持
ALTER TABLE customer_cases 
ADD COLUMN IF NOT EXISTS image_url text;

-- 更新现有记录，将图片URL添加到metrics中
UPDATE customer_cases 
SET metrics = jsonb_set(
  COALESCE(metrics, '{}'),
  '{image_url}',
  '"https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"'
)
WHERE company_name = '华为技术有限公司';

UPDATE customer_cases 
SET metrics = jsonb_set(
  COALESCE(metrics, '{}'),
  '{image_url}',
  '"https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800"'
)
WHERE company_name = '比亚迪股份有限公司';

UPDATE customer_cases 
SET metrics = jsonb_set(
  COALESCE(metrics, '{}'),
  '{image_url}',
  '"https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"'
)
WHERE company_name = '海康威视';

UPDATE customer_cases 
SET metrics = jsonb_set(
  COALESCE(metrics, '{}'),
  '{image_url}',
  '"https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg?auto=compress&cs=tinysrgb&w=800"'
)
WHERE company_name = '大疆创新';