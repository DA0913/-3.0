import React from 'react';
import { Phone, Mail, MapPin, Shield, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 主导航区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* 公司名称 */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">久</span>
              </div>
              <span className="text-xl font-bold">久火ERP</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              国内设计领先的外贸企业数字化解决方案服务商，专注于为外贸及跨境电商企业提供全链路数字化解决方案。
            </p>
            <div className="text-xs text-gray-500 mt-2">
              企业数字化基础建设 业务精细化运营专家
            </div>
            
            {/* 二维码区域 */}
            <div className="mt-6">
              <div className="flex space-x-4">
                {/* 专业服务二维码 */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 p-1">
                    <img 
                      src="/WechatIMG2.jpg" 
                      alt="扫码获取专业服务" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="hidden w-full h-full bg-gray-200 rounded items-center justify-center text-gray-500 text-xs">
                      二维码
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">扫码获取专业服务</p>
                </div>
                
                {/* 最新动态二维码 */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 p-1">
                    <img 
                      src="/WechatIMG4.jpg" 
                      alt="扫码了解久火最新动态" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="hidden w-full h-full bg-gray-200 rounded items-center justify-center text-gray-500 text-xs">
                      二维码
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">扫码了解久火最新动态</p>
                </div>
              </div>
            </div>
          </div>

          {/* 核心产品 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">核心产品</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">PDM产品管理系统</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SRM智能供应链管理</a></li>
              <li><a href="#" className="hover:text-white transition-colors">CRM客户营销管理</a></li>
              <li><a href="#" className="hover:text-white transition-colors">OMS高效订单管理</a></li>
              <li><a href="#" className="hover:text-white transition-colors">TMS物流管理系统</a></li>
              <li><a href="#" className="hover:text-white transition-colors">WMS现代化仓储控制</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FMS精细财务管理</a></li>
            </ul>
          </div>

          {/* 服务支持 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">服务支持</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">系统实施部署</a></li>
              <li><a href="#" className="hover:text-white transition-colors">数据迁移服务</a></li>
              <li><a href="#" className="hover:text-white transition-colors">业务分析反馈</a></li>
              <li><a href="#" className="hover:text-white transition-colors">个性化定制</a></li>
              <li><a href="#" className="hover:text-white transition-colors">技术培训服务</a></li>
              <li><a href="#" className="hover:text-white transition-colors">7×24小时支持</a></li>
            </ul>
          </div>

          {/* 联系我们 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">服务热线</p>
                  <p className="text-lg font-bold text-white">400-026-2606</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">邮箱</p>
                  <p className="text-white">info@jiufire.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">地址</p>
                  <p className="text-white">西安市高新区丈八一路1号</p>
                  <p className="text-white">汇鑫中心B座2005室</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">官网</p>
                  <p className="text-white">www.jiufire.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="border-t border-gray-800 pt-8">
          {/* 关键词 */}
          <div className="mb-4">
            <p className="text-sm text-gray-400 text-center">
              亚马逊ERP | 海外仓WMS | 星拓广告 | 物流追踪 | 跨境客服 | 跨境支付 | 亚马逊ERP管理系统
            </p>
          </div>

          {/* 版权和备案信息 */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-400">
              <span>西安市久火网络科技有限公司 版权所有 ©2025 久火ERP</span>
              <span>陕ICP备xxxxxxxx号</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>陕公网安备 xxxxxxxxxxxx号</span>
              </div>
            </div>
          </div>

          {/* 地址信息 */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              地址: 西安市高新区丈八一路1号汇鑫中心B座2005室
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;