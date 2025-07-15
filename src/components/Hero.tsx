import React from 'react';
import { ArrowRight, Phone, Shield, CheckCircle } from 'lucide-react';
import FormButton from './FormButton';

const Hero = () => {
  const scrollToModules = () => {
    const element = document.getElementById('modules');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 w-full p-0">
      {/* 背景图片 */}
      <div className="absolute inset-0 opacity-40">
        <img
          src="/首页.jpg"
          alt="首页背景"
          className="w-full h-full object-cover object-center object-top"
        />
        {/* 添加渐变遮罩以确保文字可读性 */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-blue-50/40 to-indigo-100/60"></div>
      </div>

      {/* 增强的装饰元素 */}
      <div className="absolute inset-0 z-10">
        {/* 动态几何装饰元素 */}
        <div className="absolute inset-0">
          {/* 大型装饰圆 - 增强视觉效果 */}
          <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-teal-200/20 to-blue-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* 中型装饰圆 - 增强动画效果 */}
          <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-gradient-to-br from-indigo-200/15 to-blue-200/15 rounded-full blur-xl animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-lg animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
          
          {/* 小型装饰点 - 增强视觉层次 */}
          <div className="absolute top-1/4 right-1/3 w-16 h-16 bg-gradient-to-br from-blue-300/25 to-indigo-300/25 rounded-full blur-sm animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-gradient-to-br from-teal-300/25 to-cyan-300/25 rounded-full blur-sm animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
          
          {/* 增强的线性装饰元素 */}
          <div className="absolute top-0 left-0 w-full h-full">
            <svg className="absolute top-10 left-10 w-24 h-24 text-blue-300/20 animate-spin" style={{ animationDuration: '20s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            </svg>
            <svg className="absolute bottom-20 right-20 w-16 h-16 text-purple-300/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            </svg>
            
            {/* 新增的几何装饰 */}
            <div className="absolute top-1/2 left-10 w-6 h-6 bg-gradient-to-br from-emerald-300/30 to-teal-300/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-20 right-1/3 w-4 h-4 bg-gradient-to-br from-rose-300/30 to-pink-300/30 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
            <div className="absolute bottom-1/3 left-1/2 w-8 h-8 bg-gradient-to-br from-amber-300/25 to-orange-300/25 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>
          
          {/* 增强的网格背景 */}
          <div className="absolute inset-0 opacity-[0.05]">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          {/* 新增的光效装饰 */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent blur-sm animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 right-1/4 w-24 h-1 bg-gradient-to-r from-transparent via-purple-300/30 to-transparent blur-sm animate-pulse" style={{ animationDelay: '4s' }}></div>
          </div>
        </div>
      </div>

      {/* 内容层 */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 relative z-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8 text-left pl-4 sm:pl-6 lg:pl-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white/90 backdrop-blur-md rounded-full border border-gray-200/50 shadow-lg text-xs sm:text-sm ml-0">
              <div className="w-2 h-2 bg-[#194fe8] rounded-full animate-pulse"></div>
              <span className="font-medium text-gray-700">专业外贸ERP系统</span>
            </div>
            
            {/* Main Title */}
            <div className="space-y-2 lg:space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                久火外贸ERP - 全球贸易数字化引擎
              </h1>
            </div>
            
            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl ml-0">
              覆盖企业经营所有业务模块，针对跨境电商量身定制，从PDM产品管理到AI智能决策，打造一体化外贸数字化解决方案，助力企业全球化发展。
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg ml-0">
              <div className="bg-white/90 backdrop-blur-md rounded-lg p-3 sm:p-4 lg:p-5 border border-gray-200/50 text-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="text-xl sm:text-2xl font-bold text-[#194fe8] mb-1">2000+</div>
                <div className="text-xs sm:text-sm text-gray-600">企业客户</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-lg p-3 sm:p-4 lg:p-5 border border-gray-200/50 text-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="text-xl sm:text-2xl font-bold text-[#194fe8] mb-1">12+</div>
                <div className="text-xs sm:text-sm text-gray-600">核心模块</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-lg p-3 sm:p-4 lg:p-5 border border-gray-200/50 text-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="text-xl sm:text-2xl font-bold text-[#194fe8] mb-1">85%</div>
                <div className="text-xs sm:text-sm text-gray-600">效率提升</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <FormButton buttonId="btn-1">
                免费试用30天
              </FormButton>
              <FormButton variant="outline" buttonId="btn-2">
                <Phone className="w-5 h-5" />
                <span>400-026-2606</span>
              </FormButton>
            </div>

            {/* Security Features */}
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative pr-4 sm:pr-6 lg:pr-8 hidden sm:block">
            {/* ERP Interface Container */}
            <div className="bg-white/95 backdrop-blur-md rounded-xl lg:rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-500 overflow-hidden transform scale-90 lg:scale-95">
              {/* Top Navigation Bar */}
              <div className="bg-[#194fe8] text-white px-3 sm:px-4 lg:px-6 py-2 lg:py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 sm:w-5 h-5 lg:w-6 lg:h-6 rounded flex items-center justify-center overflow-hidden">
                      <img 
                        src="/logo.png" 
                        alt="久火ERP Logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="font-semibold text-xs sm:text-sm">久火ERP控制台</span>
                  </div>
                  
                  {/* Top Menu Items */}
                  <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 text-xs">
                    <button className="text-blue-300 hover:text-white transition-colors">工作台</button>
                    <button className="text-gray-400 hover:text-white transition-colors">业务中心</button>
                    <button className="text-gray-400 hover:text-white transition-colors">数据分析</button>
                    <button className="text-gray-400 hover:text-white transition-colors">系统设置</button>
                  </div>
                </div>
                
                <div className="flex space-x-1 sm:space-x-1.5">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>

              {/* Main Content Area with Sidebar */}
              <div className="flex">
                {/* Left Sidebar Menu */}
                <div className="w-12 sm:w-14 lg:w-16 bg-gray-50 border-r border-gray-200 p-1 sm:p-1.5 lg:p-2">
                  <div className="space-y-1">
                    {/* 久火Logo */}
                    <div className="flex items-center justify-center mb-2 sm:mb-3 lg:mb-4 p-1 sm:p-1.5 lg:p-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-white rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg p-0.5 sm:p-1">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-[#194fe8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* 分隔线 */}
                    <div className="border-t border-gray-200 mb-1.5 sm:mb-2 lg:mb-3"></div>
                    
                    <button className="w-full flex items-center justify-center p-1.5 sm:p-2 lg:p-3 text-white bg-[#194fe8] rounded-md lg:rounded-lg hover:bg-[#1640c7] transition-colors group" title="工作台">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17l-4-4 4-4 4 4-4 4z" />
                      </svg>
                    </button>
                    
                    <button className="w-full flex items-center justify-center p-1.5 sm:p-2 lg:p-3 text-gray-600 hover:bg-gray-100 hover:text-[#194fe8] rounded-md lg:rounded-lg transition-colors group" title="客户管理">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </button>
                    
                    <button className="w-full flex items-center justify-center p-1.5 sm:p-2 lg:p-3 text-gray-600 hover:bg-gray-100 hover:text-[#194fe8] rounded-md lg:rounded-lg transition-colors group" title="订单管理">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </button>
                    
                    <button className="w-full flex items-center justify-center p-1.5 sm:p-2 lg:p-3 text-gray-600 hover:bg-gray-100 hover:text-[#194fe8] rounded-md lg:rounded-lg transition-colors group" title="库存管理">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </button>
                    
                    <button className="w-full flex items-center justify-center p-1.5 sm:p-2 lg:p-3 text-gray-600 hover:bg-gray-100 hover:text-[#194fe8] rounded-md lg:rounded-lg transition-colors group" title="财务管理">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    
                    {/* 分隔线 */}
                    <div className="border-t border-gray-200 my-1.5 sm:my-2 lg:my-3"></div>
                    
                    <button className="w-full flex items-center justify-center p-1.5 sm:p-2 lg:p-3 text-gray-600 hover:bg-gray-100 hover:text-[#194fe8] rounded-md lg:rounded-lg transition-colors group" title="销售分析">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </button>
                    
                    <button className="w-full flex items-center justify-center p-1.5 sm:p-2 lg:p-3 text-gray-600 hover:bg-gray-100 hover:text-[#194fe8] rounded-md lg:rounded-lg transition-colors group" title="数据报表">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Main Dashboard Content */}
                <div className="flex-1 p-2 sm:p-3 lg:p-6">
                  {/* Breadcrumb */}
                  <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-gray-500 mb-2 sm:mb-3 lg:mb-4">
                    <span>首页</span>
                    <span>/</span>
                    <span>工作台</span>
                    <span>/</span>
                    <span className="text-[#194fe8]">数据概览</span>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-1 sm:gap-2 lg:gap-3 mb-2 sm:mb-3 lg:mb-4">
                    <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-md lg:rounded-lg p-1.5 sm:p-2 lg:p-3 border border-gray-100/50">
                      <div className="text-xs text-gray-500 mb-0.5 sm:mb-1">销售额</div>
                      <div className="text-xs sm:text-sm font-bold text-gray-900">8,249,082</div>
                      <div className="text-xs text-gray-500">美元</div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 backdrop-blur-sm rounded-md lg:rounded-lg p-1.5 sm:p-2 lg:p-3 border border-gray-100/50">
                      <div className="text-xs text-gray-500 mb-0.5 sm:mb-1">总支出</div>
                      <div className="text-xs sm:text-sm font-bold text-gray-900">5,386,000</div>
                      <div className="text-xs text-gray-500">美元</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-md lg:rounded-lg p-1.5 sm:p-2 lg:p-3 border border-gray-100/50">
                      <div className="text-xs text-gray-500 mb-0.5 sm:mb-1">主利润</div>
                      <div className="text-xs sm:text-sm font-bold text-[#194fe8]">2,820,082</div>
                      <div className="text-xs text-gray-500">美元</div>
                    </div>
                  </div>

                  {/* Smart Recommendations */}
                  <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-md lg:rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 lg:mb-4 border border-gray-100/50">
                    <div className="text-xs font-semibold text-gray-900 mb-1 sm:mb-2">智能决策建议</div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="w-1.5 h-1.5 bg-[#194fe8] rounded-full animate-pulse"></div>
                        <span className="text-gray-600">A9算法：产品库存不足，建议补货500件</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="w-1.5 h-1.5 bg-[#194fe8] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <span className="text-gray-600">市场趋势：该产品销量上升，建议增加库存</span>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Section */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-3">
                    <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/80 backdrop-blur-sm rounded-md lg:rounded-lg p-2 sm:p-3 border border-gray-100/50">
                      <div className="text-xs font-semibold text-gray-900 mb-0.5 sm:mb-1">销售分析</div>
                      <div className="text-xs sm:text-sm font-bold text-[#194fe8] mb-1 sm:mb-2">69,496 美元</div>
                      <div className="h-1.5 bg-gray-200 rounded-full">
                        <div className="h-1.5 bg-[#194fe8] rounded-full w-3/4 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-rose-50/80 to-pink-50/80 backdrop-blur-sm rounded-md lg:rounded-lg p-2 sm:p-3 border border-gray-100/50">
                      <div className="text-xs font-semibold text-gray-900 mb-0.5 sm:mb-1">支出分析</div>
                      <div className="flex items-center justify-center">
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
                          <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                          <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center border-2 border-[#194fe8]">
                            <span className="text-xs font-bold text-[#194fe8]">540</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="hidden sm:block absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md rounded-lg p-2 sm:p-3 shadow-xl border border-gray-200/50 animate-bounce hover:scale-110 transition-transform" style={{ animationDuration: '3s' }}>
              <div className="text-xs text-gray-500">业绩统计</div>
              <div className="text-xs sm:text-sm font-bold text-[#194fe8]">实时更新</div>
            </div>
            
            <div className="hidden lg:block absolute -bottom-4 lg:-bottom-6 -left-4 lg:-left-6 bg-white/95 backdrop-blur-md rounded-lg p-3 lg:p-4 shadow-xl border border-gray-200/50 hover:scale-110 transition-transform duration-300">
              <div className="flex items-center space-x-2 mb-1 lg:mb-2">
                <div className="w-3 h-3 lg:w-4 lg:h-4 bg-[#194fe8] rounded animate-pulse"></div>
                <span className="text-xs font-semibold text-gray-900">了解核心系统</span>
              </div>
              <button 
                onClick={scrollToModules}
                className="flex items-center space-x-1 text-[#194fe8] hover:text-[#1640c7] transition-colors group"
              >
                <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 额外的装饰元素 */}
            <div className="hidden lg:block absolute top-1/2 -right-6 lg:-right-8 w-3 h-3 lg:w-4 lg:h-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full animate-ping opacity-80 shadow-lg"></div>
            <div className="hidden lg:block absolute bottom-1/4 -left-3 lg:-left-4 w-2 h-2 lg:w-3 lg:h-3 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full animate-ping opacity-70 shadow-lg" style={{ animationDelay: '1s' }}></div>
            <div className="hidden lg:block absolute top-1/4 -left-1 lg:-left-2 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-ping opacity-60 shadow-md" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      </div>

      {/* 增强的底部渐变遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 lg:h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none w-full"></div>
    </section>
  );
};

export default Hero;