import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  Tag, 
  Share2, 
  BookOpen,
  Clock,
  User,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { db } from '../lib/database';
import { formatDate, formatTime } from '../utils/dateUtils';

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

interface NewsDetailProps {
  article: NewsArticle; 
  onBack: () => void;
  onArticleClick?: (article: NewsArticle) => void;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ article, onBack, onArticleClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);

  // ID validation function
  const isValidID = (id: string): boolean => {
    // 支持UUID和其他格式的ID
    return Boolean(id && id.length > 0);
  };

  // 提取文章关键词的函数
  const extractKeywords = (article: NewsArticle): string[] => {
    const keywords: string[] = [];
    
    // 从标题中提取关键词
    const titleKeywords = [
      'ERP', 'AI', '智能', '数字化', '转型', '外贸', '管理', '系统',
      '供应链', '客户', '订单', '物流', '财务', '分析', '决策',
      '自动化', '效率', '优化', '创新', '技术', '解决方案',
      '企业', '业务', '流程', '数据', '平台', '服务'
    ];
    
    titleKeywords.forEach(keyword => {
      if (article.title.includes(keyword)) {
        keywords.push(keyword);
      }
    });

    // 从分类中提取关键词
    keywords.push(article.category);

    // 从摘要中提取关键词（如果存在）
    if (article.summary) {
      titleKeywords.forEach(keyword => {
        if (article.summary!.includes(keyword)) {
          keywords.push(keyword);
        }
      });
    }

    return [...new Set(keywords)]; // 去重
  };

  // 计算文章相关度的函数
  const calculateRelevance = (currentArticle: NewsArticle, candidateArticle: NewsArticle): number => {
    if (currentArticle.id === candidateArticle.id) return 0; // 排除自己

    let score = 0;
    const currentKeywords = extractKeywords(currentArticle);
    const candidateKeywords = extractKeywords(candidateArticle);

    // 1. 分类匹配（权重：30%）
    if (currentArticle.category === candidateArticle.category) {
      score += 30;
    }

    // 2. 关键词匹配（权重：40%）
    const matchingKeywords = currentKeywords.filter(keyword => 
      candidateKeywords.includes(keyword)
    );
    score += (matchingKeywords.length / Math.max(currentKeywords.length, 1)) * 40;

    // 3. 时效性（权重：20%）
    const currentDate = new Date();
    const articleDate = new Date(candidateArticle.publish_time);
    const daysDiff = Math.abs((currentDate.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) score += 20;      // 一周内：满分
    else if (daysDiff <= 30) score += 15; // 一月内：75%
    else if (daysDiff <= 90) score += 10; // 三月内：50%
    else score += 5;                      // 更早：25%

    // 4. 阅读量热度（权重：10%）
    if (candidateArticle.views > 1000) score += 10;
    else if (candidateArticle.views > 500) score += 7;
    else if (candidateArticle.views > 100) score += 5;
    else score += 2;

    return score;
  };

  // 获取相关文章
  const fetchRelatedArticles = async () => {
    try {
      // 尝试从数据库获取文章
      const response = await db.getNewsArticles({ limit: 20 });

      let allArticles: NewsArticle[] = [];

      if (response.error || !response.data || response.data.length === 0) {
        // 如果数据库查询失败，使用模拟数据 
        allArticles = getMockRelatedArticles();
      } else {
        // 排除当前文章
        allArticles = response.data.filter(a => a.id !== article.id);
      }

      // 计算相关度并排序
      const articlesWithRelevance = allArticles.map(candidateArticle => ({
        article: candidateArticle, 
        relevance: calculateRelevance(article, candidateArticle)
      }));

      // 按相关度排序，取前2篇（紧凑布局）
      const sortedArticles = articlesWithRelevance
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 2)
        .map(item => item.article); 

      setRelatedArticles(sortedArticles);
    } catch (error) {
      console.error('获取相关文章失败:', error);
      // 降级到模拟数据
      setRelatedArticles(getMockRelatedArticles());
    }
  };

  // 模拟相关文章数据（基于当前文章主题智能匹配）
  const getMockRelatedArticles = (): NewsArticle[] => {
    const currentKeywords = extractKeywords(article); 
    
    // 根据当前文章关键词生成相关文章
    const mockArticlesPool: NewsArticle[] = [
      {
        id: 'related-erp-1',
        title: '外贸企业如何选择合适的ERP系统',
        category: article.category === '操作指南' ? '操作指南' : '市场分析',
        publish_time: '2024-12-19 14:20:00', 
        image_url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
        summary: '为外贸企业提供ERP系统选择的详细指南和实用建议...',
        content: '详细的ERP选择指南内容...',
        views: 890,
        is_featured: false,
        created_at: '2024-12-19T14:20:00Z',
        updated_at: '2024-12-19T14:20:00Z'
      },
      {
        id: 'related-digital-1',
        title: '数字化转型成功案例分析',
        category: article.category === '新闻中心' ? '新闻中心' : '行业动态',
        publish_time: '2024-12-18 09:15:00', 
        image_url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
        summary: '深度分析成功企业的数字化转型经验和关键要素...',
        content: '数字化转型案例分析内容...',
        views: 756,
        is_featured: true,
        created_at: '2024-12-18T09:15:00Z',
        updated_at: '2024-12-18T09:15:00Z'
      }
    ];

    // 根据关键词匹配计算相关度
    const articlesWithRelevance = mockArticlesPool.map(candidateArticle => ({
      article: candidateArticle,
      relevance: calculateRelevance(article, candidateArticle) 
    }));

    // 按相关度排序，取前2篇
    return articlesWithRelevance
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 2)
      .map(item => item.article);
  };

  useEffect(() => {
    setIsLoading(true);
    // 模拟加载过程
    setTimeout(() => { 
      setIsLoading(false);
    }, 500);
    
    // 获取相关文章
    fetchRelatedArticles();
  }, [article.id]);

  const handleRelatedArticleClick = (relatedArticle: NewsArticle) => { 
    if (onArticleClick) {
      onArticleClick(relatedArticle);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-16"> 
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16"> 
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-[#194fe8] hover:text-[#1640c7] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回资讯列表</span> 
        </button>

        {/* 文章内容 */}
        <article className="bg-white">
          {/* 分类标签 */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-[#194fe8] text-white text-sm font-medium rounded">
              {article.category} 
            </span>
          </div>

          {/* 文章标题 */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* 文章元信息 */}
          <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" /> 
              <span>{formatDate(article.publish_time)} {formatTime(article.publish_time, true)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{article.views} 阅读</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" /> 
              <span>久火ERP编辑部</span>
            </div>
          </div>

          {/* 文章摘要 */}
          {article.summary && (
            <div className="mb-8 p-4 bg-blue-50 border-l-4 border-[#194fe8] rounded-r">
              <div className="flex items-start space-x-3"> 
                <BookOpen className="w-5 h-5 text-[#194fe8] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">文章摘要</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 文章封面图 */}
          {article.image_url && (
            <div className="mb-8"> 
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-auto rounded-lg shadow-sm"
              />
            </div>
          )}

          {/* 文章正文 */}
          <div className="prose prose-lg max-w-none mb-12">
            {article.content ? ( 
              <div 
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <div className="text-gray-800 leading-relaxed space-y-6">
                <p>
                  随着全球贸易数字化进程的加速，外贸企业面临着前所未有的机遇和挑战。 
                  久火ERP作为专业的外贸管理系统，致力于为企业提供全链路的数字化解决方案。
                </p>
                
                <p>
                  在当前的市场环境下，传统的外贸管理模式已经无法满足企业快速发展的需求。
                  企业需要更加智能化、自动化的管理工具来提升运营效率，降低成本，增强竞争力。
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4"> 
                  数字化转型的核心价值
                </h3>
                
                <p>
                  数字化转型不仅仅是技术的升级，更是企业管理理念和运营模式的全面革新。
                  通过实施ERP系统，企业可以实现：
                </p>

                <ul className="list-disc list-inside space-y-2 ml-4"> 
                  <li>业务流程的标准化和自动化</li>
                  <li>数据的实时采集和智能分析</li>
                  <li>跨部门协作效率的显著提升</li>
                  <li>客户服务质量的持续改善</li>
                  <li>决策支持的科学化和精准化</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4"> 
                  久火ERP的独特优势
                </h3>

                <p>
                  久火ERP基于多年的行业经验和技术积累，为外贸企业量身定制了一套完整的管理解决方案：
                </p>

                <div className="bg-gray-50 rounded-lg p-6 my-6"> 
                  <h4 className="font-semibold text-gray-900 mb-3">核心功能模块</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <strong>PDM产品管理：</strong>全生命周期产品管理
                    </div>
                    <div>
                      <strong>SRM供应链：</strong>智能供应商关系管理
                    </div>
                    <div>
                      <strong>CRM客户管理：</strong>精准客户营销管理
                    </div>
                    <div>
                      <strong>OMS订单管理：</strong>高效订单协同处理
                    </div>
                  </div>
                </div>

                <p>
                  通过这些模块的有机结合，企业可以实现从产品设计到客户服务的全流程数字化管理，
                  大幅提升运营效率和客户满意度。
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4"> 
                  未来发展趋势
                </h3>

                <p>
                  展望未来，外贸行业的数字化发展将呈现以下趋势：
                </p>

                <p> 
                  <strong>人工智能深度应用：</strong>AI技术将在市场预测、客户分析、风险控制等方面发挥更大作用。
                </p>

                <p>
                  <strong>数据驱动决策：</strong>基于大数据分析的智能决策将成为企业竞争的核心优势。
                </p>

                <p>
                  <strong>生态系统整合：</strong>ERP系统将与更多第三方平台和服务深度整合，形成完整的商业生态。
                </p>

                <div className="bg-blue-50 border-l-4 border-[#194fe8] p-6 my-8"> 
                  <p className="text-gray-800">
                    <strong>结语：</strong>
                    数字化转型是外贸企业发展的必然趋势。选择合适的ERP系统，
                    不仅能够解决当前的管理痛点，更能为企业的长远发展奠定坚实基础。
                    久火ERP将继续致力于为外贸企业提供更优质的数字化解决方案。
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 分享和更新信息 */}
          <div className="flex items-center justify-between py-6 border-t border-gray-200 mb-12">
            <div className="flex items-center space-x-4"> 
              <span className="text-sm text-gray-600">分享</span>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-[#194fe8] transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              最后更新：{formatDate(article.updated_at, true)} 
            </div>
          </div>
        </article>

        {/* 紧凑型相关推荐 - 小图标展示 */}
        <div className="mt-12">
          <div className="flex items-center space-x-2 mb-6">
            <Tag className="w-5 h-5 text-[#194fe8]" /> 
            <h3 className="text-xl font-bold text-gray-900">相关推荐</h3>
          </div>
          
          {relatedArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {relatedArticles.map((relatedArticle, index) => (
                <div
                  key={relatedArticle.id} 
                  onClick={() => handleRelatedArticleClick(relatedArticle)}
                  className="bg-white rounded-lg border border-gray-200 hover:border-[#194fe8] hover:shadow-md transition-all duration-300 cursor-pointer group p-4"
                >
                  <div className="flex items-start space-x-3">
                    {/* 小图标 */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-[#194fe8] rounded flex items-center justify-center">
                        <Tag className="w-4 h-4 text-white" /> 
                      </div>
                    </div>
                    
                    {/* 内容区域 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#194fe8] font-medium">相关文章</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#194fe8] group-hover:translate-x-1 transition-all" /> 
                      </div>
                      
                      <h4 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-[#194fe8] transition-colors line-clamp-2 leading-tight">
                        {relatedArticle.title}
                      </h4>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">
                        {relatedArticle.summary} 
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(relatedArticle.publish_time, true)}</span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{relatedArticle.views} 阅读</span>
                        </span> 
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>暂无相关推荐文章</p> 
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;