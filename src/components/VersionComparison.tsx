import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Star, 
  Users, 
  Building, 
  Zap,
  Shield,
  Crown,
  ChevronDown,
  ChevronUp,
  Info,
  Package,
  Handshake,
  TrendingUp,
  Mail,
  Truck,
  Calculator,
  UserCheck,
  Settings,
  BarChart3,
  Workflow
} from 'lucide-react';
import FormButton from './FormButton';

const VersionComparison = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // 版本配置
  const versions = [
    {
      id: 'basic',
      name: '基础版',
      subtitle: 'SAAS云端版',
      icon: Users,
      color: 'from-[#194fe8] to-[#1640c7]',
      bgColor: 'bg-[#194fe8]/10',
      textColor: 'text-[#194fe8]',
      description: '适合初创企业和小型团队',
      userLimit: '5+用户',
      companyLimit: '1个公司账号',
      highlights: ['基础功能完备', '快速上手', '云端部署']
    },
    {
      id: 'professional',
      name: '专业版',
      subtitle: 'SAAS云端版',
      icon: Building,
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      description: '适合成长型企业',
      userLimit: '10+用户',
      companyLimit: '2个公司账号',
      highlights: ['功能更丰富', '多公司管理', '高级分析'],
      popular: true
    },
    {
      id: 'enterprise',
      name: '企业版',
      subtitle: 'SAAS云端版',
      icon: Crown,
      color: 'from-[#194fe8] to-[#1640c7]',
      bgColor: 'bg-[#194fe8]/10',
      textColor: 'text-[#194fe8]',
      description: '适合大型企业和集团',
      userLimit: '15+用户',
      companyLimit: '3个公司账号',
      highlights: ['全功能版本', '企业级安全', '定制化服务']
    },
    {
      id: 'flagship',
      name: '旗舰版',
      subtitle: 'SAAS云端版',
      icon: Zap,
      color: 'from-[#194fe8] to-[#1640c7]',
      bgColor: 'bg-[#194fe8]/10',
      textColor: 'text-[#194fe8]',
      description: '适合超大型企业',
      userLimit: '20+用户',
      companyLimit: '3个公司账号',
      highlights: ['顶级配置', 'AI智能决策', '专属服务']
    }
  ];

  // 功能分类和具体功能
  const featureCategories = [
    {
      id: 'workspace',
      name: '工作台',
      icon: Users,
      features: [
        { name: '待办事项', basic: true, professional: true, enterprise: true, flagship: true },
        { name: '今日汇率', basic: true, professional: true, enterprise: true, flagship: true },
        { name: '我的日历', basic: false, professional: true, enterprise: true, flagship: true },
        { name: '月度销售', basic: false, professional: true, enterprise: true, flagship: true },
        { name: '每日故障', basic: false, professional: false, enterprise: true, flagship: true }
      ]
    },
    {
      id: 'collaboration',
      name: '协同办公',
      icon: Users,
      features: [
        { name: '认领公海', basic: false, professional: true, enterprise: true, flagship: true },
        { name: '客户扫描', basic: false, professional: false, enterprise: true, flagship: true },
        { name: '文档管理', basic: true, professional: true, enterprise: true, flagship: true },
        { name: '审核管理', basic: false, professional: true, enterprise: true, flagship: true },
        { name: '会议管理', basic: false, professional: false, enterprise: true, flagship: true },
        { name: '协作空间', basic: false, professional: false, enterprise: false, flagship: true }
      ]
    },
    {
      id: 'product',
      name: '产品管理',
      icon: Package,
      features: [
        { name: '产品管理', basic: true, professional: true, enterprise: true, flagship: true },
        { name: '分析报表', basic: false, professional: false, enterprise: true, flagship: true },
        { name: '产品运营', basic: false, professional: false, enterprise: false, flagship: true },
        { name: '辅助资料', basic: false, professional: false, enterprise: false, flagship: true }
      ]
    },
    {
      id: 'business',
      name: '业务伙伴',
      icon: Handshake,
      features: [
        { name: '业务伙伴', basic: true, professional: true, enterprise: true, flagship: true },
        { name: '分析报表', basic: false, professional: false, enterprise: true, flagship: true }
      ]
    },
    {
      id: 'marketing',
      name: '营销管理',
      icon: TrendingUp,
      features: [
        { name: '商机管理', basic: false, professional: false, enterprise: true, flagship: true },
        { name: '邮件营销', basic: false, professional: false, enterprise: true, flagship: true },
        { name: '智能营销', basic: false, professional: false, enterprise: false, flagship: true },
        { name: '分析报表', basic: false, professional: false, enterprise: false, flagship: true }
      ]
    },
    {
      id: 'customer',
      name: '客户管理',
      icon: Users,
      features: [
        { name: '私域客户', basic: true, professional: true, enterprise: true, flagship: true },
        { name: '公共客户', basic: true, professional: true, enterprise: true, flagship: true },
        { name: '分析报表', basic: false, professional: false, enterprise: true, flagship: true },
        { name: '智能呼叫', basic: false, professional: false, enterprise: false, flagship: true }
      ]
    },
    {
      id: 'mail',
      name: '邮件管理',
      icon: Mail,
      features: [
        { name: '邮件管理', basic: true, professional: true, enterprise: true, flagship: true },
        { name: '邮件工具', basic: false, professional: false, enterprise: false, flagship: true }
      ]
    },
    {
      id: 'business-center',
      name: '业务中心',
      icon: Building,
      features: [
        { name: '销售管理', basic: true, professional: true, enterprise: true, flagship: true },
        { name: '采购管理', basic: true, professional: true, enterprise: true, flagship: true },
        { name: '库后管理', basic: false, professional: true, enterprise: true, flagship: true },
        { name: '质量管理', basic: false, professional: false, enterprise: true, flagship: true }
      ]
    },
    {
      id: 'logistics',
      name: '物流管理',
      icon: Truck,
      features: [
        { name: '物流管理', basic: false, professional: true, enterprise: true, flagship: true },
        { name: '物流平台', basic: false, professional: false, enterprise: false, flagship: true }
      ]
    },
    {
      id: 'warehouse',
      name: '仓储中心',
      icon: Package,
      features: [
        { name: '入库业务', basic: false, professional: true, enterprise: true, flagship: true },
        { name: '出库业务', basic: false, professional: true, enterprise: true, flagship: true },
        { name: '分析报表', basic: false, professional: false, enterprise: false, flagship: true }
      ]
    },
    {
      id: 'finance',
      name: '财务管理',
      icon: Calculator,
      features: [
        { name: '应收管理', basic: false, professional: true, enterprise: true, flagship: true },
        { name: '应付管理', basic: false, professional: true, enterprise: true, flagship: true },
        { name: '合同管理', basic: false, professional: false, enterprise: true, flagship: true },
        { name: '发票工具', basic: false, professional: false, enterprise: false, flagship: true }
      ]
    },
    {
      id: 'hr',
      name: '人力资源',
      icon: UserCheck,
      features: [
        { name: '招聘管理', basic: false, professional: false, enterprise: true, flagship: true },
        { name: '员工管理', basic: false, professional: false, enterprise: true, flagship: true },
        { name: '智能人事', basic: false, professional: false, enterprise: false, flagship: true }
      ]
    },
    {
      id: 'admin',
      name: '行政管理',
      icon: Settings,
      features: [
        { name: '通知公告', basic: false, professional: false, enterprise: true, flagship: true },
        { name: '资产管理', basic: false, professional: false, enterprise: true, flagship: true },
        { name: '商务合同', basic: false, professional: false, enterprise: false, flagship: true }
      ]
    },
    {
      id: 'data',
      name: '数据驾舱',
      icon: BarChart3,
      features: [
        { name: '财务汇总', basic: false, professional: true, enterprise: true, flagship: true },
        { name: '数据概览', basic: false, professional: false, enterprise: false, flagship: true }
      ]
    },
    {
      id: 'process',
      name: '流程中心',
      icon: Workflow,
      features: [
        { name: '消息管理', basic: true, professional: true, enterprise: true, flagship: true },
        { name: '流程管理', basic: false, professional: true, enterprise: true, flagship: true }
      ]
    },
    {
      id: 'system',
      name: '系统设置',
      icon: Settings,
      features: [
        { name: '用户管理', basic: true, professional: true, enterprise: true, flagship: true },
        { name: '公共资料', basic: true, professional: true, enterprise: true, flagship: true },
        { name: '业务资料', basic: true, professional: true, enterprise: true, flagship: true },
        { name: '账套管理', basic: true, professional: true, enterprise: true, flagship: true },
        { name: '安全设置', basic: true, professional: true, enterprise: true, flagship: true }
      ]
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // 计算功能支持状态的文字描述
  const getFeatureStatusText = (supportedCount: number, totalCount: number) => {
    if (supportedCount === totalCount) {
      return '包含';
    } else if (supportedCount === 0) {
      return '不包含';
    } else {
      return '部分包含';
    }
  };

  const getFeatureIcon = (supported: boolean) => {
    return supported ? (
      <div className="flex justify-center">
        <Check className="w-5 h-5 text-green-500 font-bold" />
      </div>
    ) : (
      <div className="flex justify-center">
        <X className="w-5 h-5 text-gray-400" />
      </div>
    );
  };

  return (
    <section className="py-24 bg-gray-50 w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm mb-6">
            <div className="w-2 h-2 bg-[#194fe8] rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-700">版本对比</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            选择适合您的ERP版本
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            从基础版到旗舰版，满足不同规模企业的数字化管理需求
          </p>
        </div>

        {/* 版本卡片概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {versions.map((version) => {
            const Icon = version.icon;
            return (
              <div
                key={version.id}
                className={`relative bg-white p-8 transition-all duration-300 shadow-sm hover:shadow-lg border border-gray-100 ${
                  version.popular ? '' : ''
                }`}
                style={{ borderRadius: '12px' }}
              >
                {version.popular && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-1 shadow-md">
                      <Star className="w-4 h-4" />
                      <span>推荐</span>
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  {/* 版本标题 */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {version.name}
                  </h3>
                  
                  {/* SAAS云端版标识 */}
                  <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
                    SAAS云端版
                  </div>
                  
                  {/* 描述文字 */}
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {version.description}
                  </p>
                  
                  {/* 核心信息 */}
                  <div className="space-y-3 mb-8 text-left">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">用户数</span>
                      <span className="text-sm font-semibold text-gray-900">{version.userLimit}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">公司账号</span>
                      <span className="text-sm font-semibold text-gray-900">{version.companyLimit}</span>
                    </div>
                  </div>
                  
                  {/* 核心特性 */}
                  <div className="space-y-2 mb-8 text-left">
                    {version.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA按钮 */}
                  <FormButton className={`w-full ${
                    'bg-[#194fe8] hover:bg-[#1640c7]'
                  } text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg`}>
                    选择{version.name}
                  </FormButton>
                </div>
              </div>
            );
          })}
        </div>

        {/* 详细功能对比表 */}
        <div className="bg-white overflow-hidden" style={{ 
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
          <div className="p-6 bg-white text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">详细功能对比</h3>
            <p className="text-gray-600">查看各版本的具体功能差异</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#F5F7FA' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-base font-semibold text-gray-900 w-1/5">
                    功能模块
                  </th>
                  {versions.map((version) => (
                    <th key={version.id} className="px-6 py-4 text-center text-base font-semibold text-gray-900 w-1/5">
                      <div className="flex flex-col items-center space-y-2">
                        <span>{version.name}</span>
                        {version.popular && (
                          <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            推荐
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {featureCategories.map((category) => (
                  <React.Fragment key={category.id}>
                    {/* 分类标题行 */}
                    <tr 
                      className="bg-white hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-200"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <category.icon className="w-5 h-5 text-[#194fe8]" />
                          <span className="font-semibold text-gray-900 text-base">{category.name}</span>
                          {expandedCategory === category.id ? (
                            <ChevronUp className="w-4 h-4 text-[#194fe8]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#194fe8]" />
                          )}
                        </div>
                      </td>
                      {versions.map((version) => {
                        const supportedCount = category.features.filter(f => f[version.id as keyof typeof f]).length;
                        const totalCount = category.features.length;
                        return (
                          <td key={version.id} className="px-6 py-4 text-center align-middle">
                            <div className="flex justify-center">
                              <span className="px-3 py-1 bg-[#194fe8]/10 text-[#194fe8] text-xs font-medium rounded-full">
                                {getFeatureStatusText(supportedCount, totalCount)}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* 功能详情行 */}
                    {expandedCategory === category.id && category.features.map((feature, index) => (
                      <tr key={index} className="bg-white hover:bg-gray-50 transition-colors border-b border-gray-100">
                        <td className="px-6 py-3 pl-12">
                          <span className="text-sm text-gray-900 font-medium">{feature.name}</span>
                        </td>
                        <td className="px-6 py-3 text-center align-middle">
                          {getFeatureIcon(feature.basic)}
                        </td>
                        <td className="px-6 py-3 text-center align-middle">
                          {getFeatureIcon(feature.professional)}
                        </td>
                        <td className="px-6 py-3 text-center align-middle">
                          {getFeatureIcon(feature.enterprise)}
                        </td>
                        <td className="px-6 py-3 text-center align-middle">
                          {getFeatureIcon(feature.flagship)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 底部说明 */}
        <div className="mt-12 bg-[#194fe8]/5 p-6" style={{ 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-[#194fe8] mt-1" />
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">版本说明</h4>
              <div className="space-y-2 text-gray-700">
                <p>• 所有版本均为SAAS云端部署，无需本地安装维护</p>
                <p>• 支持数据实时同步和自动备份</p>
                <p>• 提供7×24小时技术支持服务</p>
                <p>• 可根据业务发展随时升级版本</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA区域 */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#194fe8] to-indigo-600 p-8 text-white" style={{ 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 className="text-2xl font-bold mb-4">
              还在犹豫选择哪个版本？
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              我们的专业顾问将根据您的业务需求，为您推荐最适合的版本
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <FormButton className="bg-white text-[#194fe8] hover:bg-gray-100">
                免费咨询方案
              </FormButton>
              <button 
                className="border-2 border-white text-white hover:bg-white hover:text-[#194fe8] bg-transparent font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                style={{ color: 'white !important' }}
              >
                预约产品演示
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VersionComparison;