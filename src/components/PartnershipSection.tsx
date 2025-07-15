import React from 'react';
import { Users, Settings, Package } from 'lucide-react';
import FormButton from './FormButton';

const PartnershipSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gray-50 w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm mb-4 sm:mb-6 text-xs sm:text-sm">
            <div className="w-2 h-2 bg-[#194fe8] rounded-full mr-2"></div>
            <span className="font-medium text-gray-700">合作伙伴</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            耦合发展、共同飞跃
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
            连接百行千业优势，区域优势及支付优势的合作伙伴，整合资源，实现产品融合、营销互通、市场同力的生态发展模式
            <a href="#" className="text-[#194fe8] hover:text-[#1640c7] ml-2 font-medium">了解更多 →</a>
          </p>
          
          <div className="flex justify-center">
            <FormButton className="bg-[#194fe8] hover:bg-[#1640c7] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base">
              立即成为合作伙伴
            </FormButton>
          </div>
        </div>

        {/* 合作伙伴类型 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* 分销型合作伙伴 */}
          <div className="bg-white rounded-xl lg:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 text-center relative overflow-hidden group">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 rounded-full transform translate-x-12 sm:translate-x-16 -translate-y-12 sm:-translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">分销型合作伙伴</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 sm:mb-6">
                具备完善云产品代理中台产品的销售，客服能力及丰富的客户资源，
                在深度云计算行业深耕多年，共同开拓，推动客户数字化转型
              </p>
              
              {/* 3D图标区域 */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 relative">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#194fe8] rounded-full flex items-center justify-center shadow-md">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
                {/* 装饰元素 */}
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-blue-300/50 rounded-full"></div>
                <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 bg-indigo-300/50 rounded-full"></div>
              </div>
              
              <FormButton variant="outline" className="border-[#194fe8] text-[#194fe8] hover:bg-[#194fe8] hover:text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5">
                立即加入
              </FormButton>
            </div>
          </div>

          {/* 解决方案合作伙伴 */}
          <div className="bg-white rounded-xl lg:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 text-center relative overflow-hidden group">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full transform translate-x-12 sm:translate-x-16 -translate-y-12 sm:-translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">解决方案合作伙伴</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 sm:mb-6">
                具备自主交付中台产品能力，基于完善云产品技术本身
                整合，形成整体解决方案的合作伙伴，包括ISV、SI、
                咨询公司、PaaS供应商、SaaS供应商等
              </p>
              
              {/* 3D图标区域 */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 relative">
                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
                {/* 装饰元素 */}
                <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 bg-emerald-300/50 rounded-full"></div>
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-teal-300/50 rounded-full"></div>
              </div>
              
              <FormButton variant="outline" className="border-[#194fe8] text-[#194fe8] hover:bg-[#194fe8] hover:text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5">
                立即加入
              </FormButton>
            </div>
          </div>

          {/* 产品交付合作伙伴 */}
          <div className="bg-white rounded-xl lg:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 text-center relative overflow-hidden group">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full transform translate-x-12 sm:translate-x-16 -translate-y-12 sm:-translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">产品交付合作伙伴</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 sm:mb-6">
                具备完善云产品的交付实施和技术服务能力，向客
                户提供交付实施、架构咨询和技术服务管理等服务的合作
              </p>
              
              {/* 3D图标区域 */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 relative">
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform rotate-2 group-hover:rotate-4 transition-transform duration-300">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
                    <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
                {/* 装饰元素 */}
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-purple-300/50 rounded-full"></div>
                <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 bg-pink-300/50 rounded-full"></div>
              </div>
              
              <FormButton variant="outline" className="border-[#194fe8] text-[#194fe8] hover:bg-[#194fe8] hover:text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5">
                立即加入
              </FormButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipSection;