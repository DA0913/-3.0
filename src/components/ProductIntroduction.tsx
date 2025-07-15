import React, { useState } from 'react';
import VersionComparison from './VersionComparison';
import { 
  Package, 
  Link, 
  Users, 
  ShoppingCart, 
  Truck, 
  Warehouse, 
  Calculator,
  BarChart3,
  UserCheck,
  Settings,
  FileText,
  Brain,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Phone
} from 'lucide-react';
import FormButton from './FormButton';
import InlineFormComponent from './InlineFormComponent';
import FAQSection from './FAQSection';

const ProductIntroduction = () => {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const modules = [
    {
      id: 1,
      icon: Package,
      title: 'PDM产品管理系统',
      subtitle: '助力企业高效管理产品全生命周期',
      features: ['产品档案', '主营行业', '产品图库', '产品手册', '价格策略', '产品知识']
    },
    {
      id: 2,
      icon: Link,
      title: 'SRM智能供应链管理',
      subtitle: '实现供应商关系自动化与采购效率提升',
      features: ['供应商管理', '采购询价', '采购订单', '收货通知']
    },
    {
      id: 3,
      icon: Users,
      title: 'CRM客户营销管理',
      subtitle: '精准管理海内外客户与销售机会跟踪',
      features: ['私海客户', '公海客户', '询盘管理', '动态商机', '邮件营销']
    },
    {
      id: 4,
      icon: ShoppingCart,
      title: 'OMS高效订单管理',
      subtitle: '促进跨部门信息共享与订单协同处理',
      features: ['销售报价单', '出口订单', '内销订单', '订单审核']
    },
    {
      id: 5,
      icon: Truck,
      title: 'TMS物流管理系统',
      subtitle: '实现物流运作高效精准协同',
      features: ['物流发货单', '单证管理', '快递运输单', '物流结算单']
    },
    {
      id: 6,
      icon: Warehouse,
      title: 'WMS现代化仓储控制',
      subtitle: '精细化管理仓储业务与提升仓储效率',
      features: ['入库单', '出库单', '库存盘点', '库存调拨', '拣配包装']
    },
    {
      id: 7,
      icon: Calculator,
      title: 'FMS精细财务管理',
      subtitle: '全面管控财务活动与实现高效资金管理',
      features: ['应收管理', '应付管理', '费用报销', '发票管理', '往来对账']
    },
    {
      id: 8,
      icon: BarChart3,
      title: 'BDA深度数据分析',
      subtitle: '通过大数据挖掘获取高价值商业信息',
      features: ['产品销量分析', '采购分析', '客户资产分析', '销售业绩曲线']
    },
    {
      id: 9,
      icon: UserCheck,
      title: 'HCM人力资源管理',
      subtitle: '优化人力资源流程与提升团队管理效能',
      features: ['招聘管理', '员工档案', '绩效管理', '薪酬管理', '职级管理']
    },
    {
      id: 10,
      icon: Settings,
      title: 'ADM行政管理系统',
      subtitle: '规范内部行政事务与提升组织协调能力',
      features: ['通知公告', '资产管理', '资质证件管理', '商务合同管理']
    },
    {
      id: 11,
      icon: FileText,
      title: 'OA无缝协同办公',
      subtitle: '实现企业办公自动化与高效协同运作',
      features: ['文档管理', '审核管理', '会议管理', '任务管理', '计划管理']
    },
    {
      id: 12,
      icon: Brain,
      title: 'AI赋能的智能决策',
      subtitle: '依托大数据分析提供精准预测与决策建议',
      features: ['智能线索分析', '市场趋势预测', '销售目标推演', '风险预警提示']
    }
  ];

  const toggleModule = (moduleId: number) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <div className="min-h-screen bg-white pt-16 w-full">
      {/* Banner区域 - 参考设计图重新设计 */}
      <section className="relative min-h-[500px] flex items-center overflow-hidden py-16 w-full">
        {/* 背景渐变 */}
        <div className="absolute inset-0">
          <img
            src="/kehu(1).png"
            alt="产品介绍背景"
            className="w-full h-full object-cover object-center"
          />
          {/* 添加半透明遮罩以确保文字可读性 */}
          <div className="absolute inset-0 bg-white/70"></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30">
          {/* 几何装饰元素 */}
          <div className="absolute top-0 left-0 w-full h-full">
            {/* 左侧几何形状 */}
            <div className="absolute top-0 left-0 w-1/3 h-full">
              <svg className="w-full h-full" viewBox="0 0 400 600" fill="none">
                <path d="M0 0L400 100L350 300L0 250Z" fill="url(#gradient1)" fillOpacity="0.05"/>
                <path d="M0 200L300 150L250 400L0 450Z" fill="url(#gradient2)" fillOpacity="0.04"/>
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6"/>
                    <stop offset="100%" stopColor="#8B5CF6"/>
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4"/>
                    <stop offset="100%" stopColor="#3B82F6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* 右侧几何形状 */}
            <div className="absolute top-0 right-0 w-1/2 h-full">
              <svg className="w-full h-full" viewBox="0 0 500 600" fill="none">
                <path d="M500 0L200 80L300 250L500 200Z" fill="url(#gradient3)" fillOpacity="0.06"/>
                <path d="M500 300L150 350L250 550L500 500Z" fill="url(#gradient4)" fillOpacity="0.05"/>
                <defs>
                  <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6"/>
                    <stop offset="100%" stopColor="#EC4899"/>
                  </linearGradient>
                  <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6"/>
                    <stop offset="100%" stopColor="#06B6D4"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* 浮动装饰点 */}
            <div className="absolute top-20 left-1/4 w-3 h-3 bg-blue-400/60 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-indigo-400/60 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-cyan-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 左侧内容 */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
                <div className="w-2 h-2 bg-[#194fe8] rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">产品介绍</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                为外贸企业打造全链路管理系统
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                12大核心模块+4种版本选择，从基础管理到智能决策，适配企业不同发展阶段
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <FormButton>
                  免费试用30天
                </FormButton>
                <FormButton variant="outline">
                  <Phone className="w-5 h-5" />
                  <span>400-026-2606</span>
                </FormButton>
              </div>
            </div>

            {/* 右侧表单 */}
            <div className="relative flex justify-end">
              <InlineFormComponent />
              
              {/* 装饰元素 */}
              <div className="absolute -top-4 -right-4 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -right-4 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 模块介绍 */}
      <section id="modules" className="py-24 bg-gray-50 w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-200 mb-6">
              <div className="w-2 h-2 bg-[#194fe8] rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-700">12大核心模块</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              全业务流程数字化管理
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              从产品管理到智能决策，实现数据互通、流程协同
            </p>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`bg-white rounded-xl lg:rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden ${
                  expandedModule === module.id 
                    ? 'border-[#194fe8] shadow-lg'
                    : ''
                }`}
              >
                {/* Module Header */}
                <div 
                  className="p-4 sm:p-6 cursor-pointer"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gray-200 transition-colors mx-auto sm:mx-0">
                    <module.icon className="w-8 h-8 text-[#194fe8]" />
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 text-center sm:text-left lg:text-left">
                    {module.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 sm:mb-4 text-center sm:text-left lg:text-left">
                    {module.subtitle}
                  </p>

                  <div className="flex items-center justify-between sm:justify-between">
                    <button className="text-[#194fe8] hover:text-[#1640c7] font-medium text-xs sm:text-sm transition-colors mx-auto sm:mx-0">
                      查看功能
                    </button>
                    
                    <div className="text-gray-400">
                      {expandedModule === module.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Features Panel */}
                  {expandedModule === module.id && (
                    <div className="bg-gray-50 border-t border-gray-200 p-4 sm:p-6">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4">核心功能</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {module.features.map((feature, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center space-x-2 p-2 sm:p-3 bg-white rounded-lg border border-gray-100"
                          >
                            <div className="w-1.5 h-1.5 bg-[#194fe8] rounded-full"></div>
                            <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button className="w-full mt-3 sm:mt-4 bg-[#194fe8] hover:bg-[#1640c7] text-white font-medium py-2 px-4 rounded-lg transition-colors text-xs sm:text-sm">
                        了解更多详情
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="bg-[#194fe8] rounded-lg lg:rounded-xl p-6 sm:p-8 text-white">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                体验完整的ERP解决方案
              </h3>
              <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg px-4">
                12大核心模块，覆盖企业全业务流程，立即开启数字化转型之旅
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button className="bg-white text-[#194fe8] hover:bg-gray-100 font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 text-sm sm:text-base">
                  免费试用30天
                </button>
                <button className="border border-white text-white hover:bg-white hover:text-[#194fe8] font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 text-sm sm:text-base">
                  预约产品演示
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 版本对比 */}
      <VersionComparison />

      {/* 独立的FAQ组件 */}
      <FAQSection />
    </div>
  );
};

export default ProductIntroduction;