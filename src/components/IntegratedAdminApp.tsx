import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Newspaper, 
  Users,
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Award, 
  Sliders,
  Star,
  Building,
  Briefcase
} from 'lucide-react';
import { db } from '../lib/database';
import AdminLogin from './AdminLogin';
import FormManagement from './FormManagement';
import NewsManagement from './NewsManagement';
import CombinedCaseManagement from './CombinedCaseManagement';
import VariantFormManagement from './VariantFormManagement';
import ButtonFormManager from './ButtonFormManager';
import PartnershipApplicationsManagement from './PartnershipApplicationsManagement';
import SystemConfigManagement from './SystemConfigManagement';
import AnalyticsDashboard from './AnalyticsDashboard';
import UserManagement from './UserManagement';

const IntegratedAdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 统一案例管理菜单项
  const menuItems = [
    {
      id: 'dashboard',
      name: '控制台',
      icon: LayoutDashboard,
      description: '系统概览和统计'
    },
    {
      id: 'analytics',
      name: '数据统计',
      icon: Award,
      description: '网站访问数据统计分析'
    },
    {
      id: 'forms',
      name: '客户表单管理',
      icon: FileText,
      description: '客户提交表单管理'
    },
    {
      id: 'partnership-applications',
      name: '代理商申请管理',
      icon: Briefcase,
      description: '渠道合作申请管理'
    },
    {
      id: 'news',
      name: '新闻管理',
      icon: Newspaper,
      description: '新闻资讯内容管理'
    },
    {
      id: 'case-management',
      name: '案例综合管理',
      icon: Building,
      description: '客户案例与案例配置统一管理'
    },
    {
      id: 'variant-forms',
      name: '表单配置',
      icon: FileText,
      description: '变体表单链接管理'
    },
    {
      id: 'button-forms',
      name: '按钮表单路由',
      icon: FileText,
      description: '按钮与表单映射管理'
    },
    {
      id: 'users',
      name: '用户管理',
      icon: Users,
      description: '系统用户权限管理'
    },
    {
      id: 'settings',
      name: '系统设置',
      icon: Settings,
      description: '系统配置和参数'
    }
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // 检查用户是否已登录
      if (db.isAuthenticated()) {
        // 验证当前用户
        const response = await db.getCurrentUser();
        if (response.data) {
          setIsAuthenticated(true);
        } else {
          // 如果token无效，清除认证状态
          db.logout();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('检查认证状态失败:', error);
      db.logout();
      setIsAuthenticated(false);
    } finally {
    setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await db.logout();
      setIsAuthenticated(false);
      setActiveTab('dashboard');
    } catch (error) {
      console.error('登出失败:', error);
      // 即使登出失败，也要清除本地状态
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#194fe8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'forms':
        return <FormManagement />;
      case 'partnership-applications':
        return <PartnershipApplicationsManagement />;
      case 'news':
        return <NewsManagement />;
      case 'case-management':
        return <CombinedCaseManagement />;
      case 'variant-forms':
        return <VariantFormManagement />;
      case 'button-forms':
        return <ButtonFormManager />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <SystemConfigManagement />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 侧边栏 */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#194fe8]">管理后台</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
              className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#194fe8] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
              <div>
                  <div className="font-medium">{item.name}</div>
                <div className={`text-xs ${activeTab === item.id ? 'text-blue-100' : 'text-gray-500'}`}>
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
        </nav>

        {/* 退出登录 */}
        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>退出登录</span>
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4">
          <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
            <h2 className="text-lg font-semibold text-gray-900">
                  {menuItems.find(item => item.id === activeTab)?.name}
            </h2>
            </div>

            <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Bell className="w-6 h-6" />
              </button>
              <div className="w-8 h-8 bg-[#194fe8] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </header>

        {/* 内容区域 */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* 遮罩层 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// 控制台内容组件
const DashboardContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">表单提交</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">新闻文章</p>
              <p className="text-2xl font-bold text-gray-900">48</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">客户案例</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">渠道申请</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">活跃用户</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">系统概览</h3>
        <p className="text-gray-600">
          欢迎使用 ERP 管理后台。您可以在这里管理表单提交、新闻内容、客户案例等各项内容。
        </p>
      </div>
    </div>
  );
};



// 系统设置组件
const SystemSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">系统设置</h3>
      <p className="text-gray-600">系统设置功能正在开发中...</p>
    </div>
  );
};

export default IntegratedAdminApp;
