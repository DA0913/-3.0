import React, { useState, useEffect } from 'react';
import { Building2, Users, Award, TrendingUp, Star } from 'lucide-react';
import { db } from '../lib/database';

const TrustSection = () => {
  const [stats, setStats] = useState({
    customers: 2000,
    projects: 3000,
    satisfaction: 98,
    growth: 60
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Try to fetch customer cases count from the new database
        const response = await db.getCustomerCases();
        if (response.data && response.data.length > 0) {
          setStats(prev => ({ ...prev, customers: response.data!.length }));
        }
      } catch (error) {
        // Silently handle errors and keep default values
        console.log('Using default statistics data');
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to show loading state briefly
    const timer = setTimeout(() => {
      fetchStats();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const statItems = [
    {
      icon: Users,
      value: stats.customers.toLocaleString(),
      label: '服务客户',
      suffix: '+'
    },
    {
      icon: Building2,
      value: stats.projects.toLocaleString(),
      label: '孵化项目',
      suffix: '+'
    },
    {
      icon: Award,
      value: stats.satisfaction.toString(),
      label: '客户满意度',
      suffix: '%'
    },
    {
      icon: TrendingUp,
      value: stats.growth.toString(),
      label: '业务增长',
      suffix: '%'
    }
  ];

  // 客户评价数据
  const customerReviews = [
    {
      id: 1,
      company: '泰山瑞丰',
      logoImage: '/taishan.png',
      industry: '建材制造',
      period: '使用2年',
      reviewer: '张总监',
      position: 'IT总监',
      rating: 5,
      review: '"久火ERP帮助我们实现了建材业务的统一管理，订单处理效率提升了400%，库存周转率也大幅提升，系统稳定性很好，7×24小时的技术支持让我们很放心。"'
    },
    {
      id: 2,
      company: '乐目元器',
      logoImage: '/lixuj.png',
      industry: '电子元器件',
      period: '使用3年',
      reviewer: '李经理',
      position: '运营经理',
      rating: 5,
      review: '"作为电子元器件供应商，我们需要管理多个平台的订单和库存，久火ERP的多平台集成功能非常强大，帮助我们实现了精细化运营，销售额增长了60%。"'
    },
    {
      id: 3,
      company: '毅鑫实业',
      logoImage: '/yixin.png',
      industry: '生产贸易',
      period: '使用1年',
      reviewer: '王总',
      position: '副总经理',
      rating: 5,
      review: '"久火ERP的供应链管理功能很专业，帮助我们优化了采购流程，降低了20%的采购成本，财务管理模块也很完善，大大提升了我们的管理效率。"'
    },
    {
      id: 4,
      company: '立讯精密',
      logoImage: '/shixinw.png',
      industry: '生产贸易',
      period: '使用4年',
      reviewer: '陈主管',
      position: '信息主管',
      rating: 5,
      review: '"系统的报表功能非常强大，可以快速生成各种分析报告，为管理层决策提供了有力支持，客服响应也很及时，遇到问题都能快速解决。"'
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-50 to-indigo-50 w-full px-0">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            值得信赖的合作伙伴
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            多年来专注于为企业提供专业的外贸管理解决方案，赢得了众多客户的信任与好评
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg mb-3 sm:mb-4">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {item.value}{item.suffix}
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* 客户评价部分 */}
        <div className="mt-12 sm:mt-16 text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            客户评价
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            听听客户怎么说
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-full mx-auto">
            {customerReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
              >
                {/* 公司信息头部 */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm p-1 overflow-hidden">
                      <img
                        src={review.logoImage}
                        alt={`${review.company} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base sm:text-lg">{review.company}</h4>
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                        <span>{review.industry}</span>
                        <span>•</span>
                        <span>{review.period}</span>
                      </div>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                {/* 评价内容 */}
                <div className="mb-3 sm:mb-4">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed italic">
                    {review.review}
                  </p>
                </div>

                {/* 评价人信息 */}
                <div className="border-t pt-3 sm:pt-4">
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">{review.reviewer}</div>
                    <div className="text-gray-600">{review.position}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;