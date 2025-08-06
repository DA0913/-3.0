import React from 'react';

const PartnershipSection = () => {
  const supportItems = [
    {
      title: '扶持计划',
      description: '合作共赢，提供领军企业扶持计划，助力合作伙伴更好的发展公司及拓展市场。',
      icon: '/support-1.svg'
    },
    {
      title: '体系化培训',
      description: '提供完整的产品培训、使用操作培训销售技能等培训，随时预约，持续更新内容。',
      icon: '/support-2.svg'
    },
    {
      title: '运营支持',
      description: '专业运营团队为合作伙伴提供7x12小时的客户服务支持，做到快速响应',
      icon: '/support-3.svg'
    },
    {
      title: '销售计划',
      description: '客户跟进售前指导，重点大客户全程辅助跟进，持续输出客户成功方案',
      icon: '/support-4.svg'
    },
    {
      title: '技术支持',
      description: '专业的技术运维团队，将为合作伙伴及客户提供全方位的技术保障。',
      icon: '/support-5.svg'
    },
    {
      title: '市场支持',
      description: '为合作伙伴持续输出宣传页、PPT、案例等销售材料，专属授权服务商贴牌等。',
      icon: '/support-6.svg'
    },
    {
      title: '产品支持',
      description: '不定期优化送代产品，让产品跟上市场的步伐，年年的抓住客户需求，实现销售转化',
      icon: '/support-7.svg'
    },
    {
      title: '链接资源',
      description: '帮助优秀的合作伙伴链接资源、对接人脉、行业研究及数据资源等。',
      icon: '/support-8.svg'
    }
  ];

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            合作伙伴权益
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            为合作伙伴提供全方位的支持，助力业务发展
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {supportItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <img src={item.icon} alt={item.title} className="w-8 h-8 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnershipSection;