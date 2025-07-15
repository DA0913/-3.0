import React from 'react';
import { 
  CheckCircle,
  ArrowRight,
  Phone,
  Settings
} from 'lucide-react';
import FormButton from './FormButton';

const Services = () => {
  const services = [
    {
      iconImage: '/tubuiao1.png',
      title: '基础搭建',
      description: '专业的系统部署和环境配置',
      features: [
        '系统架构设计',
        '环境部署配置',
        '基础功能设置',
        '用户权限配置'
      ]
    },
    {
      iconImage: '/tubiao2.png',
      title: '数据迁移',
      description: '安全可靠的数据迁移服务',
      features: [
        '数据评估分析',
        '迁移方案制定',
        '数据清洗整理',
        '迁移验证测试'
      ]
    },
    {
      iconImage: '/tubiao3.png',
      title: '分析反馈',
      description: '深度业务分析和优化建议',
      features: [
        '业务流程分析',
        '数据报表定制',
        '性能监控预警',
        '优化建议提供'
      ]
    },
    {
      iconImage: '/tibiao4.png',
      title: '系统定制',
      description: '个性化功能定制开发',
      features: [
        '需求调研分析',
        '定制方案设计',
        '功能开发实现',
        '测试上线部署'
      ]
    }
  ];

  const supportFeatures = [
    '7×24小时技术支持',
    '专属客户成功经理',
    '定期系统健康检查',
    '免费功能更新升级',
    '在线培训和文档',
    '远程技术支持服务'
  ];

  return (
    <section id="services" className="py-12 sm:py-16 lg:py-24 bg-white w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-50 rounded-full border border-gray-200 mb-4 sm:mb-6 text-xs sm:text-sm">
            <div className="w-2 h-2 bg-[#194fe8] rounded-full mr-2"></div>
            <span className="font-medium text-gray-700">运维服务</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            全周期专业服务支持
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            从系统搭建到运营优化，提供全方位的专业服务保障
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-[#f0f4f9] p-4 sm:p-6 hover:shadow-lg transition-all duration-300 group"
              style={{ borderRadius: '2px' }}
            >
              <img
                src={service.iconImage}
                alt={service.title}
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain mb-3 sm:mb-4 group-hover:scale-110 transition-all duration-300 relative z-10 mx-auto"
              />
              
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors text-center">
                {service.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 sm:mb-4 group-hover:text-gray-700 transition-colors text-center">
                {service.description}
              </p>

              <div className="space-y-1.5 sm:space-y-2 text-center">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center justify-center space-x-2 group/item">
                    <div className="w-4 h-4 bg-[#194fe8]/10 rounded-full flex items-center justify-center group-hover/item:scale-110 transition-transform duration-200">
                      <CheckCircle className="w-2.5 h-2.5 text-[#194fe8]" />
                    </div>
                    <span className="text-xs text-gray-700 group-hover:text-gray-800 transition-colors font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Support Features */}
        <div className="bg-white p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
             style={{ borderRadius: '2px' }}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-[#194fe8]/5 mb-4 sm:mb-6 text-xs sm:text-sm" style={{ borderRadius: '2px' }}>
                <div className="w-2 h-2 bg-[#194fe8] rounded-full mr-2"></div>
                <span className="font-medium text-[#194fe8]">服务保障</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                持续运维保障
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                我们不仅提供优秀的产品，更提供持续的服务保障，确保您的系统始终高效运行，
                业务持续增长。
              </p>
              
              <div className="space-y-2 sm:space-y-3">
                {supportFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 group/support">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#194fe8] group-hover/support:scale-110 transition-transform duration-200 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700 group-hover/support:text-gray-900 transition-colors font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-[#194fe8]/5 p-6 sm:p-8 relative overflow-hidden group/card"
                 style={{ borderRadius: '2px' }}>
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#194fe8] flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover/card:scale-110 group-hover/card:shadow-xl transition-all duration-300"
                     style={{ borderRadius: '2px' }}>
                  <Settings className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  专业服务团队
                </h4>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  拥有丰富经验的技术专家和客户成功团队，为您提供专业的服务支持
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <FormButton className="bg-[#194fe8] hover:bg-[#1640c7] text-white shadow-md hover:shadow-lg hover:scale-105 group/btn text-sm sm:text-base">
                    <span>联系服务团队</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform duration-200 ml-2" />
                  </FormButton>
                  <FormButton variant="outline" className="text-[#194fe8] hover:bg-[#194fe8] hover:text-white text-sm sm:text-base">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>400-026-2606</span>
                  </FormButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;