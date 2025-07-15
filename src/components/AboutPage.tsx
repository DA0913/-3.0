import React from 'react';
import { 
  Users, 
  Target, 
  Award, 
  TrendingUp,
  CheckCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Zap,
  Shield,
  Clock,
  Star,
  Heart,
  Lightbulb,
  Rocket,
  Building
} from 'lucide-react';
import FormButton from './FormButton';

const AboutPage = () => {
  // 公司发展历程
  const milestones = [
    {
      year: '2021',
      title: '公司成立',
      description: '久火科技成立，专注外贸ERP系统研发',
      icon: Building
    },
    {
      year: '2022',
      title: '产品研发',
      description: '核心团队组建，开始ERP系统架构设计',
      icon: Lightbulb
    },
    {
      year: '2023',
      title: '产品发布',
      description: '久火ERP 1.0版本正式发布，获得首批客户认可',
      icon: Rocket
    },
    {
      year: '2024',
      title: '快速发展',
      description: '服务企业突破30,000家，成为行业领先品牌',
      icon: TrendingUp
    }
  ];

  // 核心团队
  const team = [
    {
      name: '张总',
      position: '创始人 & CEO',
      description: '15年外贸行业经验，曾任知名外贸企业高管',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: '李总',
      position: '技术总监 & CTO',
      description: '10年企业级软件开发经验，技术架构专家',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: '王总',
      position: '产品总监',
      description: '8年产品管理经验，深度理解外贸业务需求',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: '刘总',
      position: '运营总监',
      description: '12年企业服务经验，客户成功专家',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  // 企业文化价值观
  const values = [
    {
      icon: Heart,
      title: '客户至上',
      description: '始终以客户需求为导向，为客户创造价值'
    },
    {
      icon: Lightbulb,
      title: '创新驱动',
      description: '持续技术创新，引领行业发展趋势'
    },
    {
      icon: Shield,
      title: '品质保证',
      description: '严格的质量标准，确保产品稳定可靠'
    },
    {
      icon: Users,
      title: '团队协作',
      description: '开放包容的团队文化，共同成长进步'
    }
  ];

  // 企业荣誉
  const honors = [
    {
      year: '2024',
      title: '外贸数字化领军企业',
      organization: '中国电子商务协会'
    },
    {
      year: '2024',
      title: '最佳ERP解决方案奖',
      organization: '中国软件行业协会'
    },
    {
      year: '2023',
      title: '高新技术企业',
      organization: '国家科技部'
    },
    {
      year: '2023',
      title: '优秀软件产品奖',
      organization: '陕西省软件行业协会'
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-16 w-full">
      {/* 优化后的Banner设计 */}
      <section className="relative min-h-[500px] flex items-center bg-gradient-to-r from-blue-50 to-purple-50 overflow-hidden py-16 w-full">
        {/* 背景装饰元素 */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-20 w-16 h-16 bg-gradient-to-br from-teal-200/30 to-blue-200/30 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-lg"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm mb-6">
              <div className="w-2 h-2 bg-[#194fe8] rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">关于我们</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              深耕外贸数字化，与企业共成长
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto mb-8">
              三年潜心研发，以技术创新与实战智慧，成为外贸企业信赖的合作伙伴
            </p>

            <div className="flex items-center justify-center space-x-4">
              <FormButton>
                了解更多
              </FormButton>
              <FormButton variant="outline">
                <Phone className="w-5 h-5" />
                <span>联系我们</span>
              </FormButton>
            </div>
          </div>
        </div>
      </section>

      {/* 公司简介 */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                专注外贸数字化的技术创新企业
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  西安齐鹿软件技术有限公司旗下的久火ERP以其精炼的行业洞察与前瞻性的技术视野，为出口及内销型跨境电商企业精心打造了一套全面升级的业务运营管理体系。融合国际领先ERP系统的设计精髓，借鉴并超越市场现有产品的设计理念，加之深厚外贸实战智慧的积淀，历经长时间的酝酿思考、三年的潜心研发，终呈献出一套集PAAS与SAAS模式之大成的革新性解决方案。
                </p>
                <p>
                  这套系统深刻融及企业运营的核心领域，从"PDM产品管理系统、SRM智能供应链化管理、CRM客户营销管理、OMS高效订单管理、TMS物流网络管理系统、WMS现代化仓储控制、FMS精细财务管理、BDA深度数据分析、HCM人力资源管理、ADM行政管理系统、OA无缝协同办公、AI赋能的智能决策到API灵活数据交互接口"，全方位覆盖，为企业构筑坚实的数字化管理基石。
                </p>
                <p>
                  正值跨境电商作为国家发展战略新高地的黄金时期，面对科技与产业变革的激流波涛，以及国家对数字经济基础设施建设的强力推动，久火ERP恰逢其时地挺立潮头，为跨境电商企业注入了强大的技术驱动力与精细化管理能力，助力企业在白热化的市场竞争中破浪前行，稳健实现持续增长与卓越成就。
                </p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#194fe8] mb-2">30,000+</div>
                  <div className="text-sm text-gray-600">服务企业</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#194fe8] mb-2">12</div>
                  <div className="text-sm text-gray-600">核心模块</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#194fe8] mb-2">99.9%</div>
                  <div className="text-sm text-gray-600">系统稳定性</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="/657c8a961966b29d59741182e0ff9d51a8a3514f3b7d40-W7QSBs.jpeg"
                alt="公司团队"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 发展历程 */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              发展历程
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              从初创到行业领先，见证我们与客户共同成长的每一步
            </p>
          </div>

          <div className="relative">
            {/* 时间线 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#194fe8]"></div>
            
            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <milestone.icon className="w-6 h-6 text-[#194fe8]" />
                        <h3 className="text-xl font-semibold text-gray-900">
                          {milestone.title}
                        </h3>
                      </div>
                      <p className="text-gray-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* 时间节点 */}
                  <div className="relative z-10 w-16 h-16 bg-[#194fe8] rounded-full flex items-center justify-center text-white font-bold">
                    {milestone.year}
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 核心团队 */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              核心团队
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              汇聚行业精英，以专业和热忱为客户创造价值
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#194fe8] hover:shadow-lg transition-all duration-300 text-center"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-[#194fe8] font-medium mb-3">
                  {member.position}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 企业文化 */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              企业文化
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              以价值观为指引，打造卓越的企业文化
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-8 border border-gray-200 hover:border-[#194fe8] hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-[#194fe8] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 企业荣誉 */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              企业荣誉
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              获得行业认可，见证我们的专业实力
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {honors.map((honor, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200 text-center"
              >
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-yellow-600 font-medium mb-2">
                  {honor.year}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {honor.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {honor.organization}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系我们 */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              联系我们
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              期待与您携手，共创数字化未来
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* 联系信息 */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#194fe8] rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">公司地址</h3>
                  <p className="text-gray-600">西安市高新区丈八一路1号</p>
                  <p className="text-gray-600">汇鑫中心B座2005室</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#194fe8] rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">联系电话</h3>
                  <p className="text-[#194fe8] font-bold text-lg">400-026-2606</p>
                  <p className="text-gray-600 text-sm">工作时间：9:00-18:00</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#194fe8] rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">邮箱地址</h3>
                  <p className="text-gray-600">info@jiufire.com</p>
                  <p className="text-gray-600 text-sm">24小时在线接收</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#194fe8] rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">官方网站</h3>
                  <p className="text-[#194fe8]">www.jiufire.com</p>
                  <p className="text-gray-600 text-sm">了解更多产品信息</p>
                </div>
              </div>

              {/* 销售顾问二维码 */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">添加专属销售顾问</h3>
                <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center border border-gray-200 p-2">
                    <img 
                      src="/qr-sales.png" 
                      alt="销售顾问微信二维码" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <p className="text-center text-gray-600 text-sm">扫码添加微信，获取专业咨询</p>
              </div>
            </div>

            {/* 地图或图片 */}
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <img
                src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="公司环境"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  欢迎来访
                </h3>
                <p className="text-gray-600 mb-6">
                  我们期待与您面对面交流，深入了解您的业务需求
                </p>
                <FormButton className="w-full">
                  预约参观
                </FormButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA区域 */}
      <section className="bg-[#194fe8] py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            携手久火，共创数字化未来
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            让我们成为您数字化转型路上最可靠的合作伙伴
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FormButton className="bg-white text-[#194fe8] hover:bg-gray-100">
              开始合作
            </FormButton>
            <FormButton variant="outline" className="border-white text-white hover:bg-white hover:text-[#194fe8]">
              了解更多
            </FormButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;