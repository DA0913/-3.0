import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, Shield } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCustomerService, setShowCustomerService] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleNavigation = (page: string, sectionId?: string) => {
    if (page === 'product') {
      setCurrentPage('product');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'solutions') {
      setCurrentPage('solutions');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'knowledge') {
      setCurrentPage('knowledge');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'cases') {
      setCurrentPage('cases');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'about') {
      setCurrentPage('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentPage('home');
      // 等待页面切换完成后再滚动到指定区域
      setTimeout(() => {
        if (sectionId) {
          scrollToSection(sectionId);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
    setIsMenuOpen(false);
  };

  const handleAdminAccess = () => {
    window.location.href = '/admin';
  };

  const menuItems = [
    { name: '首页', id: 'home', action: () => handleNavigation('home') },
    { name: '产品介绍', id: 'product', action: () => handleNavigation('product') },
    { name: '解决方案', id: 'solutions', action: () => handleNavigation('solutions') },
    { name: '客户案例', id: 'cases', action: () => handleNavigation('cases') },
    { name: '外贸智库', id: 'knowledge', action: () => handleNavigation('knowledge') },
    { name: '关于我们', id: 'about', action: () => handleNavigation('about') }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 lg:space-x-3 cursor-pointer" onClick={() => handleNavigation('home')}>
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/logo.png" 
                alt="久火ERP Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-lg lg:text-xl font-bold text-gray-900">
              久火 ERP
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-6 2xl:space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`font-medium transition-colors duration-200 text-sm xl:text-base ${
                  (currentPage === 'home' && item.id === 'home') || 
                  (currentPage === 'product' && item.id === 'product') ||
                  (currentPage === 'solutions' && item.id === 'solutions') ||
                  (currentPage === 'knowledge' && item.id === 'knowledge') ||
                  (currentPage === 'cases' && item.id === 'cases') ||
                  (currentPage === 'about' && item.id === 'about')
                    ? 'text-[#194fe8]' 
                    : 'text-gray-700 hover:text-[#194fe8]'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            <div 
              className="relative"
              onMouseEnter={() => setShowCustomerService(true)}
              onMouseLeave={() => setShowCustomerService(false)}
            >
              <button className="px-6 py-2 bg-[#194fe8] hover:bg-[#1640c7] text-white font-medium rounded-lg transition-all duration-200">
                免费试用
              </button>
              
              {/* Customer Service Tooltip */}
              {showCustomerService && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-max z-50">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <MessageCircle className="w-4 h-4 text-[#194fe8]" />
                    <span>在线客服</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">7×24小时服务</div>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"></div>
                </div>
              )}
            </div>
            
            <button className="px-6 py-2 border border-gray-300 text-gray-700 hover:border-[#194fe8] hover:text-[#194fe8] font-medium rounded-lg transition-all duration-200">
              立即登录
            </button>

            {/* 管理员入口按钮 */}
            <button
              onClick={handleAdminAccess}
              className="p-1.5 lg:p-2 text-gray-400 hover:text-[#194fe8] transition-colors duration-200"
              title="管理员入口"
            >
              <Shield className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-2 rounded-md text-gray-700 hover:text-[#194fe8] transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="xl:hidden absolute top-16 lg:top-20 left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-50">
            <nav className="px-4 sm:px-6 py-4 space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`block w-full text-left px-3 sm:px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm sm:text-base ${
                    (currentPage === 'home' && item.id === 'home') || 
                    (currentPage === 'product' && item.id === 'product') ||
                    (currentPage === 'solutions' && item.id === 'solutions') ||
                    (currentPage === 'knowledge' && item.id === 'knowledge') ||
                    (currentPage === 'cases' && item.id === 'cases') ||
                    (currentPage === 'about' && item.id === 'about')
                      ? 'text-[#194fe8] bg-[#194fe8]/5' 
                      : 'text-gray-700 hover:text-[#194fe8] hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Action Buttons */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <button className="w-full bg-[#194fe8] hover:bg-[#1640c7] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 text-sm sm:text-base">
                  免费试用
                </button>
                <button className="w-full border border-gray-300 text-gray-700 hover:border-[#194fe8] hover:text-[#194fe8] font-medium py-3 px-4 rounded-lg transition-all duration-200 text-sm sm:text-base">
                  立即登录
                </button>
                
                {/* Mobile Admin Access */}
                <button
                  onClick={handleAdminAccess}
                  className="w-full flex items-center justify-center space-x-2 text-gray-500 hover:text-[#194fe8] py-2 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">管理员入口</span>
                </button>
                
                {/* Mobile Customer Service */}
                <div className="flex items-center justify-center space-x-2 text-[#194fe8] py-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">在线客服 7×24小时</span>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;