import React, { useState, useEffect, useCallback } from 'react';
import { 
  Target, 
  TrendingUp, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Package,
  Users,
  BarChart3,
  Globe,
  Truck,
  Calculator,
  Settings,
  Brain,
  ChevronDown,
  ChevronUp,
  Play,
  Award,
  Clock,
  Star,
  Phone,
  ChevronLeft,
  ChevronRight,
  Pause,
  UserCheck,
  Warehouse,
  FileText,
  Workflow
} from 'lucide-react';
import FormButton from './FormButton';
import FeatureModulesContainer from './FeatureModulesContainer';

const SolutionsPage = () => {
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [isCarouselAutoPlaying, setIsCarouselAutoPlaying] = useState(true);
  const [carouselProgress, setCarouselProgress] = useState(0);

  // 行业解决方案
  const solutions = [
    {
      id: 1,
      title: '国际贸易商家解决方案',
      subtitle: '全渠道销售管理',
      icon: Globe,
      description: '专为国际贸易商家打造的一体化管理解决方案',
      challenges: [
        '多平台订单管理复杂',
        '库存分配不合理',
        '物流成本居高不下',
        '汇率风险难控制'
      ],
      solutions: [
        '统一订单管理中心',
        '智能库存分配算法',
        '物流成本优化方案',
        '汇率风险预警系统'
      ],
      modules: ['OMS订单管理', 'WMS仓储管理', 'TMS物流管理', 'FMS财务管理'],
      benefits: [
        '订单处理效率提升60%',
        '库存周转率提高40%',
        '物流成本降低25%',
        '财务风险控制提升50%'
      ],
      caseStudy: {
        company: '某知名3C品牌',
        result: '年销售额增长300%，运营成本降低35%'
      }
    },
    {
      id: 2,
      title: '制造业出口解决方案',
      subtitle: '生产到出口全链路',
      icon: Package,
      description: '从生产计划到出口交付的完整数字化管理',
      challenges: [
        '生产计划与订单脱节',
        '供应链协同效率低',
        '质量追溯困难',
        '出口单证繁琐'
      ],
      solutions: [
        '生产订单一体化管理',
        '供应链协同平台',
        '全程质量追溯系统',
        '智能单证生成'
      ],
      modules: ['PDM产品管理', 'SRM供应链管理', '生产管理', 'TMS物流管理'],
      benefits: [
        '生产效率提升45%',
        '供应链协同提升55%',
        '质量问题减少70%',
        '出口效率提升40%'
      ],
      caseStudy: {
        company: '某大型制造企业',
        result: '交付周期缩短30%，客户满意度提升至95%'
      }
    },
    {
      id: 3,
      title: '贸易公司解决方案',
      subtitle: '采购销售一体化',
      icon: Users,
      description: '专为贸易公司设计的采购销售协同管理系统',
      challenges: [
        '采购销售信息不对称',
        '客户需求响应慢',
        '价格管理复杂',
        '资金周转压力大'
      ],
      solutions: [
        '采购销售信息共享',
        '客户需求快速响应',
        '智能价格管理',
        '资金流优化方案'
      ],
      modules: ['CRM客户管理', 'SRM供应链管理', 'OMS订单管理', 'FMS财务管理'],
      benefits: [
        '响应速度提升50%',
        '价格管理效率提升60%',
        '资金周转率提高35%',
        '客户满意度提升40%'
      ],
      caseStudy: {
        company: '某知名贸易公司',
        result: '业务规模扩大200%，利润率提升25%'
      }
    },
    {
      id: 4,
      title: '工贸一体化解决方案',
      subtitle: '产销研一体化管理',
      icon: Settings,
      description: '集生产、贸易、研发于一体的综合管理解决方案',
      challenges: [
        '生产贸易数据割裂',
        '研发生产协同困难',
        '成本核算复杂',
        '决策数据不准确'
      ],
      solutions: [
        '生产贸易数据统一',
        '研发生产协同平台',
        '精细化成本核算',
        'AI智能决策支持'
      ],
      modules: ['PDM产品管理', 'CRM客户管理', 'OMS订单管理', 'BDA数据分析', 'AI智能决策'],
      benefits: [
        '数据准确性提升80%',
        '协同效率提升65%',
        '成本控制精度提升70%',
        '决策效率提升55%'
      ],
      caseStudy: {
        company: '某工贸一体化企业',
        result: '整体运营效率提升50%，新产品上市周期缩短40%'
      }
    }
  ];

  // 轮播模块数据
  const carouselModules = [
    {
      id: 1,
      title: '进销存一体管理',
      subtitle: '打通采购、发货、物流等业务环节，1688一键下单，智能提供补货建议',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        {
          icon: Package,
          title: '采购业务场景全覆盖',
          description: '支持1688下单/委外加工/退换货等采购模式，可多维度管理',
          color: 'emerald'
        },
        {
          icon: Brain,
          title: '智能补货建议',
          description: '自动监控全渠道销量与库存情况，区分物流渠道运输时效及费用提供补货方案',
          color: 'blue'
        },
        {
          icon: Truck,
          title: '物流全链路追踪管控',
          description: '全链条跟踪物流轨迹，对比物流商价格，优化物流成本',
          color: 'orange'
        },
        {
          icon: Warehouse,
          title: '一站式管库存',
          description: '集成海外仓与物流商，统一管理本地仓/海外仓/FBA仓库存和在途库存',
          color: 'purple'
        }
      ]
    },
    {
      id: 2,
      title: '成本管控精细透明',
      subtitle: '贯穿采购、生产、销售全环节，自动核算成本构成，精准压降经营损耗',
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        {
          icon: Calculator,
          title: '多维度成本核算模型',
          description: '支持标准成本/实际成本核算，按产品、订单、部门拆分料工费，差异分析清晰',
          color: 'emerald'
        },
        {
          icon: TrendingUp,
          title: '采购成本动态监控',
          description: '对接供应商报价、历史价格，异常涨价自动预警，比价功能辅助选最优采购',
          color: 'blue'
        },
        {
          icon: Clock,
          title: '生产成本实时归集',
          description: '生产领料、工时录入自动关联成本，工单结案同步核算，超预算项目智能提醒',
          color: 'orange'
        },
        {
          icon: BarChart3,
          title: '利润分析穿透查询',
          description: '按客户、产品、区域统计利润，成本占比可视化，挖掘高毛利业务优化方向',
          color: 'purple'
        }
      ]
    },
    {
      id: 3,
      title: '供应链协同平台',
      subtitle: '连接供应商、工厂、物流商，打破信息孤岛，构建高效协同生态',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        {
          icon: Users,
          title: '供应商在线协同',
          description: '采购需求自动推送，供应商实时反馈交货计划、质检报告，对账流程线上化',
          color: 'emerald'
        },
        {
          icon: Workflow,
          title: '生产-物流数据互通',
          description: '生产完工信息同步物流端，自动触发配送计划，物流轨迹反向回传ERP',
          color: 'blue'
        },
        {
          icon: Target,
          title: '需求预测联动供应',
          description: '销售数据结合历史趋势预测需求，联动采购、生产备料，减少库存积压',
          color: 'orange'
        },
        {
          icon: Shield,
          title: '异常事件协同响应',
          description: '供应商延迟、物流破损等异常，系统自动触发预警，协同处理流程一键发起',
          color: 'purple'
        }
      ]
    },
    {
      id: 4,
      title: '数据驱动经营决策',
      subtitle: '整合业务全量数据，生成多维度看板，辅助管理层快速洞察、决策',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        {
          icon: BarChart3,
          title: '自定义数据看板',
          description: '按需配置销售、库存、生产看板，指标阈值预警，异常数据高亮提醒',
          color: 'emerald'
        },
        {
          icon: FileText,
          title: '智能报表自动生成',
          description: '日报/周报/月报一键导出，支持跨模块数据关联分析（如销售与库存联动）',
          color: 'blue'
        },
        {
          icon: TrendingUp,
          title: '趋势预测与模拟',
          description: '基于历史数据建模，预测销量、库存周转趋势，模拟策略调整后的经营结果',
          color: 'orange'
        },
        {
          icon: Globe,
          title: '移动端数据洞察',
          description: '管理层手机端实时查看关键指标，审批待办、异常预警推送，随时决策干预',
          color: 'purple'
        }
      ]
    }
  ];

  // 核心价值主张
  const valueProps = [
    {
      icon: Target,
      title: '精准定位痛点',
      description: '深度调研外贸企业运营痛点，提供针对性解决方案'
    },
    {
      icon: TrendingUp,
      title: '数据驱动决策',
      description: '基于大数据分析，为企业提供科学的决策支持'
    },
    {
      icon: Shield,
      title: '安全稳定可靠',
      description: 'SAAS+PAAS双重保障，确保数据安全和系统稳定'
    },
    {
      icon: Zap,
      title: '快速部署实施',
      description: '标准化实施流程，快速上线，快速见效'
    }
  ];

  const currentSolution = solutions[currentSolutionIndex];
  const currentCarouselModule = carouselModules[currentCarouselIndex];

  // 自动轮播逻辑
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentSolutionIndex(prevIndex => 
            prevIndex === solutions.length - 1 ? 0 : prevIndex + 1
          );
          return 0;
        }
        return prev + 2; // 每50ms增加2%，总共5秒
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isAutoPlaying, solutions.length]);

  // 重置进度条
  useEffect(() => {
    setProgress(0);
  }, [currentSolutionIndex]);

  const nextSolution = useCallback(() => {
    setCurrentSolutionIndex(prev => 
      prev === solutions.length - 1 ? 0 : prev + 1
    );
  }, [solutions.length]);

  const prevSolution = useCallback(() => {
    setCurrentSolutionIndex(prev => 
      prev === 0 ? solutions.length - 1 : prev - 1
    );
  }, [solutions.length]);

  const goToSolution = useCallback((index: number) => {
    setCurrentSolutionIndex(index);
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(prev => !prev);
  }, []);

  // 轮播自动播放逻辑
  useEffect(() => {
    if (!isCarouselAutoPlaying) return;

    const interval = setInterval(() => {
      setCarouselProgress(prev => {
        if (prev >= 100) {
          setCurrentCarouselIndex(prevIndex => 
            prevIndex === carouselModules.length - 1 ? 0 : prevIndex + 1
          );
          return 0;
        }
        return prev + 1; // 每100ms增加1%，总共10秒
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isCarouselAutoPlaying, carouselModules.length]);

  // 重置轮播进度条
  useEffect(() => {
    setCarouselProgress(0);
  }, [currentCarouselIndex]);

  const nextCarouselModule = useCallback(() => {
    setCurrentCarouselIndex(prev => 
      prev === carouselModules.length - 1 ? 0 : prev + 1
    );
  }, [carouselModules.length]);

  const prevCarouselModule = useCallback(() => {
    setCurrentCarouselIndex(prev => 
      prev === 0 ? carouselModules.length - 1 : prev - 1
    );
  }, [carouselModules.length]);

  const goToCarouselModule = useCallback((index: number) => {
    setCurrentCarouselIndex(index);
  }, []);

  const toggleCarouselAutoPlay = useCallback(() => {
    setIsCarouselAutoPlaying(prev => !prev);
  }, []);

  const getColorClasses = (color: string) => {
    const colorMap = {
      emerald: 'bg-emerald-100 text-emerald-600',
      blue: 'bg-blue-100 text-blue-600',
      orange: 'bg-orange-100 text-orange-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-white pt-16 w-full">
      {/* 优化后的Banner设计 */}
      <section className="relative min-h-[500px] flex items-center overflow-hidden py-16 w-full">
        {/* 背景图片 */}
        <div className="absolute inset-0">
          <img
            src="/jiejueanli(1).jpg"
            alt="解决方案背景"
            className="w-full h-full object-cover object-center"
          />
          {/* 优化遮罩层，确保文字可读性 */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/70 to-white/50"></div>
        </div>

        {/* 简化装饰元素，避免视觉干扰 */}
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0">
            {/* 保留少量装饰元素，不影响文字可读性 */}
            <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-200/15 to-purple-200/15 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-teal-200/15 to-blue-200/15 rounded-full blur-xl"></div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm mb-6">
              <div className="w-2 h-2 bg-[#194fe8] rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">解决方案</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              破解外贸企业运营痛点
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto mb-8">
              从供应链优化到数据决策，定制化覆盖国际贸易全场景需求
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <FormButton buttonId="btn-3">
                免费咨询方案
              </FormButton>
              <FormButton variant="outline" buttonId="btn-4">
                <Play className="w-5 h-5" />
                <span>观看演示</span>
              </FormButton>
            </div>
          </div>
        </div>
      </section>

      {/* 行业痛点模块 - 完全按照参考图设计 */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          {/* 标题区域 */}
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              为您全方位解决外贸管理难题
            </h2>
          </div>

          {/* 痛点布局 - 完全按照参考图的4个角落布局 */}
          <div className="relative max-w-6xl mx-auto">
            {/* 中央人物图标区域 - 放大图标并确保不遮挡数字 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex pointer-events-none">
              <div className="relative">
                {/* 放大的白色圆形背景 */}
                <div className="w-56 h-56 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-gray-100">
                  {/* 放大的人物图标 */}
                  <div className="w-36 h-36 flex items-center justify-center">
                    <img
                      src="/25af5adba595fb48a3ce0769b5f80f492f19fe7740e36-xunqEv.png"
                      alt="思考中的人物"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                {/* 外圈装饰 */}
                <div className="absolute inset-0 w-56 h-56 border-2 border-blue-200 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* 四个痛点分布 - 向两端移动，增加间距 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-72 gap-y-24 pt-16 pb-16 relative z-20">
              {/* 左上 - 数据采集零散，多源信息难整合？ */}
              <div className="text-left relative lg:text-right lg:-ml-24">
                <div className="flex items-start space-x-8 lg:flex-row-reverse lg:space-x-reverse lg:space-x-8">
                  <div className="w-14 h-14 bg-[#194fe8] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg border-2 border-white">
                    1
                  </div>
                  <div className="lg:text-right max-w-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">数据采集零散，多源信息难整合？</h3>
                    <div className="text-gray-600 leading-relaxed text-sm">
                      市场趋势研判偏，数据价值挖掘浅，分析缺深度，数据驱动难
                    </div>
                  </div>
                </div>
              </div>

              {/* 右上 - 客户分类模糊，重要客户维护难？ */}
              <div className="text-left relative lg:mr-24">
                <div className="flex items-start space-x-8">
                  <div className="w-14 h-14 bg-[#194fe8] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg border-2 border-white">
                    2
                  </div>
                  <div className="max-w-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">客户分类模糊，重要客户维护难？</h3>
                    <div className="text-gray-600 leading-relaxed text-sm whitespace-nowrap">
                      需求挖掘不深入，二次开发乏力，管理缺分层
                    </div>
                  </div>
                </div>
              </div>

              {/* 左下 - 跟进节奏紊乱，沟通时机把握差？ */}
              <div className="text-left relative lg:text-right lg:-ml-24">
                <div className="flex items-start space-x-8 lg:flex-row-reverse lg:space-x-reverse lg:space-x-8">
                  <div className="w-14 h-14 bg-[#194fe8] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg border-2 border-white">
                    3
                  </div>
                  <div className="lg:text-right max-w-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">跟进节奏紊乱，沟通时机把握差？</h3>
                    <div className="text-gray-600 leading-relaxed text-sm">
                      需求反馈记录漏，跟进策略僵化，互动缺技巧，客户信任建立难
                    </div>
                  </div>
                </div>
              </div>

              {/* 右下 - 供应链协同不畅，供应商管理粗放? */}
              <div className="text-left relative lg:mr-24">
                <div className="flex items-start space-x-8">
                  <div className="w-14 h-14 bg-[#194fe8] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg border-2 border-white">
                    4
                  </div>
                  <div className="max-w-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">供应链协同不畅，供应商管理粗放?</h3>
                    <div className="text-gray-600 leading-relaxed text-sm whitespace-nowrap">
                      原材料供应不稳，库存积压严重，衔接有断层
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 新增第5、6个痛点 - 在下方单独一行显示 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-72 gap-y-24 pt-8 relative z-20">
              {/* 左侧 - 新员工业务知识生疏，流程节点记不清? */}
              <div className="text-left relative lg:text-right lg:-ml-24">
                <div className="flex items-start space-x-8 lg:flex-row-reverse lg:space-x-reverse lg:space-x-8">
                  <div className="w-14 h-14 bg-[#194fe8] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg border-2 border-white">
                    5
                  </div>
                  <div className="lg:text-right max-w-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">新员工业务知识生疏，流程节点记不清?</h3>
                    <div className="text-gray-600 leading-relaxed text-sm">
                      沟通话术不熟练，客户对接紧张，培训缺体系，独立开展业务难
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧 - 跨部门沟通壁垒，信息传递有损耗? */}
              <div className="text-left relative lg:mr-24">
                <div className="flex items-start space-x-8">
                  <div className="w-14 h-14 bg-[#194fe8] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg border-2 border-white">
                    6
                  </div>
                  <div className="max-w-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">跨部门沟通壁垒，信息传递有损耗?</h3>
                    <div className="text-gray-600 leading-relaxed text-sm whitespace-nowrap">
                      协作流程不清晰，责任划分模糊，配合不默契
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部CTA按钮 - 居中并添加表单功能 */}
          <div className="text-center mt-16">
            <FormButton className="bg-[#194fe8] hover:bg-[#1640c7] text-white px-8 py-3 rounded-lg font-medium mx-auto">
              咨询更多解决方案
            </FormButton>
          </div>
        </div>
      </section>

      {/* 核心功能模块 */}
      <FeatureModulesContainer />

      {/* 核心价值主张 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm mb-6">
              <div className="w-2 h-2 bg-[#194fe8] rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-700">核心优势</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              为什么选择久火ERP解决方案
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              基于8年外贸行业深耕经验，为不同类型企业提供精准的数字化解决方案
            </p>
          </div>

          {/* 背景装饰容器 */}
          <div className="relative">
            {/* 背景装饰元素 */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100/30 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-100/30 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-100/20 rounded-full blur-lg"></div>
            </div>
            
            <div className="relative grid md:grid-cols-2 gap-8 lg:gap-12">
            {valueProps.map((prop, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
              >
                {/* 卡片背景装饰 */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#194fe8]/5 to-indigo-500/5 rounded-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative z-10 flex items-start space-x-4">
                  {/* 图标容器 - 垂直居中对齐 */}
                  <div className="flex-shrink-0 flex items-center h-full">
                    <div className="w-12 h-12 bg-[#194fe8] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <prop.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* 文字内容容器 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#194fe8] transition-colors mb-3">
                      {prop.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                      {prop.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* 实施流程 */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              标准化实施流程
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              专业的实施团队，标准化的实施流程，确保项目成功落地
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: '需求调研',
                description: '深度了解企业现状和需求',
                duration: '1-2周'
              },
              {
                step: '02',
                title: '方案设计',
                description: '制定个性化解决方案',
                duration: '1周'
              },
              {
                step: '03',
                title: '系统部署',
                description: '环境搭建和系统配置',
                duration: '1-2周'
              },
              {
                step: '04',
                title: '上线运行',
                description: '培训支持和持续优化',
                duration: '持续'
              }
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#194fe8] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {phase.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {phase.title}
                </h3>
                <p className="text-gray-600 mb-2">
                  {phase.description}
                </p>
                <div className="text-sm text-[#194fe8] font-medium">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {phase.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA区域 */}
      <section className="bg-[#194fe8] py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            开启您的数字化转型之旅
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            专业的解决方案团队，为您量身定制最适合的数字化管理方案
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FormButton className="bg-white text-[#194fe8] hover:bg-gray-100">
              免费获取解决方案
            </FormButton>
            <FormButton variant="outline" className="border-white text-white hover:bg-white hover:text-[#194fe8]">
              预约专家咨询
            </FormButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolutionsPage;