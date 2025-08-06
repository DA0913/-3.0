import React, { useState, useEffect } from 'react';
import { db } from '../lib/database';
import { X, Check, ChevronRight, Phone, Globe, Building, User } from 'lucide-react';

interface ErpInfoFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ErpInfoForm: React.FC<ErpInfoFormProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    identity: '',
    city: '',
    services: [] as string[],
    companyName: '',
    contactName: '',
    phoneNumber: '',
    companyType: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const identityOptions = [
    { value: '外贸企业主', label: '外贸企业主' },
    { value: '运营经理', label: '运营经理' },
    { value: '财务负责人', label: '财务负责人' },
    { value: '采购主管', label: '采购主管' },
    { value: '仓储物流总监', label: '仓储物流总监' }
  ];

  const serviceOptions = [
    { value: 'PDM', label: '产品管理' },
    { value: 'SRM', label: '供应链管理' },
    { value: 'OMS', label: '订单管理' },
    { value: 'CRM', label: '客户管理' },
    { value: 'TMS', label: '物流管理' },
    { value: 'WMS', label: '仓储管理' },
    { value: 'FMS', label: '财务管理' },
    { value: 'BDA', label: '数据分析' },
    { value: 'HCM', label: '人力资源' }
  ];

  const companyTypeOptions = [
    { value: 'factory', label: '工厂' },
    { value: 'trader', label: '贸易商' },
    { value: 'integrated', label: '工贸一体' }
  ];

  const cityOptions = [
    '北京',
    '上海',
    '广州',
    '深圳',
    '杭州',
    '南京',
    '成都',
    '重庆',
    '西安',
    '武汉'
  ];

  // 重置表单函数
  const resetForm = () => {
    setStep(1);
    setFormData({
      identity: '',
      city: '',
      services: [],
      companyName: '',
      contactName: '',
      phoneNumber: '',
      companyType: ''
    });
    setErrors({});
    setSubmitSuccess(false);
  };

  // 确保每次打开表单时都重置状态，保持一致性
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);
  
  // 同步到管理后台的函数
  const syncToAdmin = async (formData: any) => {
    try {
      // 提交到form_submissions表
      const response = await db.createFormSubmission({
            company_name: formData.companyName,
            user_name: formData.contactName,
            phone: formData.phoneNumber,
            company_types: [formData.companyType], // 将公司类型作为数组提交
            source_url: window.location.href,
        submitted_at: new Date().toISOString(),
            status: 'pending',
            notes: `身份: ${formData.identity}\n城市: ${formData.city}\n服务: ${formData.services.join(', ')}`
      });

      if (response.error) throw new Error(response.error.message);
      const data = response.data;
      console.log('数据已同步到管理后台:', data);
      return true;
    } catch (error) {
      console.error('同步到管理后台失败:', error);
      return false;
    }
  };

  const handleIdentityChange = (identity: string) => {
    setFormData(prev => ({
      ...prev,
      identity
    }));
    if (errors.identity) {
      setErrors(prev => ({ ...prev, identity: '' }));
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      city: e.target.value
    }));
    if (errors.city) {
      setErrors(prev => ({ ...prev, city: '' }));
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => {
      const services = [...prev.services];
      if (services.includes(service)) {
        return {
          ...prev,
          services: services.filter(s => s !== service)
        };
      } else {
        return {
          ...prev,
          services: [...services, service]
        };
      }
    });
    if (errors.services) {
      setErrors(prev => ({ ...prev, services: '' }));
    }
  };

  const handleCompanyTypeChange = (companyType: string) => {
    setFormData(prev => ({
      ...prev,
      companyType
    }));
    if (errors.companyType) {
      setErrors(prev => ({ ...prev, companyType: '' }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.identity) {
      newErrors.identity = '请选择您的身份';
    }

    if (!formData.city) {
      newErrors.city = '请选择您所在的城市';
    }

    if (formData.services.length === 0) {
      newErrors.services = '请至少选择一项服务';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = '请输入公司名称';
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = '请输入联系人名称';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = '请输入手机号码';
    } else if (!/^1\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = '请输入正确的手机号码格式';
    }

    if (!formData.companyType) {
      newErrors.companyType = '请选择公司类型';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // 同步到管理后台
      const syncResult = await syncToAdmin(formData);
      
      if (!syncResult) {
        throw new Error('同步到管理后台失败');
      }
      
      setSubmitSuccess(true);
      
      // 3秒后关闭模态框
      setTimeout(() => {
        onClose();
        resetForm();
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      
      setErrors({ submit: (error instanceof Error ? error.message : '提交失败，请稍后重试') });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* 模态框内容 */}
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-6xl mx-4 flex overflow-hidden animate-fadeIn">
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* 左侧表单区域 */}
          <div className="w-full lg:w-3/5 p-8 lg:p-12">
            {submitSuccess ? (
              <div className="text-left py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-scaleIn">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">提交成功！</h3>
                <p className="text-gray-600 mb-6">
                  感谢您完善信息，我们的专业顾问将尽快与您联系。
                </p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p className="font-medium mb-2">您提交的信息：</p>
                  <p>身份：{formData.identity}</p>
                  <p>城市：{formData.city}</p>
                  <p>服务：{formData.services.join(', ')}</p>
                  <p>公司：{formData.companyName}</p>
                  <p>联系人：{formData.contactName}</p>
                  <p>电话：{formData.phoneNumber}</p>
                  <p>公司类型：{companyTypeOptions.find(t => t.value === formData.companyType)?.label || formData.companyType}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8 text-left">
                  <h1 className="text-2xl font-bold text-[#194fe8] mb-2 animate-fadeInUp">欢迎资讯久火外贸ERP</h1>
                  <p className="text-2xl font-bold text-[#194fe8]">
                    请完善信息，获取专属解决方案
                  </p>
                </div>

                {step === 1 ? (
                  <div className="space-y-8 animate-fadeInUp" style={{animationDelay: "0.1s"}}>
                    {/* 身份选择 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3 text-left">
                        您的身份是
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {identityOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleIdentityChange(option.value)}
                            className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                              formData.identity === option.value
                                ? 'border-[#165DFF] bg-[#165DFF]/5 text-[#165DFF]'
                                : 'border-gray-300 text-gray-700 hover:border-[#165DFF]'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      {errors.identity && (
                        <p className="mt-2 text-sm text-red-600">{errors.identity}</p>
                      )}
                    </div>

                    {/* 城市选择 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3 text-left">
                        您所在的城市
                      </label>
                      <select
                        value={formData.city}
                        onChange={handleCityChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165DFF] focus:border-transparent"
                      >
                        <option value="">请选择城市</option>
                        {cityOptions.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {errors.city && (
                        <p className="mt-2 text-sm text-red-600">{errors.city}</p>
                      )}
                    </div>

                    {/* 服务选择 - 网格按钮样式 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3 text-left">
                        您需要下列哪些服务（可多选）
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {serviceOptions.map((service) => (
                          <button
                            key={service.value}
                            type="button"
                            onClick={() => handleServiceToggle(service.value)}
                            className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                              formData.services.includes(service.value)
                                ? 'border-[#165DFF] bg-[#165DFF]/5 text-[#165DFF]'
                                : 'border-gray-300 text-gray-700 hover:border-[#165DFF]'
                            }`}
                          >
                            {service.label}
                          </button>
                        ))}
                      </div>
                      {errors.services && (
                        <p className="mt-2 text-sm text-red-600">{errors.services}</p>
                      )}
                    </div>

                    {/* 下一步按钮 */}
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full bg-[#165DFF] hover:bg-[#0E42B3] text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                    >
                      <span>下一步</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8 animate-fadeInUp" style={{animationDelay: "0.1s"}}>
                    {/* 公司名称 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3 text-left">
                        公司名称
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="请输入您的公司名称"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165DFF] focus:border-transparent"
                        />
                      </div>
                      {errors.companyName && (
                        <p className="mt-2 text-sm text-red-600">{errors.companyName}</p>
                      )}
                    </div>

                    {/* 联系人名称 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3 text-left">
                        联系人名称
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleInputChange}
                          placeholder="请输入联系人名称"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165DFF] focus:border-transparent"
                        />
                      </div>
                      {errors.contactName && (
                        <p className="mt-2 text-sm text-red-600">{errors.contactName}</p>
                      )}
                    </div>

                    {/* 电话号码 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3 text-left">
                        电话号码
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="请输入手机号码"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165DFF] focus:border-transparent"
                        />
                      </div>
                      {errors.phoneNumber && (
                        <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
                      )}
                    </div>

                    {/* 公司类型 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3 text-left">
                        公司类型
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {companyTypeOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleCompanyTypeChange(option.value)}
                            className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                              formData.companyType === option.value
                                ? 'border-[#165DFF] bg-[#165DFF]/5 text-[#165DFF]'
                                : 'border-gray-300 text-gray-700 hover:border-[#165DFF]'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      {errors.companyType && (
                        <p className="mt-2 text-sm text-red-600">{errors.companyType}</p>
                      )}
                    </div>

                    {/* 提交按钮 */}
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
                      >
                        返回
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-2/3 bg-[#165DFF] hover:bg-[#0E42B3] text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            <span>提交中...</span>
                          </>
                        ) : (
                          <span>确认提交</span>
                        )}
                      </button>
                    </div>

                    {errors.submit && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{errors.submit}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* 右侧介绍区域 */}
          <div className="hidden lg:block w-2/5 bg-[#F5F8FF] p-12 relative overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-30 transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-100 rounded-full opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="space-y-8">
              <div>
                {/* 服务企业30000+文字 */}
                <div className="mt-4 mb-6 text-center">
                  <h3 className="text-2xl font-bold text-[#165DFF] mb-2">服务企业30000+</h3>
                  <p className="text-lg text-gray-700">覆盖外贸千行百业</p>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-[#165DFF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700 text-left">
                      覆盖30000+合作用户，2000+合作单位，20+知识产权保障
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-[#165DFF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700 text-left">
                      支持基础版、专业版、企业版、旗舰版四种版本，适配不同发展阶段需求
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-[#165DFF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700 text-left">
                      提供专业的实施团队，7*24小时技术支持，确保系统稳定运行
                    </span>
                  </li>
                </ul>
              </div>
              
              {/* 扫码添加专属顾问 */}
              <div className="mt-8">
                <h4 className="text-base font-semibold text-gray-900 mb-4 text-left">扫码添加专属顾问</h4>
                <div className="flex justify-center">
                  <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center border border-gray-200 p-2">
                    <img 
                      src="/WechatIMG3.jpg" 
                      alt="微信客服二维码" 
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg" style={{display: 'none'}}>
                      <span className="text-gray-500 text-xs text-left">二维码</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 联系方式 */}
              <div className="mt-8">
                <div className="flex items-center space-x-2 text-gray-700 mb-2">
                  <Phone className="w-4 h-4 text-[#165DFF]" />
                  <span className="text-left">全国服务热线：400-026-2606</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Globe className="w-4 h-4 text-[#165DFF]" />
                  <span className="text-left">官网：www.jiufire.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeInUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.8);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  .animate-fadeInUp {
    animation: fadeInUp 0.4s ease-out forwards;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default ErpInfoForm;