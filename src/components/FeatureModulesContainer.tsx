import React, { useState } from 'react';
import { 
  Package,
  Link,
  Users,
  ShoppingCart,
  Truck,
  Calculator,
  TrendingUp, 
  DollarSign,
  BarChart3,
  PieChart,
  Target,
  FileText,
  Settings,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  AlertTriangle,
  Award
} from 'lucide-react';
import FormButton from './FormButton';

const FeatureModulesContainer = () => {
  const [activeTab, setActiveTab] = useState('product-lifecycle');

  // 标签页配置
  const tabs = [
    { id: 'product-lifecycle', name: '产品全生命周期', icon: Package },
    { id: 'supply-chain', name: '智能供应链管理', icon: Link },
    { id: 'customer-operation', name: '客户精准运营', icon: Users },
    { id: 'order-processing', name: '高效订单处理', icon: ShoppingCart },
    { id: 'logistics-warehouse', name: '物流仓储协同', icon: Truck },
    { id: 'financial-management', name: '精细财务管理', icon: Calculator }
  ];

  // 产品全生命周期模块
  const productLifecycleModules = [
    {
      id: 'archive-management',
      title: '档案规范管理',
      description: '建立标准化产品档案，涵盖基础信息、主营行业、图库及手册',
      icon: FileText,
      features: ['基础信息管理', '主营行业分类', '产品图库管理']
    },
    {
      id: 'operation-tracking',
      title: '运营数据追踪',
      description: '通过销量、采购、质量等分析报表，把握产品运营动态',
      icon: BarChart3,
      features: ['销量分析', '采购分析', '质量报表']
    },
    {
      id: 'price-strategy',
      title: '价格策略制定',
      description: '灵活设置产品价格策略，关联产品知识，支撑销售决策',
      icon: DollarSign,
      features: ['价格策略设置', '产品知识关联', '销售决策支撑']
    },
    {
      id: 'material-control',
      title: '辅料全面管控',
      description: '统一管理生产原料、配料及资产辅料，实现成本精准溯源',
      icon: Settings,
      features: ['原料管理', '配料管控', '成本溯源']
    },
    {
      id: 'version-tracking',
      title: '版本迭代记录',
      description: '全程追踪产品版本更新历史，记录修改内容与时间节点，保障版本追溯性',
      icon: Target,
      features: ['版本历史追踪', '修改内容记录', '时间节点管理']
    },
    {
      id: 'supply-chain-sync',
      title: '供应链协同联动',
      description: '打通产品与供应商、采购渠道的信息关联，实现供应链数据实时同步与响应',
      icon: Link,
      features: ['供应商信息关联', '采购渠道打通', '数据实时同步']
    }
  ];

  // 智能供应链管理模块
  const supplyChainModules = [
    {
      id: 'supplier-management',
      title: '供应商分级管理',
      description: '建立供应商、承运商等业务伙伴档案，跟踪供货表现',
      icon: Users,
      features: ['供应商档案管理', '承运商管理', '供货表现跟踪']
    },
    {
      id: 'smart-procurement',
      title: '智能采购执行',
      description: '自动化处理询价、订单、收货提醒等环节，减少人工干预',
      icon: Zap,
      features: ['自动询价处理', '订单自动化', '收货提醒系统']
    },
    {
      id: 'supply-analysis',
      title: '供货分析报表',
      description: '生成主营产品、行业及供货效率等分析，辅助供应链优化',
      icon: BarChart3,
      features: ['产品供货分析', '行业分析报表', '供货效率统计']
    },
    {
      id: 'collaborative-sharing',
      title: '协同信息共享',
      description: '实现与业务伙伴的信息互通，提升供应链响应速度',
      icon: Link,
      features: ['信息实时共享', '业务伙伴协同', '响应速度提升']
    },
    {
      id: 'risk-warning',
      title: '供应链风险预警',
      description: '实时监控供应商交货延迟、质量波动等风险指标，自动触发预警机制并提供应对建议',
      icon: AlertTriangle,
      features: ['交货延迟监控', '质量波动预警', '风险应对建议']
    },
    {
      id: 'performance-incentive',
      title: '供应商绩效激励',
      description: '基于供货质量、及时性等数据建立激励机制，促进供应商提升服务水平',
      icon: Award,
      features: ['绩效评估体系', '激励机制设计', '服务水平提升']
    }
  ];

  // 客户精准运营模块
  const customerOperationModules = [
    {
      id: 'customer-classification',
      title: '客户分级维护',
      description: '区分私海与公海客户，重点管理新增及重点客户资源',
      icon: Users,
      features: ['私海客户管理', '公海客户分配', '重点客户维护']
    },
    {
      id: 'opportunity-tracking',
      title: '商机智能跟进',
      description: '自动化管理询盘与动态商机，记录分配及转化情况',
      icon: Target,
      features: ['询盘自动管理', '商机动态跟踪', '转化情况分析']
    },
    {
      id: 'multi-channel-marketing',
      title: '多元营销触达',
      description: '整合邮件、展会、广告及社交工具，拓宽获客渠道',
      icon: TrendingUp,
      features: ['邮件营销', '展会管理', '社交工具整合']
    },
    {
      id: 'customer-analysis',
      title: '客户数据剖析',
      description: '通过资产、关注产品及成交分析，优化客户运营策略',
      icon: BarChart3,
      features: ['客户资产分析', '产品关注度', '成交数据分析']
    },
    {
      id: 'service-tickets',
      title: '客户服务工单',
      description: '自动记录客户咨询、投诉及售后需求，分配处理人员并跟踪解决进度',
      icon: FileText,
      features: ['咨询记录管理', '投诉处理跟踪', '售后服务管理']
    },
    {
      id: 'sales-collaboration',
      title: '销售团队协作',
      description: '实现客户信息、跟进记录的团队内共享，避免重复跟进，提升协作效率',
      icon: Shield,
      features: ['客户信息共享', '跟进记录同步', '团队协作优化']
    }
  ];

  // 高效订单处理模块
  const orderProcessingModules = [
    {
      id: 'order-creation',
      title: '订单快速创建',
      description: '支持多渠道订单自动同步与手动录入，关联客户信息与产品数据，实现订单一键生成',
      icon: Zap,
      features: ['多渠道订单同步', '客户信息关联', '产品数据关联']
    },
    {
      id: 'order-tracking',
      title: '订单状态追踪',
      description: '实时更新订单审核、备货、发货、签收等状态，通过可视化看板直观展示进度',
      icon: BarChart3,
      features: ['实时状态更新', '可视化看板', '进度直观展示']
    },
    {
      id: 'exception-handling',
      title: '异常订单处理',
      description: '智能识别超期未发、库存不足等异常订单，自动推送提醒并提供处理方案建议',
      icon: AlertTriangle,
      features: ['异常智能识别', '自动提醒推送', '处理方案建议']
    },
    {
      id: 'fulfillment-coordination',
      title: '订单履约协同',
      description: '打通订单与库存、物流系统的数据联动，实现备货、分拣、发货环节无缝衔接',
      icon: Link,
      features: ['库存系统联动', '物流系统打通', '环节无缝衔接']
    },
    {
      id: 'order-analysis',
      title: '多维度订单分析',
      description: '生成订单量、转化率、客单价等维度分析报表，辅助销售策略调整与业绩复盘',
      icon: PieChart,
      features: ['订单量分析', '转化率统计', '客单价分析']
    },
    {
      id: 'batch-processing',
      title: '订单批量处理',
      description: '支持批量审核、批量发货、批量打印单据等操作，提升高单量场景下的处理效率',
      icon: Settings,
      features: ['批量审核操作', '批量发货处理', '批量单据打印']
    }
  ];

  // 物流仓储协同模块
  const logisticsWarehouseModules = [
    {
      id: 'inventory-management',
      title: '库存精准管理',
      description: '实时追踪库存数量、库位信息及批次效期，支持多仓库、多货位库存统一调配',
      icon: Package,
      features: ['实时库存追踪', '多仓库管理', '批次效期管理']
    },
    {
      id: 'warehouse-automation',
      title: '仓储作业自动化',
      description: '自动化指引入库上架、出库拣货、盘点等作业流程，提升仓储操作效率',
      icon: Settings,
      features: ['入库上架指引', '出库拣货优化', '盘点流程自动化']
    },
    {
      id: 'logistics-dispatch',
      title: '物流配送调度',
      description: '对接多家物流服务商，智能匹配最优配送方案，跟踪物流轨迹并同步更新状态',
      icon: Truck,
      features: ['多物流商对接', '智能配送匹配', '物流轨迹跟踪']
    },
    {
      id: 'cost-analysis',
      title: '仓储成本分析',
      description: '统计仓储租金、人工、损耗等成本数据，生成分析报表，辅助成本优化决策',
      icon: Calculator,
      features: ['仓储租金统计', '人工成本分析', '损耗成本控制']
    },
    {
      id: 'inventory-warning',
      title: '多维度库存预警',
      description: '设置安全库存、超储库存阈值，自动触发短缺提醒或滞销预警，避免库存积压与断货',
      icon: AlertTriangle,
      features: ['安全库存预警', '超储库存提醒', '滞销预警机制']
    },
    {
      id: 'smart-inventory',
      title: '智能盘点管理',
      description: '支持定期盘点、循环盘点及动态盘点，自动生成盘点差异报表并指导差异调整',
      icon: BarChart3,
      features: ['定期盘点管理', '循环盘点优化', '差异报表生成']
    },
    {
      id: 'barcode-tracking',
      title: '条码化全程追溯',
      description: '通过条码/二维码关联产品入库、出库、移库等全环节，实现单品级溯源与责任追溯',
      icon: Target,
      features: ['条码二维码管理', '全环节追溯', '单品级溯源']
    }
  ];

  // 精细财务管理模块
  const financialManagementModules = [
    {
      id: 'receivables-management',
      title: '应收款精细化',
      description: '管理收款认领、外汇到账及各类收款单据，确保资金回笼',
      icon: TrendingUp,
      features: ['收款认领管理', '外汇到账跟踪', '收款单据处理']
    },
    {
      id: 'payables-management',
      title: '应付款可控化',
      description: '处理付款申请、退款及各类付款单据，优化资金支出',
      icon: DollarSign,
      features: ['付款申请处理', '退款管理', '付款单据管控']
    },
    {
      id: 'expense-management',
      title: '费用规范管理',
      description: '统一处理费用报销、差旅报销及借款还款，把控支出合理性',
      icon: FileText,
      features: ['费用报销管理', '差旅报销处理', '借款还款跟踪']
    },
    {
      id: 'invoice-management',
      title: '发票全周期管控',
      description: '涵盖开票申请、销进项发票及通知，实现票据合规管理',
      icon: Settings,
      features: ['开票申请管理', '销进项发票', '票据合规管控']
    },
    {
      id: 'cash-flow-tracking',
      title: '资金流向追踪',
      description: '实时监控企业资金收支动态，关联收付款单据与业务订单，生成资金流水可视化报表',
      icon: BarChart3,
      features: ['资金收支监控', '单据订单关联', '流水可视化报表']
    },
    {
      id: 'financial-reports',
      title: '财务报表自动化',
      description: '自动生成资产负债表、利润表及现金流量表，支持多维度数据钻取与自定义报表配置',
      icon: PieChart,
      features: ['三大报表自动生成', '多维度数据钻取', '自定义报表配置']
    }
  ];

  // 获取当前标签页的配置
  const getCurrentTabConfig = () => {
    switch (activeTab) {
      case 'product-lifecycle':
        return {
          title: '产品全生命周期',
          subtitle: '久火 ERP 的 PDM 产品管理系统，助力企业高效管理产品从建档到运营的完整周期，整合多维度信息，驱动产品策略优化。',
          highlights: ['档案规范管理', '运营数据追踪', '辅料关联管控'],
          modules: productLifecycleModules,
          icon: Package,
          ctaTitle: '体验完整的产品全生命周期管理',
          ctaDescription: '从产品建档到运营优化，助力企业实现产品全生命周期数字化管理'
        };
      case 'supply-chain':
        return {
          title: '智能供应链管理',
          subtitle: '久火 ERP 的 SRM 系统，自动化提升供应商关系管理效率，优化采购流程，强化供应链协同能力。',
          highlights: ['供应商动态评估', '采购流程自动化', '供货数据可视化'],
          modules: supplyChainModules,
          icon: Link,
          ctaTitle: '体验智能供应链管理系统',
          ctaDescription: '从供应商管理到采购自动化，全面提升供应链协同效率'
        };
      case 'customer-operation':
        return {
          title: '客户精准运营',
          subtitle: '久火 ERP 的 CRM 系统，整合公私域客户资源，跟踪销售机会，通过多渠道营销提升客户运营效能。',
          highlights: ['客户分级维护', '商机智能跟进', '多渠道营销整合'],
          modules: customerOperationModules,
          icon: Users,
          ctaTitle: '体验客户精准运营系统',
          ctaDescription: '从客户分级到商机转化，全面提升客户运营效率和营销效果'
        };
      case 'order-processing':
        return {
          title: '高效订单处理',
          subtitle: '久火 ERP 的 OMS 系统，全流程自动化处理订单从创建到履约的各个环节，提升订单响应速度与履约准确率，优化客户交付体验。',
          highlights: ['全流程自动化', '订单状态实时追踪', '异常智能预警'],
          modules: orderProcessingModules,
          icon: ShoppingCart,
          ctaTitle: '体验高效订单处理系统',
          ctaDescription: '从订单创建到履约交付，全流程自动化提升订单处理效率和客户满意度'
        };
      case 'logistics-warehouse':
        return {
          title: '物流仓储协同',
          subtitle: '久火 ERP 的 WMS 系统，整合仓储管理与物流配送全流程，实现库存精准管控与物流高效调度，降低仓储成本。',
          highlights: ['库存实时监控', '智能仓储作业', '物流路径优化'],
          modules: logisticsWarehouseModules,
          icon: Truck,
          ctaTitle: '体验物流仓储协同系统',
          ctaDescription: '从库存管理到物流配送，全面提升仓储效率和物流协同能力'
        };
      case 'financial-management':
        return {
          title: '精细财务管理',
          subtitle: '久火ERP的FMS系统，全面覆盖应收、应付、费用及发票管理，实现财务活动精准管控与高效协同。',
          highlights: ['收付款全流程', '费用规范报销', '发票智能管理'],
          modules: financialManagementModules,
          icon: Calculator,
          ctaTitle: '体验精细财务管理系统',
          ctaDescription: '从收付款管理到财务报表，全面提升财务管理精度和效率'
        };
      default:
        return {
          title: '产品全生命周期',
          subtitle: '久火 ERP 的 PDM 产品管理系统，助力企业高效管理产品从建档到运营的完整周期，整合多维度信息，驱动产品策略优化。',
          highlights: ['档案规范管理', '运营数据追踪', '辅料关联管控'],
          modules: productLifecycleModules,
          icon: Package,
          ctaTitle: '体验完整的产品全生命周期管理',
          ctaDescription: '从产品建档到运营优化，助力企业实现产品全生命周期数字化管理'
        };
    }
  };

  const currentConfig = getCurrentTabConfig();
  const IconComponent = currentConfig.icon;

  return (
    <section className="py-16 bg-gray-50 w-full relative overflow-hidden">
      {/* 专业背景图片 */}
      <div className="absolute inset-0 z-0">
        <img
          src="/beij.png"
          alt="企业管理解决方案背景"
          className="w-full h-full object-cover opacity-40"
          loading="lazy"
        />
        {/* 渐变遮罩层确保文字可读性 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/75 to-blue-50/80"></div>
        {/* 额外的蓝色调遮罩层增强商务感 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-indigo-50/30"></div>
      </div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm mb-6">
            <div className="w-2 h-2 bg-[#194fe8] rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-700">核心功能模块</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            全面的企业管理解决方案
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            从产品管理到供应链协同，提供完整的数字化管理功能
          </p>
        </div>

        {/* 标签页导航 */}
        <div className="flex flex-wrap justify-center mb-8 bg-[#f0f4f9] backdrop-blur-sm rounded-md p-2 border border-gray-200/50 relative z-10">
          {tabs.map((tab) => {
            const TabIconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#194fe8] text-white shadow-md'
                    : 'text-gray-600 hover:text-[#194fe8] hover:bg-blue-50'
                }`}
              >
                <TabIconComponent className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* 主要内容区域 */}
        <div className="grid lg:grid-cols-4 gap-8 relative z-10">
          {/* 左侧主要功能介绍 */}
          <div className="lg:col-span-1">
            <div className="bg-[#f0f4f9] backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 h-full">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-[#194fe8] rounded-xl flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{currentConfig.title}</h3>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {currentConfig.subtitle}
              </p>

              <div className="space-y-3 mb-8">
                {currentConfig.highlights.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <FormButton className="w-full bg-[#194fe8] hover:bg-[#1640c7] text-white">
                  免费试用
                </FormButton>
                <button className="w-full flex items-center justify-center space-x-2 text-[#194fe8] hover:bg-blue-50 py-3 px-4 rounded-lg transition-colors">
                  <span>查看详情</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 右侧功能模块网格 */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentConfig.modules.map((module) => {
                const ModuleIconComponent = module.icon;
                return (
                  <div
                    key={module.id}
                    className="bg-[#f0f4f9] backdrop-blur-sm rounded-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200/50 hover:border-gray-300/70 hover:bg-[#f0f4f9]"
                  >
                    {/* 模块头部 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{module.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {module.description}
                        </p>
                      </div>
                      <ModuleIconComponent className="w-8 h-8 text-[#194fe8] group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    {/* 功能特性 */}
                    <div className="space-y-2 mb-4">
                      {module.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#194fe8]"></div>
                          <span className="text-xs text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* 查看详情按钮 */}
                    <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors text-sm font-medium text-[#194fe8] hover:bg-gray-50">
                      <span>查看详情</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureModulesContainer;