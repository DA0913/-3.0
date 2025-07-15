import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';

const ModulesInterface = () => {
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
    <section id="modules" className="py-12 sm:py-16 lg:py-24 bg-gray-50 w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-white rounded-full border border-gray-200 mb-4 sm:mb-6 text-xs sm:text-sm">
            <div className="w-2 h-2 bg-[#194fe8] rounded-full mr-2"></div>
            <span className="font-medium text-gray-700">12大核心模块</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            久火ERP全链路数字化解决方案
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            覆盖企业经营全业务流程，从产品管理到智能决策，实现数据互通、流程协同
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`bg-white rounded-xl lg:rounded-2xl border transition-all duration-200 overflow-hidden ${
                expandedModule === module.id 
                  ? 'border-[#194fe8] shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Module Header */}
              <div 
                className="p-4 sm:p-6 cursor-pointer"
                onClick={() => toggleModule(module.id)}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gray-200 transition-colors mx-auto sm:mx-0">
                  <module.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#194fe8]" />
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
  );
};

export default ModulesInterface;