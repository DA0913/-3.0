import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { db } from '../lib/database';

// 类型定义
interface CustomerCase {
  id: string;
  company_name: string;
  company_logo: string;
  industry: string;
  description: string;
  results: string;
  image_url?: string;
  case_title?: string;
  case_summary?: string;
  company_size?: string;
  highlight_tags?: string[];
  company_description?: string;
  show_on_homepage?: boolean;
  contact_avatar?: string;
  contact_name?: string;
  contact_position?: string;
}

const HomepageCustomerCases: React.FC = () => {
  const [cases, setCases] = useState<CustomerCase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // 获取首页显示的案例
  const fetchHomepageCases = async () => {
    try {
      setLoading(true);
      const response = await db.getCustomerCases({ limit: 50 });
      
      if (response.error) {
        console.warn('获取首页案例失败，使用默认数据:', response.error);
        // 使用默认数据，只包含4个案例
        const defaultCases: CustomerCase[] = [
          {
            id: 'default-1',
            company_name: '比亚迪股份有限公司',
            company_logo: '比',
            industry: '新能源汽车',
            description: '比亚迪通过久火ERP系统优化了新能源汽车的生产和供应链管理流程。',
            results: '供应链协同效率提升50%，成本降低25%',
            image_url: '/o2 copy.png',
            case_title: '上市企业「比亚迪」：用久火ERP加速新能源汽车数字化建设',
            case_summary: '比亚迪通过久火ERP系统，实现了供应链协同效率提升50%，成本降低25%，为新能源汽车行业的数字化转型树立了标杆。',
            company_size: '上市企业',
            company_description: '比亚迪股份有限公司是中国领先的新能源汽车制造商，专注于电动汽车、电池和新能源解决方案的研发和生产。',
            highlight_tags: ['数字化建设', '供应链优化', '新能源汽车'],
            show_on_homepage: true,
            contact_name: '王强',
            contact_position: 'IT总监',
            contact_avatar: ''
          },
          {
            id: 'default-2',
            company_name: '西安方盛软件有限公司',
            company_logo: '西',
            industry: '外贸出口',
            description: '通过使用我们的ERP系统，该公司的订单处理效率提升了60%，库存管理更加精准。',
            results: '订单处理效率提升60%，库存管理精准度提升40%',
            image_url: '/o3 copy.png',
            case_title: '软件企业「西安方盛」：用久火ERP实现外贸出口业务全流程数字化',
            case_summary: '西安方盛软件通过久火ERP系统，订单处理效率提升60%，库存管理精准度提升40%，实现了外贸出口业务的全流程数字化。',
            company_size: '中小企业',
            company_description: '西安方盛软件有限公司是一家专业从事外贸出口软件开发和服务的企业，致力于为中小企业提供专业的外贸解决方案。',
            highlight_tags: ['外贸出口', '全流程数字化', '库存管理'],
            show_on_homepage: true,
            contact_name: '李明',
            contact_position: '运营总监',
            contact_avatar: ''
          },
          {
            id: 'default-3',
            company_name: '北京科技有限公司',
            company_logo: '北',
            industry: '制造业',
            description: '专业从事高端制造设备的生产',
            results: '使用我们的ERP系统后，生产效率提升50%，订单管理更加规范化',
            image_url: '/o4 copy.png',
            case_title: '制造企业「北京科技」：用久火ERP优化高端制造设备生产流程',
            case_summary: '北京科技有限公司通过久火ERP系统，生产效率提升50%，订单管理更加规范化，为高端制造设备行业提供了数字化转型的参考样本。',
            company_size: '中小企业',
            company_description: '北京科技有限公司是一家专业从事高端制造设备研发和生产的企业，拥有先进的制造技术和丰富的行业经验。',
            highlight_tags: ['高端制造', '生产优化', '订单管理'],
            show_on_homepage: true,
            contact_name: '张华',
            contact_position: '技术总监',
            contact_avatar: ''
          },
          {
            id: 'default-4',
            company_name: '杭州互联网科技',
            company_logo: '杭',
            industry: '互联网',
            description: '杭州互联网科技专注于为企业提供创新的互联网解决方案。',
            results: '通过久火ERP系统提升项目管理效率45%',
            image_url: '/o2 copy.png',
            case_title: '互联网企业「杭州科技」：用久火ERP提升项目管理效率',
            case_summary: '杭州互联网科技通过久火ERP系统，项目管理效率提升45%，为互联网行业的数字化管理提供了优秀范例。',
            company_size: '中小企业',
            company_description: '杭州互联网科技是一家专业的互联网解决方案提供商，致力于帮助企业实现数字化转型。',
            highlight_tags: ['项目管理', '互联网解决方案', '数字化转型'],
            show_on_homepage: true,
            contact_name: '杭州互联网科技负责人',
            contact_position: '企业负责人',
            contact_avatar: ''
          },
          {
            id: 'default-5',
            company_name: '上海制造集团',
            company_logo: '上',
            industry: '先进制造',
            description: '上海制造集团是智能制造领域的领军企业。',
            results: '通过久火ERP实现智能制造升级，产能提升40%',
            image_url: '/o3 copy.png',
            case_title: '制造集团「上海制造」：用久火ERP推动智能制造转型',
            case_summary: '上海制造集团借助久火ERP系统，实现了智能制造的全面升级，产能提升40%，为制造业转型升级提供了成功范本。',
            company_size: '大型企业',
            company_description: '上海制造集团专注于智能制造技术的研发和应用，是行业内的领军企业。',
            highlight_tags: ['智能制造', '产能提升', '转型升级'],
            show_on_homepage: true,
            contact_name: '刘总',
            contact_position: '制造总监',
            contact_avatar: ''
          },
          {
            id: 'default-6',
            company_name: '深圳创新科技',
            company_logo: '深',
            industry: '高新技术',
            description: '深圳创新科技致力于前沿技术的研发和应用。',
            results: '使用久火ERP优化研发流程，效率提升55%',
            image_url: '/o4 copy.png',
            case_title: '高新企业「深圳创新」：用久火ERP加速技术创新',
            case_summary: '深圳创新科技通过久火ERP系统，优化了研发流程，效率提升55%，为高新技术企业的发展注入新动力。',
            company_size: '高新企业',
            company_description: '深圳创新科技是一家专注于前沿技术研发的高新技术企业，拥有多项核心技术专利。',
            highlight_tags: ['技术创新', '研发优化', '高新技术'],
            show_on_homepage: true,
            contact_name: '陈博士',
            contact_position: '研发总监',
            contact_avatar: ''
          }
        ];
        setCases(defaultCases);
      } else if (response.data && response.data.length > 0) {
        // 筛选出勾选了"显示在首页"的案例，不限制数量
        const homepageCases = response.data
          .filter(case_ => case_.show_on_homepage === true);
        setCases(homepageCases);
      }
    } catch (error) {
      console.error('获取首页案例失败:', error);
      // 使用默认的6个案例数据（增加案例数量以便展示轮播效果）
      const defaultCases: CustomerCase[] = [
        {
          id: 'default-1',
          company_name: '比亚迪股份有限公司',
          company_logo: '比',
          industry: '新能源汽车',
          description: '比亚迪通过久火ERP系统优化了新能源汽车的生产和供应链管理流程。',
          results: '供应链协同效率提升50%，成本降低25%',
          image_url: '/o2 copy.png',
          case_title: '上市企业「比亚迪」：用久火ERP加速新能源汽车数字化建设',
          case_summary: '比亚迪通过久火ERP系统，实现了供应链协同效率提升50%，成本降低25%，为新能源汽车行业的数字化转型树立了标杆。',
          company_size: '上市企业',
          company_description: '比亚迪股份有限公司是中国领先的新能源汽车制造商，专注于电动汽车、电池和新能源解决方案的研发和生产。',
          highlight_tags: ['数字化建设', '供应链优化', '新能源汽车'],
          show_on_homepage: true,
          contact_name: '王强',
          contact_position: 'IT总监',
          contact_avatar: ''
        },
        {
          id: 'default-2',
          company_name: '西安方盛软件有限公司',
          company_logo: '西',
          industry: '外贸出口',
          description: '通过使用我们的ERP系统，该公司的订单处理效率提升了60%，库存管理更加精准。',
          results: '订单处理效率提升60%，库存管理精准度提升40%',
          image_url: '/o3 copy.png',
          case_title: '软件企业「西安方盛」：用久火ERP实现外贸出口业务全流程数字化',
          case_summary: '西安方盛软件通过久火ERP系统，订单处理效率提升60%，库存管理精准度提升40%，实现了外贸出口业务的全流程数字化。',
          company_size: '中小企业',
          company_description: '西安方盛软件有限公司是一家专业从事外贸出口软件开发和服务的企业，致力于为中小企业提供专业的外贸解决方案。',
          highlight_tags: ['外贸出口', '全流程数字化', '库存管理'],
          show_on_homepage: true,
          contact_name: '李明',
          contact_position: '运营总监',
          contact_avatar: ''
        },
        {
          id: 'default-3',
          company_name: '北京科技有限公司',
          company_logo: '北',
          industry: '制造业',
          description: '专业从事高端制造设备的生产',
          results: '使用我们的ERP系统后，生产效率提升50%，订单管理更加规范化',
          image_url: '/o4 copy.png',
          case_title: '制造企业「北京科技」：用久火ERP优化高端制造设备生产流程',
          case_summary: '北京科技有限公司通过久火ERP系统，生产效率提升50%，订单管理更加规范化，为高端制造设备行业提供了数字化转型的参考样本。',
          company_size: '中小企业',
          company_description: '北京科技有限公司是一家专业从事高端制造设备研发和生产的企业，拥有先进的制造技术和丰富的行业经验。',
          highlight_tags: ['高端制造', '生产优化', '订单管理'],
          show_on_homepage: true,
          contact_name: '张华',
          contact_position: '技术总监',
          contact_avatar: ''
        },
        {
          id: 'default-4',
          company_name: '杭州互联网科技',
          company_logo: '杭',
          industry: '互联网',
          description: '杭州互联网科技专注于为企业提供创新的互联网解决方案。',
          results: '通过久火ERP系统提升项目管理效率45%',
          image_url: '/o2 copy.png',
          case_title: '互联网企业「杭州科技」：用久火ERP提升项目管理效率',
          case_summary: '杭州互联网科技通过久火ERP系统，项目管理效率提升45%，为互联网行业的数字化管理提供了优秀范例。',
          company_size: '中小企业',
          company_description: '杭州互联网科技是一家专业的互联网解决方案提供商，致力于帮助企业实现数字化转型。',
          highlight_tags: ['项目管理', '互联网解决方案', '数字化转型'],
          show_on_homepage: true,
          contact_name: '杭州互联网科技负责人',
          contact_position: '企业负责人',
          contact_avatar: ''
        },
        {
          id: 'default-5',
          company_name: '上海制造集团',
          company_logo: '上',
          industry: '先进制造',
          description: '上海制造集团是智能制造领域的领军企业。',
          results: '通过久火ERP实现智能制造升级，产能提升40%',
          image_url: '/o3 copy.png',
          case_title: '制造集团「上海制造」：用久火ERP推动智能制造转型',
          case_summary: '上海制造集团借助久火ERP系统，实现了智能制造的全面升级，产能提升40%，为制造业转型升级提供了成功范本。',
          company_size: '大型企业',
          company_description: '上海制造集团专注于智能制造技术的研发和应用，是行业内的领军企业。',
          highlight_tags: ['智能制造', '产能提升', '转型升级'],
          show_on_homepage: true,
          contact_name: '刘总',
          contact_position: '制造总监',
          contact_avatar: ''
        },
        {
          id: 'default-6',
          company_name: '深圳创新科技',
          company_logo: '深',
          industry: '高新技术',
          description: '深圳创新科技致力于前沿技术的研发和应用。',
          results: '使用久火ERP优化研发流程，效率提升55%',
          image_url: '/o4 copy.png',
          case_title: '高新企业「深圳创新」：用久火ERP加速技术创新',
          case_summary: '深圳创新科技通过久火ERP系统，优化了研发流程，效率提升55%，为高新技术企业的发展注入新动力。',
          company_size: '高新企业',
          company_description: '深圳创新科技是一家专注于前沿技术研发的高新技术企业，拥有多项核心技术专利。',
          highlight_tags: ['技术创新', '研发优化', '高新技术'],
          show_on_homepage: true,
          contact_name: '陈博士',
          contact_position: '研发总监',
          contact_avatar: ''
        }
      ];
      setCases(defaultCases);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageCases();
  }, []);

  // 轮播控制 - 单个卡片滑动，但显示4个卡片
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % cases.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + cases.length) % cases.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // 自动轮播
  useEffect(() => {
    if (cases.length <= 1) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // 每4秒自动切换

    return () => clearInterval(interval);
  }, [cases.length]);

  // 获取当前显示的4个卡片
  const getVisibleCards = () => {
    const visibleCards = [];
    for (let i = 0; i < 4; i++) {
      const cardIndex = (currentIndex + i) % cases.length;
      visibleCards.push(cases[cardIndex]);
    }
    return visibleCards;
  };

  if (loading) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      </div>
    );
  };

  if (cases.length === 0) {
    return null;
  }

  const visibleCards = getVisibleCards();

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
            值得信赖的合作伙伴
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto px-4 leading-relaxed">
            与行业领先企业深度合作，共同探索数字化转型的无限可能
          </p>
        </div>
      </div>
      
      {/* 卡片轮播区域 */}
      <div className="relative">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 transition-all duration-800 ease-out">
              {visibleCards.map((caseItem, index) => (
                <div
                  key={`${caseItem.id}-${currentIndex}-${index}`}
                  className="bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 relative animate-in fade-in slide-in-from-bottom-4"
                  style={{
                    minHeight: '560px',
                    animationDelay: `${index * 150}ms`,
                    animationDuration: '0.8s',
                    animationFillMode: 'both'
                  }}
                >
                  {/* 图片区域 */}
                  <div className="relative h-64 bg-gray-100">
                    {/* 行业标签 - 左上角角标 */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-lg z-10" style={{ backgroundColor: '#194fe8' }}>
                      <span className="text-white font-medium text-xs">{caseItem.industry}</span>
                    </div>
                    
                    {caseItem.image_url ? (
                      <img
                        src={caseItem.image_url}
                        alt={caseItem.company_name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                        <div className="text-gray-600 font-bold text-2xl transition-all duration-500">
                          {caseItem.company_name}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 内容区域 */}
                  <div className="p-6 pb-20">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight transition-colors duration-300 hover:text-blue-600">
                      {caseItem.case_title || caseItem.company_name}
                    </h3>
                    
                    <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3">
                      {caseItem.case_summary || caseItem.description}
                    </p>

                    {/* 标签 */}
                    {caseItem.highlight_tags && caseItem.highlight_tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {caseItem.highlight_tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-2 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg transition-all duration-300 hover:bg-blue-100 hover:text-blue-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 联系人信息 - 固定在卡片底部 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {caseItem.contact_avatar ? (
                            <img
                              src={caseItem.contact_avatar}
                              alt={caseItem.contact_name || '联系人'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-bold text-blue-600">
                              {(caseItem.contact_name || caseItem.company_name).charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {caseItem.contact_name || caseItem.company_name + '负责人'}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {caseItem.contact_position || '企业负责人'}
                          </div>
                        </div>
                      </div>
                      
                      <button className="text-blue-600 hover:text-blue-700 transition-all duration-300 p-1 rounded-lg hover:bg-blue-50 hover:scale-110">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 导航按钮 */}
        {cases.length > 4 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105 z-30"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105 z-30"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </>
        )}

        {/* 分页指示器 */}
        {cases.length > 4 && (
          <div className="flex justify-center mt-12">
            <div className="flex justify-center space-x-2">
              {cases.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 hover:scale-125 ${
                    index >= currentIndex && index < currentIndex + 4 
                      ? 'bg-blue-600 shadow-lg' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomepageCustomerCases; 