import React from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import FormButton from './FormButton';

const Contact = () => {
  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-24 bg-white w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-50 rounded-full border border-gray-200 mb-4 sm:mb-6 text-xs sm:text-sm">
            <div className="w-2 h-2 bg-[#194fe8] rounded-full mr-2"></div>
            <span className="font-medium text-gray-700">联系我们</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            开启您的数字化转型之旅
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            专业的外贸ERP解决方案，助力企业实现业务增长和效率提升
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">联系方式</h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">服务热线</h4>
                    <p className="text-[#194fe8] font-bold text-base sm:text-lg">400-026-2606</p>
                    <p className="text-xs sm:text-sm text-gray-500">工作时间：9:00-18:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">邮箱咨询</h4>
                    <p className="text-sm sm:text-base text-gray-600">info@jiufire.com</p>
                    <p className="text-xs sm:text-sm text-gray-500">24小时在线接收</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">公司地址</h4>
                    <p className="text-sm sm:text-base text-gray-600">西安市高新区丈八一路1号</p>
                    <p className="text-sm sm:text-base text-gray-600">汇鑫中心B座2005室</p>
                    <p className="text-xs sm:text-sm text-gray-500">欢迎预约参观</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">官方网站</h4>
                    <p className="text-sm sm:text-base text-[#194fe8]">www.jiufire.com</p>
                    <p className="text-xs sm:text-sm text-gray-500">了解更多产品信息</p>
                  </div>
                </div>
              </div>

              {/* 销售顾问二维码 */}
              <div className="mt-6 sm:mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 text-center">添加专属销售顾问</h4>
                <div className="flex justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg flex items-center justify-center border border-gray-200 p-2">
                    <img 
                      src="/qr-sales.png" 
                      alt="销售顾问微信二维码" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-2">扫码立即咨询</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-lg p-6 sm:p-8 border border-gray-200">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">获取专业咨询</h3>
            
            <div className="space-y-4 sm:space-y-6">
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                填写您的联系信息，我们的专业顾问将在24小时内与您联系，为您提供个性化的解决方案建议。
              </p>

              <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  我们能为您提供：
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#194fe8] rounded-full"></div>
                    <span className="text-sm sm:text-base text-gray-700">免费的业务需求分析</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#194fe8] rounded-full"></div>
                    <span className="text-sm sm:text-base text-gray-700">个性化解决方案设计</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#194fe8] rounded-full"></div>
                    <span className="text-sm sm:text-base text-gray-700">产品功能演示</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#194fe8] rounded-full"></div>
                    <span className="text-sm sm:text-base text-gray-700">投资回报率评估</span>
                  </li>
                </ul>
              </div>

              <FormButton className="w-full">
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>立即获取专业咨询</span>
              </FormButton>

              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-500">
                  或直接拨打热线：
                  <span className="text-[#194fe8] font-semibold ml-1">400-026-2606</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;