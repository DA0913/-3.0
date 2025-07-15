import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Link,
  Save,
  X,
  Settings,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Code,
  Globe,
  Layers
} from 'lucide-react';
import { db } from '../lib/database';

interface VariantForm {
  id: string;
  name: string;
  description: string;
  module_name: string;
  form_url: string;
  form_config: any;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const VariantFormManagement: React.FC = () => {
  const [forms, setForms] = useState<VariantForm[]>([]);
  const [filteredForms, setFilteredForms] = useState<VariantForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingForm, setEditingForm] = useState<VariantForm | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    module_name: '',
    form_url: '',
    form_config: {
      fields: [],
      styling: {
        theme: 'default',
        primaryColor: '#194fe8',
        borderRadius: '8px'
      },
      behavior: {
        showProgress: true,
        autoSave: false,
        redirectAfterSubmit: ''
      }
    },
    is_active: true,
    sort_order: 0
  });

  // 可用模块列表
  const availableModules = [
    { value: 'hero', label: 'Hero 区域' },
    { value: 'product', label: '产品介绍' },
    { value: 'solutions', label: '解决方案' },
    { value: 'services', label: '服务支持' },
    { value: 'cases', label: '客户案例' },
    { value: 'contact', label: '联系我们' },
    { value: 'footer', label: '页脚区域' },
    { value: 'sidebar', label: '侧边栏' },
    { value: 'modal', label: '弹窗表单' },
    { value: 'inline', label: '内联表单' }
  ];

  // 表单字段类型
  const fieldTypes = [
    { value: 'text', label: '文本输入' },
    { value: 'email', label: '邮箱' },
    { value: 'tel', label: '电话' },
    { value: 'textarea', label: '多行文本' },
    { value: 'select', label: '下拉选择' },
    { value: 'checkbox', label: '复选框' },
    { value: 'radio', label: '单选框' },
    { value: 'file', label: '文件上传' },
    { value: 'date', label: '日期' },
    { value: 'number', label: '数字' }
  ];

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    filterForms();
  }, [forms, searchTerm, moduleFilter]);

  const fetchForms = async () => {
    try {
      // 模拟数据，实际项目中需要创建对应的数据库表
      const mockData: VariantForm[] = [
        {
          id: '1',
          name: '首页咨询表单',
          description: '首页Hero区域的主要咨询表单',
          module_name: 'hero',
          form_url: '/api/forms/hero-consultation',
          form_config: {
            fields: [
              { name: 'company_name', label: '公司名称', type: 'text', required: true },
              { name: 'contact_name', label: '联系人', type: 'text', required: true },
              { name: 'phone', label: '联系电话', type: 'tel', required: true },
              { name: 'email', label: '邮箱', type: 'email', required: false }
            ],
            styling: { theme: 'primary', primaryColor: '#194fe8' },
            behavior: { showProgress: true, autoSave: true }
          },
          is_active: true,
          sort_order: 1,
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: '产品试用表单',
          description: '产品页面的试用申请表单',
          module_name: 'product',
          form_url: '/api/forms/product-trial',
          form_config: {
            fields: [
              { name: 'company_name', label: '公司名称', type: 'text', required: true },
              { name: 'industry', label: '所属行业', type: 'select', required: true, options: ['制造业', '贸易', '服务业'] },
              { name: 'company_size', label: '公司规模', type: 'radio', required: true, options: ['1-50人', '51-200人', '200+人'] },
              { name: 'requirements', label: '具体需求', type: 'textarea', required: false }
            ],
            styling: { theme: 'secondary', primaryColor: '#10b981' },
            behavior: { showProgress: false, redirectAfterSubmit: '/thank-you' }
          },
          is_active: true,
          sort_order: 2,
          created_at: '2024-01-20T00:00:00Z',
          updated_at: '2024-01-20T00:00:00Z'
        }
      ];

      setForms(mockData);
    } catch (error) {
      console.error('获取表单配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterForms = () => {
    let filtered = [...forms];

    if (searchTerm) {
      filtered = filtered.filter(form =>
        form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (moduleFilter !== 'all') {
      filtered = filtered.filter(form => form.module_name === moduleFilter);
    }

    setFilteredForms(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.module_name || !formData.form_url.trim()) {
      setSubmitError('请填写必填字段');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // 这里应该调用实际的API
      const newForm: VariantForm = {
        id: editingForm?.id || Date.now().toString(),
        ...formData,
        created_at: editingForm?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingForm) {
        setForms(prev => prev.map(form => 
          form.id === editingForm.id ? newForm : form
        ));
      } else {
        setForms(prev => [...prev, newForm]);
      }

      resetForm();
    } catch (error) {
      console.error('保存表单配置失败:', error);
      setSubmitError('保存失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (form: VariantForm) => {
    setEditingForm(form);
    setFormData({
      name: form.name,
      description: form.description,
      module_name: form.module_name,
      form_url: form.form_url,
      form_config: form.form_config,
      is_active: form.is_active,
      sort_order: form.sort_order
    });
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个表单配置吗？')) return;

    try {
      setForms(prev => prev.filter(form => form.id !== id));
    } catch (error) {
      console.error('删除表单配置失败:', error);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      setForms(prev => prev.map(form => 
        form.id === id ? { ...form, is_active: !currentStatus } : form
      ));
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      module_name: '',
      form_url: '',
      form_config: {
        fields: [],
        styling: {
          theme: 'default',
          primaryColor: '#194fe8',
          borderRadius: '8px'
        },
        behavior: {
          showProgress: true,
          autoSave: false,
          redirectAfterSubmit: ''
        }
      },
      is_active: true,
      sort_order: 0
    });
    setEditingForm(null);
    setShowEditor(false);
    setSubmitError(null);
  };

  const addFormField = () => {
    const newField = {
      name: '',
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: []
    };
    
    setFormData(prev => ({
      ...prev,
      form_config: {
        ...prev.form_config,
        fields: [...prev.form_config.fields, newField]
      }
    }));
  };

  const updateFormField = (index: number, field: any) => {
    setFormData(prev => ({
      ...prev,
      form_config: {
        ...prev.form_config,
        fields: prev.form_config.fields.map((f, i) => i === index ? field : f)
      }
    }));
  };

  const removeFormField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      form_config: {
        ...prev.form_config,
        fields: prev.form_config.fields.filter((_, i) => i !== index)
      }
    }));
  };

  const copyFormUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // 这里可以添加复制成功的提示
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#194fe8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总表单数</p>
              <p className="text-2xl font-bold text-gray-900">{forms.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">激活表单</p>
              <p className="text-2xl font-bold text-green-600">
                {forms.filter(f => f.is_active).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">覆盖模块</p>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(forms.map(f => f.module_name)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">API端点</p>
              <p className="text-2xl font-bold text-orange-600">
                {forms.filter(f => f.form_url).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Link className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 操作栏 */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索表单名称或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
              />
            </div>

            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
            >
              <option value="all">全部模块</option>
              {availableModules.map(module => (
                <option key={module.value} value={module.value}>{module.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowEditor(true)}
            className="flex items-center space-x-2 bg-[#194fe8] hover:bg-[#1640c7] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>新建表单</span>
          </button>
        </div>
      </div>

      {/* 表单列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  表单信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  模块
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  API端点
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  字段数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  更新时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredForms.map((form) => (
                <tr key={form.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {form.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {form.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {availableModules.find(m => m.value === form.module_name)?.label || form.module_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {form.form_url}
                      </code>
                      <button
                        onClick={() => copyFormUrl(form.form_url)}
                        className="text-gray-400 hover:text-gray-600"
                        title="复制URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(form.id, form.is_active)}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        form.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {form.is_active ? '激活' : '停用'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {form.form_config.fields.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(form.updated_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(form)}
                        className="text-[#194fe8] hover:text-[#1640c7] transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.open(form.form_url, '_blank')}
                        className="text-green-600 hover:text-green-700 transition-colors"
                        title="预览"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(form.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredForms.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">暂无表单配置</p>
          </div>
        )}
      </div>

      {/* 表单编辑器 */}
      {showEditor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={resetForm} />
            
            <div className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingForm ? '编辑表单配置' : '新建表单配置'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* 基本信息 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      表单名称 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                      placeholder="请输入表单名称"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      所属模块 *
                    </label>
                    <select
                      required
                      value={formData.module_name}
                      onChange={(e) => setFormData({ ...formData, module_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                    >
                      <option value="">请选择模块</option>
                      {availableModules.map(module => (
                        <option key={module.value} value={module.value}>{module.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      表单描述
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                      rows={3}
                      placeholder="请输入表单描述"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API端点 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.form_url}
                      onChange={(e) => setFormData({ ...formData, form_url: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                      placeholder="/api/forms/custom-form"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      排序顺序
                    </label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* 表单字段配置 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">表单字段配置</h4>
                    <button
                      type="button"
                      onClick={addFormField}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>添加字段</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.form_config.fields.map((field, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              字段名称
                            </label>
                            <input
                              type="text"
                              value={field.name}
                              onChange={(e) => updateFormField(index, { ...field, name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#194fe8] focus:border-transparent text-sm"
                              placeholder="field_name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              显示标签
                            </label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateFormField(index, { ...field, label: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#194fe8] focus:border-transparent text-sm"
                              placeholder="字段标签"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              字段类型
                            </label>
                            <select
                              value={field.type}
                              onChange={(e) => updateFormField(index, { ...field, type: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#194fe8] focus:border-transparent text-sm"
                            >
                              {fieldTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-end space-x-2">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => updateFormField(index, { ...field, required: e.target.checked })}
                                className="w-4 h-4 text-[#194fe8] border-gray-300 rounded focus:ring-[#194fe8]"
                              />
                              <span className="text-sm text-gray-700">必填</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => removeFormField(index)}
                              className="text-red-600 hover:text-red-700 p-2"
                              title="删除字段"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              选项配置（每行一个选项）
                            </label>
                            <textarea
                              value={field.options?.join('\n') || ''}
                              onChange={(e) => updateFormField(index, { 
                                ...field, 
                                options: e.target.value.split('\n').filter(opt => opt.trim()) 
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#194fe8] focus:border-transparent text-sm"
                              rows={3}
                              placeholder="选项1&#10;选项2&#10;选项3"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 样式配置 */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">样式配置</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        主题色
                      </label>
                      <input
                        type="color"
                        value={formData.form_config.styling.primaryColor}
                        onChange={(e) => setFormData({
                          ...formData,
                          form_config: {
                            ...formData.form_config,
                            styling: {
                              ...formData.form_config.styling,
                              primaryColor: e.target.value
                            }
                          }
                        })}
                        className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        圆角大小
                      </label>
                      <select
                        value={formData.form_config.styling.borderRadius}
                        onChange={(e) => setFormData({
                          ...formData,
                          form_config: {
                            ...formData.form_config,
                            styling: {
                              ...formData.form_config.styling,
                              borderRadius: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                      >
                        <option value="4px">小圆角</option>
                        <option value="8px">中圆角</option>
                        <option value="12px">大圆角</option>
                        <option value="16px">超大圆角</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        主题风格
                      </label>
                      <select
                        value={formData.form_config.styling.theme}
                        onChange={(e) => setFormData({
                          ...formData,
                          form_config: {
                            ...formData.form_config,
                            styling: {
                              ...formData.form_config.styling,
                              theme: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                      >
                        <option value="default">默认</option>
                        <option value="primary">主要</option>
                        <option value="secondary">次要</option>
                        <option value="minimal">简约</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 行为配置 */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">行为配置</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.form_config.behavior.showProgress}
                          onChange={(e) => setFormData({
                            ...formData,
                            form_config: {
                              ...formData.form_config,
                              behavior: {
                                ...formData.form_config.behavior,
                                showProgress: e.target.checked
                              }
                            }
                          })}
                          className="w-4 h-4 text-[#194fe8] border-gray-300 rounded focus:ring-[#194fe8]"
                        />
                        <span className="text-sm font-medium text-gray-700">显示进度条</span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.form_config.behavior.autoSave}
                          onChange={(e) => setFormData({
                            ...formData,
                            form_config: {
                              ...formData.form_config,
                              behavior: {
                                ...formData.form_config.behavior,
                                autoSave: e.target.checked
                              }
                            }
                          })}
                          className="w-4 h-4 text-[#194fe8] border-gray-300 rounded focus:ring-[#194fe8]"
                        />
                        <span className="text-sm font-medium text-gray-700">自动保存</span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                          className="w-4 h-4 text-[#194fe8] border-gray-300 rounded focus:ring-[#194fe8]"
                        />
                        <span className="text-sm font-medium text-gray-700">激活表单</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        提交后跳转页面
                      </label>
                      <input
                        type="text"
                        value={formData.form_config.behavior.redirectAfterSubmit}
                        onChange={(e) => setFormData({
                          ...formData,
                          form_config: {
                            ...formData.form_config,
                            behavior: {
                              ...formData.form_config.behavior,
                              redirectAfterSubmit: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                        placeholder="/thank-you"
                      />
                    </div>
                  </div>
                </div>

                {/* 错误提示 */}
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {submitError}
                    </p>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium disabled:opacity-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-[#194fe8] hover:bg-[#1640c7] text-white rounded-lg transition-colors flex items-center space-x-2 font-medium disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>保存中...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{editingForm ? '更新配置' : '创建配置'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantFormManagement;