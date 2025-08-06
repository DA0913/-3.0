import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Code, 
  Save, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Copy,
  Check,
  Globe,
  MessageCircle,
  Palette,
  Shield,
  Bell,
  Database,
  Monitor
} from 'lucide-react';
import { db } from '../lib/database';

interface SystemConfig {
  id?: string;
  site_name: string;
  site_url: string;
  customer_service_code: string;
  baidu_analytics_code: string;
  google_analytics_code: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  contact_phone: string;
  contact_email: string;
  company_address: string;
  icp_number: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  maintenance_mode: boolean;
  registration_enabled: boolean;
  email_notifications: boolean;
  created_at?: string;
  updated_at?: string;
}

const SystemConfigManagement: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>({
    site_name: '久火ERP',
    site_url: 'www.jiufire.com',
    customer_service_code: '',
    baidu_analytics_code: '',
    google_analytics_code: '',
    seo_title: '久火ERP - 国内设计领先的外贸企业数字化解决方案服务商',
    seo_description: '久火ERP专注外贸及跨境电商企业数字化转型，提供PDM、SRM、CRM、OMS、TMS、WMS、FMS等全链路解决方案',
    seo_keywords: 'ERP,外贸ERP,跨境电商,数字化转型,PDM,SRM,CRM,OMS',
    contact_phone: '400-026-2606',
    contact_email: 'info@jiufire.com',
    company_address: '',
    icp_number: '',
    logo_url: '',
    favicon_url: '',
    primary_color: '#194fe8',
    secondary_color: '#1640c7',
    maintenance_mode: false,
    registration_enabled: true,
    email_notifications: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [showCode, setShowCode] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const tabs = [
    { id: 'basic', name: '基本设置', icon: Globe },
    { id: 'service', name: '客服设置', icon: MessageCircle },
    { id: 'analytics', name: '统计代码', icon: Code },
    { id: 'seo', name: 'SEO设置', icon: Monitor },
    { id: 'appearance', name: '外观设置', icon: Palette },
    { id: 'system', name: '系统设置', icon: Shield }
  ];

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!db.isAuthenticated()) {
        throw new Error('用户未登录：请先登录管理员账号');
      }

      const token = db.getAuthToken();
      const response = await fetch('/api/system-config', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setConfig({ ...config, ...data });
        }
      } else if (response.status === 404) {
        // 配置不存在，使用默认配置
        console.log('使用默认配置');
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('获取系统配置失败:', error);
      setError(error instanceof Error ? error.message : '获取配置失败');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (!db.isAuthenticated()) {
        throw new Error('用户未登录：请先登录管理员账号');
      }

      const token = db.getAuthToken();
      const response = await fetch('/api/system-config', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error(`保存失败: HTTP ${response.status}`);
      }

      const savedConfig = await response.json();
      setConfig(savedConfig);
      setSuccess('配置保存成功！');
      
      // 3秒后清除成功消息
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('保存配置失败:', error);
      setError(error instanceof Error ? error.message : '保存配置失败');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof SystemConfig, value: string | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const toggleShowCode = (field: string) => {
    setShowCode(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(prev => ({ ...prev, [field]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [field]: false })), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const generateCode = (type: 'customer_service' | 'baidu' | 'google') => {
    if (type === 'customer_service') {
      return `<script>
var hmt = hmt || [];
(function() {
var hm = document.createElement("script");
hm.src = "${config.customer_service_code}";
var s = document.getElementsByTagName("script")[0];
s.parentNode.insertBefore(hm, s);
})();
</script>`;
    } else if (type === 'baidu') {
      return `<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "${config.baidu_analytics_code}";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>`;
    } else if (type === 'google') {
      return `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${config.google_analytics_code}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${config.google_analytics_code}');
</script>`;
    }
    return '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#194fe8] border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">加载系统配置...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">系统配置管理</h1>
          <p className="text-gray-600 mt-1">管理网站的基本设置、客服代码、统计代码等配置</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchConfig}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>刷新</span>
          </button>
          <button
            onClick={saveConfig}
            disabled={saving}
            className="flex items-center space-x-2 bg-[#194fe8] hover:bg-[#1640c7] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className={`w-4 h-4 ${saving ? 'animate-pulse' : ''}`} />
            <span>{saving ? '保存中...' : '保存配置'}</span>
          </button>
        </div>
      </div>

      {/* 消息提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}

      {/* 标签页导航 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#194fe8] text-[#194fe8]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* 基本设置 */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">基本设置</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    网站名称
                  </label>
                  <input
                    type="text"
                    value={config.site_name}
                    onChange={(e) => handleInputChange('site_name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                    placeholder="输入网站名称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    网站域名
                  </label>
                  <input
                    type="text"
                    value={config.site_url}
                    onChange={(e) => handleInputChange('site_url', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                    placeholder="输入网站域名"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    联系电话
                  </label>
                  <input
                    type="text"
                    value={config.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                    placeholder="输入联系电话"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    联系邮箱
                  </label>
                  <input
                    type="email"
                    value={config.contact_email}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                    placeholder="输入联系邮箱"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公司地址
                </label>
                <textarea
                  rows={3}
                  value={config.company_address}
                  onChange={(e) => handleInputChange('company_address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                  placeholder="输入公司地址"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ICP备案号
                </label>
                <input
                  type="text"
                  value={config.icp_number}
                  onChange={(e) => handleInputChange('icp_number', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                  placeholder="输入ICP备案号"
                />
              </div>
            </div>
          )}

          {/* 客服设置 */}
          {activeTab === 'service' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">客服设置</h3>
              <p className="text-gray-600">配置网站的客服代码，用于集成在线客服系统</p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  客服代码URL
                </label>
                <input
                  type="text"
                  value={config.customer_service_code}
                  onChange={(e) => handleInputChange('customer_service_code', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                  placeholder="输入客服JavaScript文件的URL地址"
                />
                <p className="mt-2 text-sm text-gray-500">
                  例如: https://hm.baidu.com/hm.js?f69e0d9cc3442149befbde0cfd1de791
                </p>
              </div>

              {config.customer_service_code && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      生成的客服代码
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleShowCode('customer_service')}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        {showCode.customer_service ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span>{showCode.customer_service ? '隐藏' : '显示'}</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(generateCode('customer_service'), 'customer_service')}
                        className="flex items-center space-x-1 text-sm text-[#194fe8] hover:text-[#1640c7]"
                      >
                        {copied.customer_service ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copied.customer_service ? '已复制' : '复制代码'}</span>
                      </button>
                    </div>
                  </div>
                  
                  {showCode.customer_service && (
                    <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm overflow-x-auto">
                      <code>{generateCode('customer_service')}</code>
                    </pre>
                  )}
                  
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">使用说明:</h4>
                    <ol className="text-sm text-blue-800 space-y-1">
                      <li>1. 将生成的代码复制到您的网站HTML页面中</li>
                      <li>2. 建议将代码放在 &lt;/head&gt; 标签之前</li>
                      <li>3. 保存并发布页面即可生效</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 统计代码 */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">统计代码设置</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  百度统计代码
                </label>
                <input
                  type="text"
                  value={config.baidu_analytics_code}
                  onChange={(e) => handleInputChange('baidu_analytics_code', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                  placeholder="输入百度统计的JavaScript文件URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={config.google_analytics_code}
                  onChange={(e) => handleInputChange('google_analytics_code', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                  placeholder="例如: GA_MEASUREMENT_ID"
                />
              </div>
            </div>
          )}

          {/* SEO设置 */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">SEO设置</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  网站标题
                </label>
                <input
                  type="text"
                  value={config.seo_title}
                  onChange={(e) => handleInputChange('seo_title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                  placeholder="输入网站SEO标题"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  网站描述
                </label>
                <textarea
                  rows={3}
                  value={config.seo_description}
                  onChange={(e) => handleInputChange('seo_description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                  placeholder="输入网站SEO描述"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  关键词
                </label>
                <input
                  type="text"
                  value={config.seo_keywords}
                  onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                  placeholder="输入网站关键词，用逗号分隔"
                />
              </div>
            </div>
          )}

          {/* 外观设置 */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">外观设置</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    主要颜色
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="color"
                      value={config.primary_color}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={config.primary_color}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                      placeholder="#194fe8"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    次要颜色
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="color"
                      value={config.secondary_color}
                      onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={config.secondary_color}
                      onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                      placeholder="#1640c7"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  网站Logo URL
                </label>
                <input
                  type="text"
                  value={config.logo_url}
                  onChange={(e) => handleInputChange('logo_url', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                  placeholder="输入Logo图片URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  网站图标 URL
                </label>
                <input
                  type="text"
                  value={config.favicon_url}
                  onChange={(e) => handleInputChange('favicon_url', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                  placeholder="输入网站图标URL"
                />
              </div>
            </div>
          )}

          {/* 系统设置 */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">系统设置</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">维护模式</h4>
                    <p className="text-sm text-gray-600">开启后网站将显示维护页面</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.maintenance_mode}
                      onChange={(e) => handleInputChange('maintenance_mode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#194fe8]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">用户注册</h4>
                    <p className="text-sm text-gray-600">允许新用户注册账号</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.registration_enabled}
                      onChange={(e) => handleInputChange('registration_enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#194fe8]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">邮件通知</h4>
                    <p className="text-sm text-gray-600">系统发送邮件通知</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.email_notifications}
                      onChange={(e) => handleInputChange('email_notifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#194fe8]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemConfigManagement; 