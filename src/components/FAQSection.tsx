import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs?: FAQItem[];
  className?: string;
}

const defaultFAQs: FAQItem[] = [
  {
    id: '1',
    question: '久火 ERP 适合什么样的企业使用？',
    answer: '久火 ERP 是国内设计领先的外贸企业数字化解决方案服务商，专为出口及内销型跨境电商企业精心打造，行业针对性强，能满足不同规模跨境电商企业的数字化管理需求。'
  },
  {
    id: '2',
    question: '久火 ERP 能帮企业解决哪些核心问题？',
    answer: '系统覆盖 PDM 产品管理、SRM 智能供应链、CRM 客户营销、OMS 订单管理等全业务模块，可提升预测精准度至 85% 以上，降低库存持有成本 20%-40%、生产效率提升 15%-25%、削减质量成本 20%-30%，助力企业精细化运营。'
  },
  {
    id: '3',
    question: '不同版本的功能有哪些主要差异？',
    answer: '基础版、专业版、企业版、旗舰版分别适配初创企业、成长型企业、大型企业和集团、超大型企业，在用户数、公司账号数量、功能丰富度等方面有差异，如旗舰版含顶级配置、AI 智能决策等，能满足不同发展阶段企业的诉求。'
  },
  {
    id: '4',
    question: '久火 ERP 的数据安全有保障吗？',
    answer: '有，采用 SAAS 蓝绿备份和 PAAS 私有部署两种模式，SAAS 模式安全省心，PAAS 模式私有部署私密放心，还实施数据加密、访问控制等措施，符合相关法律法规要求。'
  },
  {
    id: '5',
    question: '系统部署方式有哪些选择？',
    answer: '可根据企业需求选择云部署或本地部署，云部署便于远程访问和即时升级，本地部署更适合有特定安全或定制化需求的企业。'
  },
  {
    id: '6',
    question: '购买后能获得哪些服务支持？',
    answer: '提供基础搭建、数据迁移、分析反馈、数据保护、搭建部署、系统定制等专业运维服务，还有一对一售后服务、售后技术支持、定期回访及培训，系统会持续优化更新。'
  },
  {
    id: '7',
    question: '数据迁移过程中如何保障数据准确性？',
    answer: '久火 ERP 会先梳理数据结构，制定迁移方案与校验规则，通过专业数据迁移工具分批次迁移并实时校验，迁移完成后进行人工抽样复核和系统自动对账，保障大规模数据迁移的准确性。'
  },
  {
    id: '8',
    question: '可以免费试用久火 ERP 吗？',
    answer: '久火 ERP 基础版、专业版、企业版为助力企业初步体验，提供一定时长的免费试用权益，试用期间可使用该版本功能模块，帮助快速了解系统价值。'
  }
];

const FAQSection: React.FC<FAQSectionProps> = ({
  title = "常见问题",
  subtitle = "解答您关心的问题",
  faqs = defaultFAQs,
  className = ""
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const isExpanded = (id: string) => expandedItems.has(id);

  return (
    <section className={`py-16 sm:py-20 lg:py-24 ${className}`} style={{ backgroundColor: '#f0f4f9' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm mb-6">
            <div className="w-2 h-2 bg-[#194fe8] rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-700">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* FAQ列表 */}
        <div>
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* 问题标题 */}
              <button
                onClick={() => toggleExpanded(faq.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#194fe8] focus:ring-inset"
                aria-expanded={isExpanded(faq.id)}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <div className="flex items-start space-x-4 flex-1">
                  {/* 问题图标 */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-[#194fe8] rounded-full flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  {/* 问题文字 */}
                  <span className="text-lg font-semibold text-gray-900 leading-relaxed pr-4">
                    {faq.question}
                  </span>
                </div>
                
                {/* 展开/折叠图标 */}
                <div className="flex-shrink-0 ml-4">
                  {isExpanded(faq.id) ? (
                    <ChevronUp className="w-6 h-6 text-[#194fe8] transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400 transition-transform duration-300 hover:text-[#194fe8]" />
                  )}
                </div>
              </button>

              {/* 答案内容 */}
              <div
                id={`faq-answer-${faq.id}`}
                className={`transition-all duration-500 ease-in-out ${
                  isExpanded(faq.id)
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
                style={{
                  overflow: 'hidden'
                }}
              >
                <div className="px-6 pb-6">
                  <div className="pl-10 pr-4">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-700 leading-relaxed text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            还有其他问题？
          </p>
          <button className="inline-flex items-center px-6 py-3 bg-[#194fe8] hover:bg-[#1640c7] text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
            <HelpCircle className="w-5 h-5 mr-2" />
            联系客服
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;