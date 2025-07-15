import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { db } from '../lib/database';

// 简化的类型定义
interface CustomerCase {
  id: string;
  company_name: string;
  company_logo: string;
  industry: string;
  description: string;
  results: string;
  image_url?: string;
  is_featured: boolean;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
  case_title?: string;
  case_summary?: string;
  detail_url?: string;
  company_size?: string;
  highlight_tags?: string[];
  company_description?: string;
}

// 预定义的默认数据（当数据库为空时使用）
const DEFAULT_CASES: CustomerCase[] = [
  {
    id: 'default-1',
    company_name: '太力',
    company_logo: '太力',
    industry: '家居用品',
    description: '太力，真空收纳专家，为全球亿万家庭塑造更美好的生活。',
    results: '使用久火ERP实现精细化管理，提升运营效率50%',
    image_url: '/tubuiao1 copy.png',
    is_featured: true,
    sort_order: 1,
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    case_title: '家居品牌「太力」：借助久火ERP实现精细化管理',
    case_summary: '太力，真空收纳专家，为全球亿万家庭塑造更美好的生活。',
    company_size: '上市企业',
    company_description: '太力集团是中国领先的家居收纳解决方案提供商，专注于真空收纳产品的研发和生产。',
    highlight_tags: ['精细化管理', '家居用品', '全球化运营'],
    detail_url: ''
  },
  {
    id: 'default-2',
    company_name: '安克创新',
    company_logo: 'Anker',
    industry: '3C类',
    description: '上市企业「安克创新」：用久火ERP加速数字化建设',
    results: '数字化建设提升效率40%',
    image_url: '/o2 copy.png',
    is_featured: false,
    sort_order: 2,
    status: 'active',
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z',
    case_title: '上市企业「安克创新」：用久火ERP加速数字化建设',
    case_summary: '安克创新通过久火ERP系统，加速数字化建设，提升运营效率。',
    company_size: '上市企业',
    company_description: '安克创新是全球知名的消费电子品牌，专注于充电技术和智能硬件。',
    highlight_tags: ['数字化建设', '3C类', '上市企业'],
    detail_url: ''
  },
  {
    id: 'default-3',
    company_name: '巨星集团',
    company_logo: '巨星',
    industry: '制造业',
    description: '五金品牌「巨星集团」：借助久火ERP征战全球',
    results: '全球化运营效率提升35%',
    image_url: '/o3 copy.png',
    is_featured: false,
    sort_order: 3,
    status: 'active',
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z',
    case_title: '五金品牌「巨星集团」：借助久火ERP征战全球',
    case_summary: '巨星集团借助久火ERP系统，实现全球化运营，提升业务效率。',
    company_size: '上市企业',
    company_description: '巨星集团是中国领先的五金工具制造商，产品畅销全球。',
    highlight_tags: ['全球化运营', '制造业', '五金工具'],
    detail_url: ''
  },
  {
    id: 'default-4',
    company_name: 'ORICO',
    company_logo: 'ORICO',
    industry: '3C类',
    description: '全球存储巨头「ORICO」：联手久火ERP驱动增长',
    results: '存储业务增长60%',
    image_url: '/o4 copy.png',
    is_featured: false,
    sort_order: 4,
    status: 'active',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
    case_title: '全球存储巨头「ORICO」：联手久火ERP驱动增长',
    case_summary: 'ORICO通过久火ERP系统，实现存储业务的快速增长和全球化扩张。',
    company_size: '知名企业',
    company_description: 'ORICO是全球领先的存储设备和配件制造商。',
    highlight_tags: ['存储设备', '全球化', '业务增长'],
    detail_url: ''
  },
  {
    id: 'default-5',
    company_name: '齐心集团',
    company_logo: '齐心',
    industry: '办公用品',
    description: '办公品牌「齐心科技」：借助ERP实现精细管理',
    results: '办公用品管理效率提升45%',
    image_url: '/tubiao2 copy.png',
    is_featured: false,
    sort_order: 5,
    status: 'active',
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T10:00:00Z',
    case_title: '办公品牌「齐心科技」：借助ERP实现精细管理',
    case_summary: '齐心集团通过久火ERP系统，实现办公用品的精细化管理。',
    company_size: '上市企业',
    company_description: '齐心集团是中国领先的办公用品和服务提供商。',
    highlight_tags: ['精细管理', '办公用品', '上市企业'],
    detail_url: ''
  },
  {
    id: 'default-6',
    company_name: '纳思达',
    company_logo: '纳思达',
    industry: '制造业',
    description: '上市公司「纳思达」：久火助力多系统一体管理',
    results: '多系统集成效率提升50%',
    image_url: '/tubiao3 copy.png',
    is_featured: false,
    sort_order: 6,
    status: 'active',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
    case_title: '上市公司「纳思达」：久火助力多系统一体管理',
    case_summary: '纳思达通过久火ERP系统，实现多系统的一体化管理。',
    company_size: '上市企业',
    company_description: '纳思达是全球领先的打印机耗材制造商。',
    highlight_tags: ['多系统管理', '制造业', '一体化'],
    detail_url: ''
  },
  {
    id: 'default-7',
    company_name: '健合集团',
    company_logo: '健合',
    industry: '健康类',
    description: '全家庭营养与健康企业「健合集团」：携手久火提效',
    results: '健康产品管理效率提升40%',
    image_url: '/tibiao4 copy.png',
    is_featured: false,
    sort_order: 7,
    status: 'active',
    created_at: '2024-01-09T10:00:00Z',
    updated_at: '2024-01-09T10:00:00Z',
    case_title: '全家庭营养与健康企业「健合集团」：携手久火提效',
    case_summary: '健合集团通过久火ERP系统，提升健康产品管理效率。',
    company_size: '上市企业',
    company_description: '健合集团是中国领先的家庭营养与健康企业。',
    highlight_tags: ['营养健康', '家庭产品', '效率提升'],
    detail_url: ''
  },
  {
    id: 'default-8',
    company_name: '倍轻松',
    company_logo: '倍轻松',
    industry: '3C类',
    description: '智能硬件品牌「倍轻松」：借助久火实现数字化管理',
    results: '智能硬件管理效率提升55%',
    image_url: '/image copy.png',
    is_featured: false,
    sort_order: 8,
    status: 'active',
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z',
    case_title: '智能硬件品牌「倍轻松」：借助久火实现数字化管理',
    case_summary: '倍轻松通过久火ERP系统，实现智能硬件的数字化管理。',
    company_size: '知名企业',
    company_description: '倍轻松是中国领先的智能健康硬件品牌。',
    highlight_tags: ['智能硬件', '数字化管理', '健康产品'],
    detail_url: ''
  }
];

const CustomerCasesPage: React.FC = () => {
  const [cases, setCases] = useState<CustomerCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [error, setError] = useState<string>('');
  
  const casesPerPage = 8; // 每页显示8个案例（2行×4列）

  // 获取数据
  const fetchCases = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await db.getCustomerCases();
      
      if (response.error) {
        console.warn('数据库获取失败，使用默认数据:', response.error);
        setError('数据库连接失败，显示默认数据');
        setCases(DEFAULT_CASES);
      } else if (response.data && response.data.length > 0) {
        setCases(response.data);
        console.log('从数据库获取的案例数据:', response.data.length, '条');
      } else {
        setCases(DEFAULT_CASES);
        console.log('使用默认案例数据');
      }
    } catch (error) {
      console.error('获取案例数据失败:', error);
      setError('数据加载失败');
      setCases(DEFAULT_CASES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // 简化数据处理，避免过度优化
  const featuredCases = cases.filter(case_ => case_.is_featured);
  const regularCases = cases.filter(case_ => !case_.is_featured);

  // 安全的索引获取
  const safeFeaturedIndex = featuredCases.length > 0 ? Math.min(currentFeaturedIndex, featuredCases.length - 1) : 0;
  const currentFeaturedCase = featuredCases[safeFeaturedIndex] || featuredCases[0];
  
  // 分页逻辑 - 防止在加载时计算错误
  const totalPages = regularCases.length > 0 ? Math.ceil(regularCases.length / casesPerPage) : 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * casesPerPage;
  const currentCases = regularCases.slice(startIndex, startIndex + casesPerPage);

  // 轮播控制 - 防止除零错误
  const nextFeatured = () => {
    if (featuredCases.length > 0) {
      setCurrentFeaturedIndex((prev) => (prev + 1) % featuredCases.length);
    }
  };

  const prevFeatured = () => {
    if (featuredCases.length > 0) {
      setCurrentFeaturedIndex((prev) => (prev - 1 + featuredCases.length) % featuredCases.length);
    }
  };

  // 页面切换
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // 自动轮播
  useEffect(() => {
    if (featuredCases.length > 1) {
      const interval = setInterval(nextFeatured, 5000); // 5秒自动切换
      return () => clearInterval(interval);
    }
  }, [featuredCases.length]);

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载客户案例...</p>
        </div>
      </div>
    );
  }

  // 调试信息（开发模式显示）
  const showDebug = process.env.NODE_ENV === 'development';
  
  console.log('CustomerCasesPage 渲染状态:', {
    totalCases: cases.length,
    featuredCases: featuredCases.length,
    regularCases: regularCases.length,
    currentPage: safeCurrentPage,
    totalPages,
    currentCases: currentCases.length
  });

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部标题区域 */}
      <div className="bg-gray-50 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            倾听企业故事，探寻出海方案最优解
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
            链接久火ERP，共创您的品牌出海新高度
          </p>
        </div>
      </div>

      {/* 主要案例展示区域 */}
      {currentFeaturedCase && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* 左侧图片 */}
                  <div className="relative h-96 lg:h-[500px] min-h-[300px]">
                    {currentFeaturedCase.image_url ? (
                      <img
                        src={currentFeaturedCase.image_url}
                        alt={currentFeaturedCase.company_name}
                        className="w-full h-full object-cover"
                      />
                                         ) : (
                       <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                         <div className="text-gray-600 font-bold text-4xl">
                           {currentFeaturedCase.company_name}
                         </div>
                       </div>
                     )}
                    
                    {/* 股票代码标识 */}
                    <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
                      股票代码：301595
                    </div>
                  </div>

                  {/* 右侧内容 */}
                  <div className="p-8 lg:p-12">
                    {/* 公司规模标签 */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600 mb-4">
                      {currentFeaturedCase.company_size || '知名企业'}
                    </div>

                                         <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                       {currentFeaturedCase.case_title || currentFeaturedCase.company_name}
                     </h2>
 
                     <p className="text-lg text-gray-600 leading-relaxed mb-8">
                       {currentFeaturedCase.case_summary || currentFeaturedCase.description}
                     </p>

                    <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      查看详情
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 轮播控制按钮 */}
              {featuredCases.length > 1 && (
                <>
                  <button
                    onClick={prevFeatured}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                  </button>
                  <button
                    onClick={nextFeatured}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </button>
                </>
              )}
            </div>

            {/* 轮播指示器 */}
            {featuredCases.length > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                {featuredCases.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeaturedIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentFeaturedIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 合作客户案例 */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-12">
             合作客户案例
           </h2>

          {/* 案例网格 - 2行×4列布局 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {currentCases.map((case_) => (
              <div
                key={case_.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                {/* 案例图片 */}
                <div className="relative h-48 bg-gray-100">
                  {case_.image_url ? (
                    <img
                      src={case_.image_url}
                      alt={case_.company_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                                     ) : (
                     <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                       <div className="text-gray-600 font-bold text-xl">
                         {case_.company_name}
                       </div>
                     </div>
                   )}

                  
                </div>

                {/* 案例内容 */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 text-base leading-tight">
                    {case_.case_title || case_.company_name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {case_.case_summary || case_.description}
                  </p>

                  {/* 行业标签 */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      {case_.industry}
                    </span>
                  </div>

                  {/* 查看详情按钮 */}
                  <button className="w-full text-left text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-between group">
                    查看详情
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 分页器 */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center space-y-4">
              {/* 页面信息 */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                <span>第 {((currentPage - 1) * casesPerPage) + 1}-{Math.min(currentPage * casesPerPage, regularCases.length)} 条，共 {regularCases.length} 条</span>
                <span>共 {totalPages} 页</span>
              </div>
              
              {/* 分页按钮 */}
              <div className="flex flex-wrap justify-center items-center gap-2">
                <button
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                {/* 页码显示逻辑：显示当前页附近的页码 */}
                {(() => {
                  const pages = [];
                  const maxVisible = 5;
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                  
                  // 调整startPage以确保显示足够的页码
                  if (endPage - startPage + 1 < maxVisible) {
                    startPage = Math.max(1, endPage - maxVisible + 1);
                  }

                  // 如果不是从第一页开始，显示第一页和省略号
                  if (startPage > 1) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => goToPage(1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full font-medium transition-colors text-gray-600 hover:bg-gray-50"
                      >
                        1
                      </button>
                    );
                    if (startPage > 2) {
                      pages.push(
                        <span key="start-ellipsis" className="w-10 h-10 flex items-center justify-center text-gray-400">
                          ...
                        </span>
                      );
                    }
                  }

                  // 显示当前范围内的页码
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => goToPage(i)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-colors ${
                          i === currentPage
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }

                  // 如果不是到最后一页，显示省略号和最后一页
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span key="end-ellipsis" className="w-10 h-10 flex items-center justify-center text-gray-400">
                          ...
                        </span>
                      );
                    }
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => goToPage(totalPages)}
                        className="w-10 h-10 flex items-center justify-center rounded-full font-medium transition-colors text-gray-600 hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    );
                  }

                  return pages;
                })()}

                <button
                  onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 空状态 */}
      {cases.length === 0 && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">暂无数据</span>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">暂无客户案例</h3>
            <p className="text-gray-600">请稍后再试或联系管理员</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCasesPage;