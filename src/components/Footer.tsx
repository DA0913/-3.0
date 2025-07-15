import React from 'react';
import { Zap, Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#194fe8] rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold">久火ERP</span>
            </div>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              国内设计领先的外贸企业数字化解决方案服务商，专注为外贸及跨境电商企业提供全链路数字化解决方案。
            </p>
            <div className="text-xs sm:text-sm text-gray-500">
              企业数字化基础建设 业务精细化运营专家
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">核心产品</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-400">
              <li>PDM产品管理系统</li>
              <li>SRM智能供应链管理</li>
              <li>CRM客户营销管理</li>
              <li>OMS高效订单管理</li>
              <li>TMS物流管理系统</li>
              <li>WMS现代化仓储控制</li>
              <li>FMS精细财务管理</li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">服务支持</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-400">
              <li>系统实施部署</li>
              <li>数据迁移服务</li>
              <li>业务分析反馈</li>
              <li>个性化定制</li>
              <li>技术培训服务</li>
              <li>7×24小时支持</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">联系我们</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#194fe8] flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">服务热线</p>
                  <p className="text-sm sm:text-base text-white font-semibold">400-026-2606</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#194fe8] flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">邮箱</p>
                  <p className="text-sm sm:text-base text-white">info@jiufire.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#194fe8] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">地址</p>
                  <p className="text-sm sm:text-base text-white">西安市高新区丈八一路1号</p>
                  <p className="text-sm sm:text-base text-white">汇鑫中心B座2005室</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#194fe8] flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">官网</p>
                  <p className="text-sm sm:text-base text-white">www.jiufire.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Follow Us - QR Codes */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">关注我们</h3>
            <div className="space-y-4">
              {/* WeChat QR Code */}
              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 border-2 border-gray-600 p-1">
                  <img 
                    src="/qr-wechat.png" 
                    alt="久火ERP微信公众号" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-gray-400">微信公众号</p>
                <p className="text-xs text-gray-300 font-medium">久火ERP</p>
              </div>
              
              {/* TikTok QR Code */}
              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 border-2 border-gray-600 p-1">
                  <img 
                    src="/qr-douyin.png" 
                    alt="久火ERP抖音号" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-gray-400">抖音号</p>
                <p className="text-xs text-gray-300 font-medium">久火ERP官方</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2024 久火ERP. 保留所有权利. | 陕ICP备xxxxxxxx号
            </p>
            <div className="flex space-x-4 sm:space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                隐私政策
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                服务条款
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                网站地图
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;