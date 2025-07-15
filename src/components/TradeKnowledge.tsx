import React, { useState, useEffect } from 'react';
import { memo, useMemo, useCallback } from 'react';
import { 
  Calendar, 
  Tag, 
  Search, 
  Filter, 
  Clock, 
  TrendingUp,
  BookOpen,
  Globe,
  Users,
  ArrowRight,
  Eye,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Phone
} from 'lucide-react';
import { db } from '../lib/database';
import NewsDetail from './NewsDetail';

// Type definition
interface NewsArticle {
  id: string;
  title: string;
  category: string;
  publish_time: string;
  image_url?: string;
  summary?: string;
  content?: string;
  views: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
import FormButton from './FormButton';
import { formatDate } from '../utils/dateUtils';

// 预定义的模拟数据，避免每次渲染重新创建
const MOCK_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: '久火ERP助力外贸企业数字化转型，订单处理效率提升60%',
    category: '公司新闻',
    publish_time: '2024-12-20 10:30:00',
    image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    summary: '久火ERP通过智能化管理系统，帮助众多外贸企业实现数字化转型，显著提升运营效率。',
    views: 1250,
    is_featured: true,
    created_at: '2024-12-20T10:30:00Z',
    updated_at: '2024-12-20T10:30:00Z'
  },
  {
    id: '2',
    title: '2024年外贸行业发展趋势分析：数字化成为核心竞争力',
    category: '行业动态',
    publish_time: '2024-12-19 14:20:00',
    image_url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
    summary: '深度解析2024年外贸行业发展趋势，数字化转型已成为企业提升竞争力的关键因素。',
    views: 980,
    is_featured: false,
    created_at: '2024-12-19T14:20:00Z',
    updated_at: '2024-12-19T14:20:00Z'
  },
  {
    id: '3',
    title: '新版外贸政策解读：跨境电商迎来新机遇',
    category: '政策解读',
    publish_time: '2024-12-18 09:15:00',
    image_url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    summary: '详细解读最新外贸政策变化，为跨境电商企业带来的新机遇和挑战。',
    views: 756,
    is_featured: true,
    created_at: '2024-12-18T09:15:00Z',
    updated_at: '2024-12-18T09:15:00Z'
  },
  {
    id: '4',
    title: '久火ERP新功能发布：AI智能决策模块正式上线',
    category: '公司新闻',
    publish_time: '2024-12-17 16:45:00',
    image_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    summary: 'AI智能决策模块的上线，将为外贸企业提供更精准的市场预测和业务决策支持。',
    views: 1100,
    is_featured: false,
    created_at: '2024-12-17T16:45:00Z',
    updated_at: '2024-12-17T16:45:00Z'
  },
  {
    id: '5',
    title: '全球供应链管理最佳实践：如何应对市场变化',
    category: '市场分析',
    publish_time: '2024-12-16 11:30:00',
    image_url: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=800',
    summary: '分享全球供应链管理的最佳实践，帮助企业更好地应对市场变化和挑战。',
    views: 890,
    is_featured: false,
    created_at: '2024-12-16T11:30:00Z',
    updated_at: '2024-12-16T11:30:00Z'
  },
  {
    id: '6',
    title: 'ERP系统选择指南：中小外贸企业如何选择合适的管理系统',
    category: '操作指南',
    publish_time: '2024-12-15 13:20:00',
    image_url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    summary: '为中小外贸企业提供ERP系统选择的详细指南，帮助企业做出明智的决策。',
    views: 1350,
    is_featured: true,
    created_at: '2024-12-15T13:20:00Z',
    updated_at: '2024-12-15T13:20:00Z'
  },
  {
    id: '7',
    title: '客户成功案例：某知名制造企业通过久火ERP实现业务增长300%',
    category: '新闻中心',
    publish_time: '2024-12-14 10:00:00',
    image_url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    summary: '深度分析客户成功案例，展示久火ERP如何帮助企业实现显著的业务增长。',
    views: 2100,
    is_featured: true,
    created_at: '2024-12-14T10:00:00Z',
    updated_at: '2024-12-14T10:00:00Z'
  },
  {
    id: '8',
    title: '2025年外贸数字化趋势预测：AI与大数据的深度融合',
    category: '行业动态',
    publish_time: '2024-12-13 15:30:00',
    image_url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    summary: '预测2025年外贸行业的数字化发展趋势，AI与大数据技术的应用前景。',
    views: 1680,
    is_featured: false,
    created_at: '2024-12-13T15:30:00Z',
    updated_at: '2024-12-13T15:30:00Z'
  }
];

// 预定义分类数据
const CATEGORIES = [
  { value: 'all', label: '全部资讯', count: 0 },
  { value: '公司新闻', label: '公司新闻', count: 0 },
  { value: '新闻中心', label: '新闻中心', count: 0 },
  { value: '行业动态', label: '行业动态', count: 0 },
  { value: '政策解读', label: '政策解读', count: 0 },
  { value: '市场分析', label: '市场分析', count: 0 },
  { value: '操作指南', label: '操作指南', count: 0 }
];

const TradeKnowledge = memo(() => {
  const [articles, setArticles] = useState<NewsArticle[]>(MOCK_ARTICLES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // 检查ID是否有效
  const isValidID = useCallback((id: string): boolean => {
    // 支持UUID和其他格式的ID
    return Boolean(id && id.length > 0);
  }, []); 

  // 优化的数据获取函数
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await db.getNewsArticles({ limit: 20 });

      if (response.error) {
        console.warn('获取文章失败，使用默认数据:', response.error);
        // Don't set error state, just use default data
      } else if (response.data && response.data.length > 0) {
        setArticles(response.data);
      }
    } catch (error) {
      console.warn('获取文章失败，使用默认数据:', error);
      // Don't set error state, just use default data silently
    } finally {
      setLoading(false);
    }
  }, []);

  // 优化的筛选函数
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.summary?.toLowerCase().includes(searchLower)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    return filtered;
  }, [articles, searchTerm, selectedCategory]);

  // 优化的分类统计
  const categoryStats = useMemo(() => {
    return CATEGORIES.map(cat => ({
      ...cat,
      count: cat.value === 'all' ? articles.length : articles.filter(a => a.category === cat.value).length
    }));
  }, [articles]);

  // 优化的文章分组
  const { featuredArticles, regularArticles } = useMemo(() => {
    const featured = filteredArticles.filter(article => article.is_featured);
    const regular = filteredArticles.filter(article => !article.is_featured);
    return { featuredArticles: featured, regularArticles: regular };
  }, [filteredArticles]);

  // 优化的文章点击处理
  const handleArticleClick = useCallback(async (article: NewsArticle) => {
    // 更新阅读量
    if (isValidID(article.id)) {
      try {
        await db.updateNewsArticle(article.id, { views: article.views + 1 });
      } catch (error) {
        console.error('更新阅读量失败:', error);
      }
    }
    
    // 更新本地状态
    setArticles(prev => 
      prev.map(a => 
        a.id === article.id ? { ...a, views: a.views + 1 } : a
      ) 
    );
    
    setSelectedArticle(article);
  }, [isValidID]);

  // 优化的相关文章点击处理
  const handleRelatedArticleClick = useCallback(async (relatedArticle: NewsArticle) => {
    // 更新阅读量
    if (isValidID(relatedArticle.id)) {
      try {
        await db.updateNewsArticle(relatedArticle.id, { views: relatedArticle.views + 1 });
      } catch (error) {
        console.error('更新阅读量失败:', error);
      }
    }
    
    // 更新本地状态
    setArticles(prev => 
      prev.map(a => 
        a.id === relatedArticle.id ? { ...a, views: a.views + 1 } : a
      ) 
    );
    
    setSelectedArticle(relatedArticle);
  }, [isValidID]);

  // 优化的事件处理函数
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev); 
  }, []);

  const handleCategorySelect = useCallback((categoryValue: string) => {
    setSelectedCategory(categoryValue);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); 
  }, []);

  // 延迟加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [fetchArticles]);

  // 如果选择了文章，显示文章详情
  if (selectedArticle) {
    return (
      <NewsDetail 
        article={selectedArticle}  
        onBack={() => setSelectedArticle(null)}
        onArticleClick={handleRelatedArticleClick}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 w-full"> 
      {/* Banner区域 */}
      <section className="relative min-h-[500px] flex items-center overflow-hidden py-16 w-full">
        <div className="absolute inset-0">
          <img
            src="/2dedee27edae73e00af82b262d86584e898c6085369e50-DvbSFE (1).jpg"
            alt="外贸智库背景"
            className="w-full h-full object-cover object-center"
            loading="lazy" 
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm mb-6">
              <div className="w-2 h-2 bg-[#194fe8] rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">外贸智库</span> 
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              洞察行业趋势，赋能实战运营
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto mb-8">
              汇聚外贸政策解读、数字化转型指南、标杆案例分析，助力企业少走弯路 
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <FormButton>
                免费试用30天
              </FormButton>
              <FormButton variant="outline">
                <Phone className="w-5 h-5" /> 
                <span>400-026-2606</span>
              </FormButton>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8"> 
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 左侧边栏 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-24">
              {/* 搜索框 */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> 
                  <input
                    type="text"
                    placeholder="搜索资讯..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                  />
                </div>
              </div>

              {/* 分类筛选 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">资讯分类</h3>
                  <button 
                    onClick={toggleFilters}
                    className="lg:hidden text-gray-500"
                  >
                    {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className={`space-y-2 ${showFilters ? 'block' : 'hidden lg:block'}`}> 
                  {categoryStats.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => handleCategorySelect(category.value)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.value
                          ? 'bg-[#194fe8] text-white'
                          : 'text-gray-700 hover:bg-gray-50' 
                      }`}
                    >
                      <span className="font-medium">{category.label}</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        selectedCategory === category.value
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}> 
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 热门标签 */}
              <div> 
                <h3 className="text-lg font-semibold text-gray-900 mb-4">热门标签</h3>
                <div className="flex flex-wrap gap-2">
                  {['数字化转型', 'AI智能', '供应链管理', '跨境电商', '政策解读', '市场分析'].map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                    >
                      {tag} 
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 主要内容区域 */ }
          <div className="lg:col-span-3">
            {/* 加载状态 */}
            {loading && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-[#194fe8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">正在加载最新资讯...</p>
              </div>
            )}

            {/* 错误状态 */}
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"> 
                <p className="text-yellow-800 text-sm">{error}</p>
              </div>
            )}

            {/* 精选文章 */}
            {!loading && featuredArticles.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center space-x-2 mb-6"> 
                  <TrendingUp className="w-5 h-5 text-[#194fe8]" />
                  <h2 className="text-2xl font-bold text-gray-900">精选推荐</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredArticles.slice(0, 4).map((article) => (
                    <article
                      key={article.id} 
                      onClick={() => handleArticleClick(article)}
                      className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer group"
                    >
                      {article.image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            loading="lazy"
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="px-3 py-1 bg-[#194fe8] text-white text-xs font-medium rounded-full"> 
                            {article.category}
                          </span>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(article.publish_time)}
                          </div>
                        </div>
                         
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-[#194fe8] transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        
                        {article.summary && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {article.summary}
                          </p>
                        )}
                         
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-500 text-sm">
                            <Eye className="w-4 h-4 mr-1" />
                            {article.views} 阅读
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#194fe8] group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* 最新资讯 */}
            {!loading && (
              <div>
                <div className="flex items-center justify-between mb-6"> 
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-[#194fe8]" />
                    <h2 className="text-2xl font-bold text-gray-900">最新资讯</h2>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    共 {filteredArticles.length} 篇文章
                  </div>
                </div>

                {/* 文章列表 */}
                <div className="space-y-6">
                  {regularArticles.map((article) => (
                    <article
                      key={article.id} 
                      onClick={() => handleArticleClick(article)}
                      className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-start space-x-4">
                        {article.image_url && (
                          <div className="flex-shrink-0 w-32 h-24 overflow-hidden rounded-lg">
                            <img
                              src={article.image_url} 
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0"> 
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                              {article.category}
                            </span>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(article.publish_time, true)}
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Eye className="w-4 h-4 mr-1" />
                              {article.views}
                            </div>
                          </div> 
                          
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#194fe8] transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          
                          {article.summary && (
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {article.summary}
                            </p>
                          )}
                           
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>阅读全文</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#194fe8] group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* 加载更多 */}
                {filteredArticles.length > 0 && (
                  <div className="text-center mt-12">
                    <button className="bg-[#194fe8] hover:bg-[#1640c7] text-white font-medium py-3 px-8 rounded-lg transition-colors"> 
                      加载更多资讯
                    </button>
                  </div>
                )}

                {/* 无结果提示 */}
                {filteredArticles.length === 0 && !loading && (
                  <div className="text-center py-12"> 
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">暂无相关资讯</h3>
                    <p className="text-gray-500">请尝试调整搜索条件或浏览其他分类</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

TradeKnowledge.displayName = 'TradeKnowledge';

export default TradeKnowledge;