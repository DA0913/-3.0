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
  Layers,
  ArrowRight,
  FileText,
  Workflow
} from 'lucide-react';
import { db } from '../lib/database';

interface ButtonFormMapping {
  id: string;
  button_id: string;
  button_name: string;
  module_name: string;
  form_id: string;
  form_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface FormConfig {
  id: string;
  name: string;
  description: string;
  module_name: string;
  form_url: string;
}

interface ButtonConfig {
  id: string;
  name: string;
  description: string;
  module_name: string;
  button_type: string;
}

const ButtonFormManager: React.FC = () => {
  const [mappings, setMappings] = useState<ButtonFormMapping[]>([]);
  const [filteredMappings, setFilteredMappings] = useState<ButtonFormMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingMapping, setEditingMapping] = useState<ButtonFormMapping | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // 表单和按钮配置数据
  const [formConfigs, setFormConfigs] = useState<FormConfig[]>([]);
  const [buttonConfigs, setButtonConfigs] = useState<ButtonConfig[]>([]);

  // 表单数据
  const [formData, setFormData] = useState({
    button_id: '',
    form_id: '',
    is_active: true
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterMappings();
  }, [mappings, searchTerm, moduleFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 注意：由于这是一个演示组件，我们仍然使用模拟数据
      // 在实际项目中，您需要创建相应的API端点来管理按钮-表单映射
      
      // 模拟数据，实际项目中需要创建对应的数据库表和API端点
      const mockMappings: ButtonFormMapping[] = [
        {
          id: '1',
          button_id: 'btn-1',
          button_name: '免费试用按钮',
          module_name: 'hero',
          form_id: 'form-1',
          form_name: '首页咨询表单',
          is_active: true,
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          button_id: 'btn-2',
          button_name: '联系我们按钮',
          module_name: 'contact',
          form_id: 'form-2',
          form_name: '联系页表单',
          is_active: true,
          created_at: '2024-01-20T00:00:00Z',
          updated_at: '2024-01-20T00:00:00Z'
        },
        {
          id: '3',
          button_id: 'btn-3',
          button_name: '获取方案按钮',
          module_name: 'solutions',
          form_id: 'form-3',
          form_name: '解决方案咨询表单',
          is_active: true,
          created_at: '2024-01-25T00:00:00Z',
          updated_at: '2024-01-25T00:00:00Z'
        }
      ];
      
      // 模拟表单配置
      const mockFormConfigs: FormConfig[] = [
        {
          id: 'form-1',
          name: '首页咨询表单',
          description: '首页Hero区域的主要咨询表单',
          module_name: 'hero',
          form_url: '/api/forms/hero-consultation'
        },
        {
          id: 'form-2',
          name: '联系页表单',
          description: '联系我们页面的表单',
          module_name: 'contact',
          form_url: '/api/forms/contact-form'
        },
        {
          id: 'form-3',
          name: '解决方案咨询表单',
          description: '解决方案页面的咨询表单',
          module_name: 'solutions',
          form_url: '/api/forms/solutions-form'
        },
        {
          id: 'form-4',
          name: '产品试用表单',
          description: '产品页面的试用申请表单',
          module_name: 'product',
          form_url: '/api/forms/product-trial'
        }
      ];
      
      // 模拟按钮配置
      const mockButtonConfigs: ButtonConfig[] = [
        {
          id: 'btn-1',
          name: '免费试用按钮',
          description: 'Hero区域的主要CTA按钮',
          module_name: 'hero',
          button_type: 'primary'
        },
        {
          id: 'btn-2',
          name: '联系我们按钮',
          description: '联系页面的提交按钮',
          module_name: 'contact',
          button_type: 'primary'
        },
        {
          id: 'btn-3',
          name: '获取方案按钮',
          description: '解决方案页面的咨询按钮',
          module_name: 'solutions',
          button_type: 'primary'
        },
        {
          id: 'btn-4',
          name: '了解更多按钮',
          description: '产品页面的次要按钮',
          module_name: 'product',
          button_type: 'secondary'
        },
        {
          id: 'btn-5',
          name: '预约演示按钮',
          description: '产品页面的主要按钮',
          module_name: 'product',
          button_type: 'primary'
        }
      ];

      setMappings(mockMappings);
      setFormConfigs(mockFormConfigs);
      setButtonConfigs(mockButtonConfigs);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMappings = () => {
    let filtered = [...mappings];

    if (searchTerm) {
      filtered = filtered.filter((mapping: ButtonFormMapping) =>
        mapping.button_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mapping.form_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (moduleFilter !== 'all') {
      filtered = filtered.filter((mapping: ButtonFormMapping) => mapping.module_name === moduleFilter);
    }

    setFilteredMappings(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.button_id || !formData.form_id) {
      setSubmitError('请选择按钮和表单');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // 这里应该调用实际的API
      const selectedButton = buttonConfigs.find((btn: ButtonConfig) => btn.id === formData.button_id);
      const selectedForm = formConfigs.find((form: FormConfig) => form.id === formData.form_id);
      
      if (!selectedButton || !selectedForm) {
        throw new Error('选择的按钮或表单不存在');
      }
      
      const newMapping: ButtonFormMapping = {
        id: editingMapping?.id || Date.now().toString(),
        button_id: formData.button_id,
        button_name: selectedButton.name,
        module_name: selectedButton.module_name,
        form_id: formData.form_id,
        form_name: selectedForm.name,
        is_active: formData.is_active,
        created_at: editingMapping?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingMapping) {
        setMappings((prev: ButtonFormMapping[]) => prev.map((mapping: ButtonFormMapping) => 
          mapping.id === editingMapping.id ? newMapping : mapping
        ));
      } else {
        setMappings((prev: ButtonFormMapping[]) => [...prev, newMapping]);
      }

      resetForm();
    } catch (error) {
      console.error('保存映射失败:', error);
      setSubmitError('保存失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (mapping: ButtonFormMapping) => {
    setEditingMapping(mapping);
    setFormData({
      button_id: mapping.button_id,
      form_id: mapping.form_id,
      is_active: mapping.is_active
    });
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个映射吗？')) return;

    try {
      setMappings((prev: ButtonFormMapping[]) => prev.filter((mapping: ButtonFormMapping) => mapping.id !== id));
    } catch (error) {
      console.error('删除映射失败:', error);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      setMappings((prev: ButtonFormMapping[]) => prev.map((mapping: ButtonFormMapping) => 
        mapping.id === id ? { ...mapping, is_active: !currentStatus } : mapping
      ));
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      button_id: '',
      form_id: '',
      is_active: true
    });
    setEditingMapping(null);
    setShowEditor(false);
    setSubmitError(null);
  };

  const copyFormUrl = (mapping: ButtonFormMapping) => {
    const form = formConfigs.find((f: FormConfig) => f.id === mapping.form_id);
    if (form) {
      navigator.clipboard.writeText(form.form_url);
      // 这里可以添加复制成功的提示
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getButtonConfigById = (id: string) => {
    return buttonConfigs.find((btn: ButtonConfig) => btn.id === id);
  };

  const getFormConfigById = (id: string) => {
    return formConfigs.find((form: FormConfig) => form.id === id);
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
        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[140px]">
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-sm text-gray-600 mb-2">总映射数</p>
              <p className="text-3xl font-bold text-gray-900">{mappings.length}</p>
              <p className="text-xs text-gray-500 mt-2">已配置映射关系</p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-sm flex items-center justify-center">
              <Workflow className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[140px]">
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-sm text-gray-600 mb-2">激活映射</p>
              <p className="text-3xl font-bold text-green-600">
                {mappings.filter((m: ButtonFormMapping) => m.is_active).length}
              </p>
              <p className="text-xs text-gray-500 mt-2">正在运行中</p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-sm flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[140px]">
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-sm text-gray-600 mb-2">可用按钮</p>
              <p className="text-3xl font-bold text-purple-600">
                {buttonConfigs.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">待配置按钮</p>
            </div>
            <div className="w-16 h-16 bg-purple-100 rounded-sm flex items-center justify-center">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[140px]">
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-sm text-gray-600 mb-2">可用表单</p>
              <p className="text-3xl font-bold text-orange-600">
                {formConfigs.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">表单模板数</p>
            </div>
            <div className="w-16 h-16 bg-orange-100 rounded-sm flex items-center justify-center">
              <Link className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 数据图表概览 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[300px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">模块分布统计</h3>
            <div className="text-sm text-gray-500">最近30天</div>
          </div>
          <div className="space-y-4">
            {availableModules.map((module, index) => {
              const count = mappings.filter(m => m.module_name === module.value).length;
              const percentage = mappings.length > 0 ? (count / mappings.length) * 100 : 0;
              return (
                <div key={module.value} className="flex items-center justify-between p-4 bg-gray-50 rounded-sm">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index % 4 === 0 ? 'bg-blue-500' :
                      index % 4 === 1 ? 'bg-green-500' :
                      index % 4 === 2 ? 'bg-purple-500' : 'bg-orange-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">{module.label}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-sm h-2">
                      <div 
                        className={`h-2 rounded-sm ${
                          index % 4 === 0 ? 'bg-blue-500' :
                          index % 4 === 1 ? 'bg-green-500' :
                          index % 4 === 2 ? 'bg-purple-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[300px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">映射状态分析</h3>
            <div className="text-sm text-gray-500">实时数据</div>
          </div>
          <div className="space-y-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-full h-full rounded-full border-8 border-gray-200"></div>
                <div 
                  className="absolute top-0 left-0 w-full h-full rounded-full border-8 border-green-500 transform rotate-45"
                  style={{
                    borderTopColor: 'transparent',
                    borderRightColor: 'transparent',
                    transform: `rotate(${(mappings.filter(m => m.is_active).length / Math.max(mappings.length, 1)) * 360}deg)`
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {mappings.length > 0 ? Math.round((mappings.filter(m => m.is_active).length / mappings.length) * 100) : 0}%
                    </div>
                    <div className="text-xs text-gray-500">激活率</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-sm border border-green-200">
                <div className="text-lg font-bold text-green-600">
                  {mappings.filter(m => m.is_active).length}
                </div>
                <div className="text-xs text-green-700">激活映射</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-sm border border-gray-200">
                <div className="text-lg font-bold text-gray-600">
                  {mappings.filter(m => !m.is_active).length}
                </div>
                <div className="text-xs text-gray-700">停用映射</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作栏 */}
      <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-200 min-h-[120px]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4 h-full">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索按钮或表单名称..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
              />
            </div>

            <select
              value={moduleFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setModuleFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#194fe8] focus:border-transparent min-w-[140px]"
            >
              <option value="all">全部模块</option>
              {availableModules.map(module => (
                <option key={module.value} value={module.value}>{module.label}</option>
              ))}
            </select>
            
            <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-sm transition-colors">
              <Filter className="w-5 h-5" />
              <span>高级筛选</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-sm border border-gray-300 transition-colors">
              <Settings className="w-5 h-5" />
              <span>配置管理</span>
            </button>
          <button
            onClick={() => setShowEditor(true)}
              className="flex items-center space-x-2 bg-[#194fe8] hover:bg-[#1640c7] text-white px-6 py-3 rounded-sm transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>新建映射</span>
          </button>
          </div>
        </div>
      </div>

      {/* 映射列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  按钮信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  表单信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  模块
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
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
              {filteredMappings.map((mapping: ButtonFormMapping) => (
                <tr key={mapping.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {mapping.button_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {mapping.button_id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {mapping.form_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {mapping.form_id}
                        </div>
                      </div>
                      <button
                        onClick={() => copyFormUrl(mapping)}
                        className="text-gray-400 hover:text-gray-600"
                        title="复制表单URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {availableModules.find(m => m.value === mapping.module_name)?.label || mapping.module_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(mapping.id, mapping.is_active)}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        mapping.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {mapping.is_active ? '激活' : '停用'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(mapping.updated_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(mapping)}
                        className="text-[#194fe8] hover:text-[#1640c7] transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(mapping.id)}
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

        {filteredMappings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Workflow className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">暂无按钮-表单映射</p>
          </div>
        )}
      </div>

      {/* 映射编辑器 */}
      {showEditor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={resetForm} />
            
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingMapping ? '编辑按钮-表单映射' : '新建按钮-表单映射'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* 按钮选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择按钮 *
                  </label>
                  <select
                    value={formData.button_id}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, button_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                  >
                    <option value="">请选择按钮</option>
                    {buttonConfigs.map((button: ButtonConfig) => (
                      <option key={button.id} value={button.id}>
                        {button.name} ({availableModules.find(m => m.value === button.module_name)?.label})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 表单选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择表单 *
                  </label>
                  <select
                    value={formData.form_id}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, form_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                  >
                    <option value="">请选择表单</option>
                    {formConfigs.map((form: FormConfig) => (
                      <option key={form.id} value={form.id}>
                        {form.name} ({availableModules.find(m => m.value === form.module_name)?.label})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 预览区域 */}
                {formData.button_id && formData.form_id && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">映射预览</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getButtonConfigById(formData.button_id)?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getButtonConfigById(formData.button_id)?.description}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center my-2">
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Link className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getFormConfigById(formData.form_id)?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getFormConfigById(formData.form_id)?.description}
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            {getFormConfigById(formData.form_id)?.form_url}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 状态设置 */}
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 text-[#194fe8] border-gray-300 rounded focus:ring-[#194fe8]"
                    />
                    <span className="text-sm font-medium text-gray-700">激活此映射</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-7">
                    激活后，点击按钮将加载对应的表单
                  </p>
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
                        <span>{editingMapping ? '更新映射' : '创建映射'}</span>
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

export default ButtonFormManager;