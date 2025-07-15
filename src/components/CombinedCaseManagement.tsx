import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Star,
  Building,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Download,
  RefreshCw,
  ImageIcon
} from 'lucide-react';
import { db } from '../lib/database';
import ImageUploader from './ImageUploader';

// 类型定义
interface CustomerCase {
  id: string;
  company_name: string;
  company_logo: string;
  industry: string;
  description: string;
  results: string;
  image_url?: string;
  metrics: any;
  is_featured: boolean;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
  case_title?: string;
  case_summary?: string;
  detail_url?: string;
  company_size?: string;
  highlight_tags?: string[];
  company_description?: string;
}

// 预定义的模拟数据
const MOCK_CUSTOMER_CASES: CustomerCase[] = [
  {
    id: '1',
    company_name: '比亚迪股份有限公司',
    company_logo: '比',
    industry: '新能源汽车',
    description: '比亚迪通过久火ERP系统优化了新能源汽车的生产和供应链管理流程。',
    results: '供应链协同效率提升50%，成本降低25%',
    image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    metrics: { efficiency: '50%', cost_reduction: '25%' },
    is_featured: true,
    sort_order: 1,
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    case_title: '上市企业「比亚迪」：用久火ERP加速新能源汽车数字化建设',
    case_summary: '比亚迪通过久火ERP系统，实现了供应链协同效率提升50%，成本降低25%，为新能源汽车行业的数字化转型树立了标杆。',
    company_size: '上市企业',
    company_description: '比亚迪股份有限公司是中国领先的新能源汽车制造商，专注于电动汽车、电池和新能源解决方案的研发和生产。',
    highlight_tags: ['数字化建设', '供应链优化', '新能源汽车'],
    detail_url: ''
  },
  {
    id: '2',
    company_name: '西安方盛软件有限公司',
    company_logo: '西',
    industry: '外贸出口',
    description: '通过使用我们的ERP系统，该公司的订单处理效率提升了60%，库存管理更加精准。',
    results: '订单处理效率提升60%，库存管理精准度提升40%',
    image_url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
    metrics: { order_efficiency: '60%', inventory_accuracy: '40%' },
    is_featured: true,
    sort_order: 2,
    status: 'active',
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z',
    case_title: '软件企业「西安方盛」：用久火ERP实现外贸出口业务全流程数字化',
    case_summary: '西安方盛软件通过久火ERP系统，订单处理效率提升60%，库存管理精准度提升40%，实现了外贸出口业务的全流程数字化。',
    company_size: '中小企业',
    company_description: '西安方盛软件有限公司是一家专业从事外贸出口软件开发和服务的企业，致力于为中小企业提供专业的外贸解决方案。',
    highlight_tags: ['外贸出口', '全流程数字化', '库存管理'],
    detail_url: ''
  },
  {
    id: '3',
    company_name: '北京科技有限公司',
    company_logo: '北',
    industry: '制造业',
    description: '专业从事高端制造设备的生产',
    results: '使用我们的ERP系统后，生产效率提升50%，订单管理更加规范化',
    image_url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    metrics: { production_efficiency: '50%' },
    is_featured: false,
    sort_order: 3,
    status: 'active',
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z',
    case_title: '制造企业「北京科技」：用久火ERP优化高端制造设备生产流程',
    case_summary: '北京科技有限公司通过久火ERP系统，生产效率提升50%，订单管理更加规范化，为高端制造设备行业提供了数字化转型的参考样本。',
    company_size: '中小企业',
    company_description: '北京科技有限公司是一家专业从事高端制造设备研发和生产的企业，拥有先进的制造技术和丰富的行业经验。',
    highlight_tags: ['高端制造', '生产优化', '订单管理'],
    detail_url: ''
  }
];

const CombinedCaseManagement: React.FC = () => {
  const [customerCases, setCustomerCases] = useState<CustomerCase[]>(MOCK_CUSTOMER_CASES);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomerCase | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 表单数据
  const [formData, setFormData] = useState({
    company_name: '',
    company_logo: '',
    industry: '',
    description: '',
    results: '',
    image_url: '',
    is_featured: false,
    sort_order: 0,
    status: 'active' as const,
    case_title: '',
    case_summary: '',
    detail_url: '',
    company_size: '',
    highlight_tags: [] as string[],
    company_description: ''
  });

  // 获取数据
  const fetchCustomerCases = useCallback(async () => {
    try {
      setLoading(true);
      const response = await db.getCustomerCases({ limit: 50 });
      
      if (response.data && response.data.length > 0) {
        setCustomerCases(response.data);
      }
    } catch (error) {
      console.warn('获取数据失败，使用默认数据:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 导入示例数据
  const importSampleData = async () => {
    try {
      setLoading(true);
      
      const existingResponse = await db.getCustomerCases({ limit: 50 });
      const existingData = existingResponse.data || [];
      const existingCompanyNames = existingData.map(c => c.company_name);
      const newSampleData = MOCK_CUSTOMER_CASES.filter(
        sample => !existingCompanyNames.includes(sample.company_name)
      );
      
      if (newSampleData.length === 0) {
        alert('示例数据已经存在，无需重复导入');
        return;
      }
      
      const importPromises = newSampleData.map(async (sampleCase) => {
        const { id, created_at, updated_at, ...caseData } = sampleCase;
        return db.createCustomerCase({
          ...caseData,
          status: caseData.status as 'active' | 'inactive'
        });
      });
      
      const results = await Promise.all(importPromises);
      const successCount = results.filter(r => !r.error).length;
      
      if (successCount > 0) {
        alert(`成功导入 ${successCount} 条示例数据`);
        await fetchCustomerCases();
      }
      
    } catch (error) {
      console.error('导入失败:', error);
      alert('导入失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 同步到前端展示页面
  const syncToFrontend = async () => {
    try {
      setLoading(true);
      
      // 获取所有激活的案例
      const response = await db.getCustomerCases({ limit: 50, status: 'active' });
      
      if (response.error || !response.data) {
        alert('同步失败：无法获取案例数据');
        return;
      }
      
      const activeCase = response.data;
      const featuredCases = activeCase.filter(c => c.is_featured);
      const regularCases = activeCase.filter(c => !c.is_featured);
      
      // 显示同步结果
      const syncInfo = `
同步完成！
• 总案例数: ${activeCase.length}
• 精选案例: ${featuredCases.length}
• 普通案例: ${regularCases.length}

精选案例将在前端首页展示，普通案例将在案例列表中展示。
请刷新前端页面查看效果。
      `;
      
      alert(syncInfo);
      
    } catch (error) {
      console.error('同步失败:', error);
      alert('同步失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerCases();
  }, [fetchCustomerCases]);

  // 筛选数据
  const filteredCustomerCases = useMemo(() => {
    if (!searchTerm) return customerCases;
    
    const searchLower = searchTerm.toLowerCase();
    return customerCases.filter(case_ =>
      case_.company_name?.toLowerCase().includes(searchLower) ||
      case_.industry?.toLowerCase().includes(searchLower) ||
      case_.description?.toLowerCase().includes(searchLower)
    );
  }, [customerCases, searchTerm]);

  // 重置表单
  const resetForm = () => {
    setFormData({
      company_name: '',
      company_logo: '',
      industry: '',
      description: '',
      results: '',
      image_url: '',
      is_featured: false,
      sort_order: 0,
      status: 'active',
      case_title: '',
      case_summary: '',
      detail_url: '',
      company_size: '',
      highlight_tags: [] as string[],
      company_description: ''
    });
    setEditingItem(null);
    setShowEditor(false);
    setSubmitError(null);
  };

  // 编辑案例
  const handleEdit = (case_: CustomerCase) => {
    setEditingItem(case_);
    setFormData({
      company_name: case_.company_name,
      company_logo: case_.company_logo,
      industry: case_.industry,
      description: case_.description,
      results: case_.results,
      image_url: case_.image_url || '',
      is_featured: case_.is_featured,
      sort_order: case_.sort_order,
      status: case_.status as 'active',
      case_title: case_.case_title || '',
      case_summary: case_.case_summary || '',
      detail_url: case_.detail_url || '',
      company_size: case_.company_size || '',
      highlight_tags: case_.highlight_tags || [],
      company_description: case_.company_description || ''
    });
    setShowEditor(true);
  };

  // 删除案例
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个案例吗？')) return;
    
    try {
      const response = await db.deleteCustomerCase(id);
      if (response.error) {
        console.error('删除失败:', response.error);
        return;
      }
      
      setCustomerCases(prev => prev.filter(case_ => case_.id !== id));
      alert('删除成功');
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请稍后重试');
    }
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name.trim() || !formData.industry.trim()) {
      setSubmitError('请填写必填字段');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      if (editingItem) {
        const response = await db.updateCustomerCase(editingItem.id, formData);
        if (response.error) {
          setSubmitError(response.error.message);
          return;
        }
        
        setCustomerCases(prev => 
          prev.map(case_ => 
            case_.id === editingItem.id 
              ? { ...case_, ...formData, updated_at: new Date().toISOString() }
              : case_
          )
        );
        alert('更新成功');
      } else {
        const response = await db.createCustomerCase({
          ...formData,
          metrics: {},
          sort_order: formData.sort_order || customerCases.length + 1
        });
        
        if (response.error) {
          setSubmitError(response.error.message);
          return;
        }
        
        if (response.data) {
          setCustomerCases(prev => [response.data as CustomerCase, ...prev]);
          alert('创建成功');
        }
      }
      
      resetForm();
      
    } catch (error) {
      console.error('提交失败:', error);
      setSubmitError('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 切换精选状态
  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await db.updateCustomerCase(id, { is_featured: !currentFeatured });
      if (response.error) {
        console.error('更新失败:', response.error);
        return;
      }
      
      setCustomerCases(prev =>
        prev.map(case_ =>
          case_.id === id 
            ? { ...case_, is_featured: !currentFeatured }
            : case_
        )
      );
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">客户案例管理</h1>
          <p className="text-gray-600 mt-1">管理和维护客户成功案例</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">共 {customerCases.length} 个案例</span>
          <span className="text-sm text-gray-500">·</span>
          <span className="text-sm text-gray-500">精选 {customerCases.filter(c => c.is_featured).length} 个</span>
        </div>
      </div>

      {/* 操作工具栏 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          {/* 搜索框 */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索公司名称或行业..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchCustomerCases}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>刷新</span>
            </button>

            <button
              onClick={importSampleData}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-2 text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>导入示例</span>
            </button>

            <button
              onClick={syncToFrontend}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-2 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>同步到前端</span>
            </button>

            <button
              onClick={() => setShowEditor(true)}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>新建案例</span>
            </button>
          </div>
        </div>
      </div>

      {/* 案例列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredCustomerCases.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? '没有找到匹配的案例' : '暂无案例数据'}
            </p>
            {!searchTerm && (
              <button
                onClick={importSampleData}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                导入示例数据
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    公司信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    图片
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    行业
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    描述
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomerCases.map((case_) => (
                  <tr key={case_.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-blue-600">
                            {case_.company_logo || case_.company_name.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {case_.company_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            排序: {case_.sort_order}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        {case_.image_url ? (
                          <img 
                            src={case_.image_url} 
                            alt={case_.company_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        {case_.industry}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {case_.description}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {case_.results}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          case_.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {case_.status === 'active' ? '激活' : '停用'}
                        </span>
                        {case_.is_featured && (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                            精选
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(case_)}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleFeatured(case_.id, case_.is_featured)}
                          className={`transition-colors ${
                            case_.is_featured 
                              ? 'text-yellow-600 hover:text-yellow-700' 
                              : 'text-gray-400 hover:text-yellow-600'
                          }`}
                          title={case_.is_featured ? '取消精选' : '设为精选'}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(case_.id)}
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
        )}
      </div>

      {/* 编辑器模态框 */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem ? '编辑案例' : '新建案例'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    公司名称 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入公司名称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    公司Logo
                  </label>
                  <input
                    type="text"
                    value={formData.company_logo}
                    onChange={(e) => setFormData({ ...formData, company_logo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="如：A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    行业 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入行业"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  描述 *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="请输入描述"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  成果 *
                </label>
                <textarea
                  required
                  value={formData.results}
                  onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="请输入成果"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  案例图片
                </label>
                <ImageUploader
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  placeholder="上传案例图片"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  案例标题
                </label>
                <input
                  type="text"
                  value={formData.case_title}
                  onChange={(e) => setFormData({ ...formData, case_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="如：上市企业「安克创新」：用领星ERP加速数字化建设"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  案例摘要
                </label>
                <textarea
                  value={formData.case_summary}
                  onChange={(e) => setFormData({ ...formData, case_summary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="简短的案例摘要，用于卡片展示"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公司规模
                </label>
                <input
                  type="text"
                  value={formData.company_size}
                  onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="如：上市企业、中小企业、独角兽企业"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公司介绍
                </label>
                <textarea
                  value={formData.company_description}
                  onChange={(e) => setFormData({ ...formData, company_description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="公司详细介绍"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  重点标签
                </label>
                <input
                  type="text"
                  value={formData.highlight_tags.join(', ')}
                  onChange={(e) => setFormData({ ...formData, highlight_tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '') })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="多个标签用逗号分隔，如：数字化建设, 供应链优化, 全球化扩张"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  详情链接
                </label>
                <input
                  type="url"
                  value={formData.detail_url}
                  onChange={(e) => setFormData({ ...formData, detail_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="案例详情页链接（可选）"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                  设为精选案例
                </label>
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
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 font-medium disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>保存中...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingItem ? '更新' : '创建'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CombinedCaseManagement;