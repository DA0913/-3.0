import React, { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import PartnershipForm from './PartnershipForm';

const PartnerSupport = () => {
  const [isPartnershipFormOpen, setIsPartnershipFormOpen] = useState(false);

  const communityFeatures = [
    { title: '成功案例' },
    { title: '赋能培训' },
    { title: '物料下载' },
    { title: '政策解读' },
    { title: '问题答疑' },
    { title: '营销工具' }
  ];

  return (
    <section className="py-0 bg-transparent overflow-hidden">
      {/* 全宽背景容器 */}
      <div className="relative">
        {/* 背景色延伸 - 带斜切效果 */}
        <div className="absolute inset-0">
          {/* 左侧背景改为图片 */}
          <div 
            className="absolute inset-0 bg-center bg-cover"
            style={{ 
              backgroundImage: "url('/WechatIMG5.jpg')"
            }}
          ></div>
          
          {/* 右侧背景改为同一张图片 */}
          <div 
            className="absolute inset-0 bg-center bg-cover"
            style={{ 
              backgroundImage: "url('/WechatIMG5.jpg')"
            }}
          ></div>
        </div>
        
        {/* 内容容器 */}
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* 左侧蓝色区域 */}
            <div className="bg-transparent text-white p-8 lg:p-12 relative overflow-hidden min-h-[500px] lg:pr-16">
              {/* 背景装饰 */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full transform translate-x-20 -translate-y-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/3 rounded-full transform -translate-x-16 translate-y-16"></div>
              <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/30 rounded-full"></div>
              <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full"></div>
              
              <div className="relative z-10 h-full flex flex-col">
                <div className="inline-flex items-center px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
                  <span>生态合作</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                  久火 ERP 代理商专属支持
                </h2>
                
                {/* 科技感图片区域 */}
                <div className="flex-1 flex items-center mb-8">
                  <div className="w-80 h-48 bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 shadow-2xl">
                    <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center relative">
                      {/* 科技感背景 */}
                      <div className="absolute inset-0">
                        <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                        <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-white/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                      </div>
                      
                      {/* 标题和描述 */}
                      <div className="relative z-10 text-center px-6">
                        <h3 className="text-2xl font-bold mb-3 text-white">星火伙伴计划</h3>
                        <p className="text-white/90 text-sm leading-relaxed">
                          为代理商打造深度合作体系，提供 ERP 数字化方案全流程支持。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 底部区域 */}
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setIsPartnershipFormOpen(true)}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 hover:border-white/50 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <span>查看详情</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>

                  {/* 分页指示器 */}
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <div className="w-8 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    </div>
                    <span className="text-white/70 text-sm">1 / 2</span>
                    <div className="flex flex-col space-y-1">
                      <ChevronDown className="w-4 h-4 text-white/60 cursor-pointer hover:text-white transition-colors" />
                      <ChevronDown className="w-4 h-4 text-white/60 cursor-pointer hover:text-white transition-colors rotate-180" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧黑色区域 */}
            <div className="bg-transparent text-white p-8 lg:p-12 relative min-h-[500px] pl-8 lg:pl-32">
              {/* 背景装饰点 */}
              <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400 rounded-full"></div>
              <div className="absolute top-16 right-12 w-1 h-1 bg-purple-400 rounded-full"></div>
              <div className="absolute bottom-20 left-8 w-1 h-1 bg-blue-300 rounded-full"></div>

              <div className="mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/10">
                  <span>久火 ERP 代理商社区</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight">
                  与伙伴共成长，
                  <br />
                  共享业务增长力
                </h2>
              </div>

              {/* 功能网格 - 2x3布局 */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {communityFeatures.map((feature, index) => (
                  <button
                    key={index}
                    className="bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700/50 hover:border-gray-600/70 backdrop-blur-sm p-6 rounded-xl transition-all duration-300 group text-center min-h-[100px] flex items-center justify-center"
                  >
                    <span className="text-base font-medium text-gray-200 group-hover:text-white transition-colors">
                      {feature.title}
                    </span>
                  </button>
                ))}
              </div>

              {/* 底部装饰 */}
              <div className="absolute bottom-8 left-8 flex space-x-2">
                <div className="w-2 h-2 bg-[#194fe8] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="w-2 h-2 bg-white/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 渠道合作表单 */}
      <PartnershipForm 
        isOpen={isPartnershipFormOpen} 
        onClose={() => setIsPartnershipFormOpen(false)} 
      />
    </section>
  );
};

export default PartnerSupport; 