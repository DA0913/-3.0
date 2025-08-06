import React, { useState } from 'react';
import { X, Building, User, Phone, MessageSquare, CheckCircle } from 'lucide-react';

interface PartnershipFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  companyName: string;
  userName: string;
  contactPhone: string;
  joinReason: string;
}

interface FormErrors {
  companyName?: string;
  userName?: string;
  contactPhone?: string;
  joinReason?: string;
}

const PartnershipForm: React.FC<PartnershipFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    userName: '',
    contactPhone: '',
    joinReason: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = '请输入公司名称';
    }

    if (!formData.userName.trim()) {
      newErrors.userName = '请输入姓名';
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = '请输入联系方式';
    } else if (!/^1[3-9]\d{9}$/.test(formData.contactPhone.replace(/\s+/g, ''))) {
      newErrors.contactPhone = '请输入正确的手机号码';
    }

    if (!formData.joinReason.trim()) {
      newErrors.joinReason = '请说明加盟理由';
    } else if (formData.joinReason.trim().length < 10) {
      newErrors.joinReason = '加盟理由至少需要10个字符';
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

    try {
      // 提交表单数据到后端
      const response = await fetch('/api/partnership-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          status: 'pending'
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
          setIsSubmitted(false);
          setFormData({
            companyName: '',
            userName: '',
            contactPhone: '',
            joinReason: ''
          });
        }, 2000);
      } else {
        throw new Error('提交失败');
      }
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除该字段的错误信息
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          // 成功提交页面
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">提交成功！</h2>
            <p className="text-gray-600 mb-4">
              感谢您的渠道合作申请，我们将在2个工作日内联系您
            </p>
            <div className="text-sm text-gray-500">
              页面将自动关闭...
            </div>
          </div>
        ) : (
          <>
            {/* 表单头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">渠道合作</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 表单内容 */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  加入久火ERP渠道合作计划，共享业务增长机会
                </p>
              </div>

              {/* 公司名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-1" />
                  公司名称 *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent transition-colors ${
                    errors.companyName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="请输入您的公司名称"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                )}
              </div>

              {/* 姓名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  姓名 *
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent transition-colors ${
                    errors.userName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="请输入您的姓名"
                />
                {errors.userName && (
                  <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
                )}
              </div>

              {/* 联系方式 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  联系方式 *
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent transition-colors ${
                    errors.contactPhone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="请输入您的手机号码"
                />
                {errors.contactPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                )}
              </div>

              {/* 加盟理由 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  加盟理由 *
                </label>
                <textarea
                  rows={4}
                  maxLength={200}
                  value={formData.joinReason}
                  onChange={(e) => handleInputChange('joinReason', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent transition-colors resize-none ${
                    errors.joinReason ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="请简要说明您的加盟理由、公司背景或合作意向..."
                />
                {errors.joinReason && (
                  <p className="mt-1 text-sm text-red-600">{errors.joinReason}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.joinReason.length}/200 字符
                </p>
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#194fe8] hover:bg-[#1640c7] shadow-lg hover:shadow-xl'
                } text-white`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    提交中...
                  </span>
                ) : (
                  '提交申请'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                提交申请后，我们的商务团队将在2个工作日内与您联系
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PartnershipForm; 