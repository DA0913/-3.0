import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { db } from '../lib/database';

interface InlineFormComponentProps {
  className?: string;
}

const InlineFormComponent: React.FC<InlineFormComponentProps> = ({ 
  className = "" 
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    userName: '',
    phone: '',
    companyTypes: [] as string[]
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const companyTypeOptions = [
    { value: 'trading', label: '贸易公司' },
    { value: 'manufacturing', label: '制造企业' },
    { value: 'service', label: '服务企业' },
    { value: 'retail', label: '零售企业' },
    { value: 'wholesale', label: '批发企业' },
    { value: 'ecommerce', label: '电商企业' },
    { value: 'logistics', label: '物流企业' },
    { value: 'other', label: '其他' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCompanyTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      companyTypes: prev.companyTypes.includes(type)
        ? prev.companyTypes.filter(t => t !== type)
        : [...prev.companyTypes, type]
    }));
    
    // 清除公司类型错误
    if (errors.companyTypes) {
      setErrors(prev => ({
        ...prev,
        companyTypes: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = '请输入公司名称';
    }

    if (!formData.userName.trim()) {
      newErrors.userName = '请输入您的姓名';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '请输入联系电话';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号码';
    }

    if (formData.companyTypes.length === 0) {
      newErrors.companyTypes = '请至少选择一种公司类型';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // 使用新的数据库客户端提交表单
      const response = await db.createFormSubmission({
        company_name: formData.companyName,
        user_name: formData.userName,
        phone: formData.phone,
        company_types: formData.companyTypes,
        source_url: window.location.href,
        submitted_at: new Date().toISOString(),
        status: 'pending'
      });

      if (response.error) {
        if (response.error.message?.includes('Network')) {
          console.warn('网络连接问题，但表单可能已提交');
        } else {
          throw new Error(response.error.message);
        }
      }

      console.log('表单提交成功:', response.data);
      
      setSubmitSuccess(true);
      
      // 3秒后重置表单
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          companyName: '',
          userName: '',
          phone: '',
          companyTypes: []
        });
      }, 3000);

    } catch (error: any) {
      console.error('提交表单时出错:', error);
      
      let errorMessage = '提交失败，请稍后重试';
      
      if (error.message) {
        if (error.message.includes('Network')) {
          errorMessage = '网络连接失败，请检查网络后重试';
        } else if (error.message.includes('Missing required fields')) {
          errorMessage = '请填写所有必填字段';
        } else if (error.message.includes('Database')) {
          errorMessage = '系统暂时不可用，请稍后重试';
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">提交成功！</h3>
            <p className="text-green-700">感谢您的信任，我们的专家将在24小时内与您联系</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          获取专业ERP解决方案
        </h3>
        <p className="text-gray-600">
          填写下方信息，我们的专家将为您提供定制化方案
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 公司名称和姓名并排 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              公司名称 *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent transition-colors ${
                errors.companyName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="请输入公司名称"
              disabled={isSubmitting}
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              联系人姓名 *
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent transition-colors ${
                errors.userName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="请输入您的姓名"
              disabled={isSubmitting}
            />
            {errors.userName && (
              <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
            )}
          </div>
        </div>

        {/* 联系电话 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            联系电话 *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent transition-colors ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="请输入手机号码"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* 公司类型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            公司类型 * (可多选)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {companyTypeOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-colors text-sm ${
                  formData.companyTypes.includes(option.value)
                    ? 'border-[#194fe8] bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.companyTypes.includes(option.value)}
                  onChange={() => handleCompanyTypeChange(option.value)}
                  className="w-4 h-4 text-[#194fe8] border-gray-300 rounded focus:ring-[#194fe8]"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.companyTypes && (
            <p className="mt-1 text-sm text-red-600">{errors.companyTypes}</p>
          )}
        </div>

        {/* 提交错误提示 */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {errors.submit}
            </p>
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#194fe8] hover:bg-[#1640c7] text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>提交中...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>立即获取方案</span>
            </>
          )}
        </button>

        {/* 隐私提示 */}
        <p className="text-xs text-gray-500 text-center">
          提交即表示您同意我们的隐私政策，我们将严格保护您的信息安全
        </p>
      </form>
    </div>
  );
};

export default InlineFormComponent;