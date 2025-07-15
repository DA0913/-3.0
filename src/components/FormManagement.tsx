import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Filter, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Building,
  User,
  Phone,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Check,
  X,
  Plus,
  Minus,
  Wifi,
  WifiOff
} from 'lucide-react';
import { db, FormSubmission } from '../lib/database';
import * as XLSX from 'xlsx';

const FormManagement: React.FC = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedSubmissionForStatus, setSelectedSubmissionForStatus] = useState<FormSubmission | null>(null);
  const [newStatus, setNewStatus] = useState<FormSubmission['status']>('pending');
  const [statusReason, setStatusReason] = useState('');

  const statusOptions = [
    { 
      value: 'all', 
      label: '全部状态', 
      color: 'bg-gray-100 text-gray-700',
      icon: Filter,
      description: '显示所有状态的记录'
    },
    { 
      value: 'pending', 
      label: '待处理', 
      color: 'bg-yellow-100 text-yellow-700',
      icon: Clock,
      description: '新提交的表单，等待处理'
    },
    { 
      value: 'processing', 
      label: '处理中', 
      color: 'bg-blue-100 text-blue-700',
      icon: RefreshCw,
      description: '正在跟进处理的表单'
    },
    { 
      value: 'completed', 
      label: '已完成', 
      color: 'bg-green-100 text-green-700',
      icon: CheckCircle,
      description: '已完成处理的表单'
    },
    { 
      value: 'invalid', 
      label: '无效数据', 
      color: 'bg-red-100 text-red-700',
      icon: XCircle,
      description: '无效或垃圾信息'
    }
  ];

  const companyTypeLabels: Record<string, string> = {
    factory: '工厂',
    trader: '贸易商',
    integrated: '工贸一体'
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm, statusFilter, dateFilter]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication
      if (!db.isAuthenticated()) {
        throw new Error('用户未登录：请先登录管理员账号');
      }

      // Fetch form submissions
      const response = await db.getFormSubmissions();
      
      if (response.error) {
        throw new Error(`数据库查询失败: ${response.error.message}`);
      }

      console.log('成功获取数据:', response.data?.length || 0, '条记录');
      setSubmissions(response.data || []);
    } catch (error) {
      console.error('获取数据失败:', error);
      
      let errorMessage = '获取数据失败';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setError(errorMessage);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = [...submissions];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(item => new Date(item.created_at) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(item => new Date(item.created_at) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(item => new Date(item.created_at) >= filterDate);
          break;
      }
    }

    setFilteredSubmissions(filtered);
  };

  const updateSubmissionStatus = async (id: string, status: FormSubmission['status'], reason?: string) => {
    try {
      const updateData: any = { 
        status, 
        updated_at: new Date().toISOString() 
      };

      if (reason) {
        const currentSubmission = submissions.find(s => s.id === id);
        const existingNotes = currentSubmission?.notes || '';
        const statusChangeNote = `[${new Date().toLocaleString('zh-CN')}] 状态变更为"${statusOptions.find(opt => opt.value === status)?.label}"：${reason}`;
        updateData.notes = existingNotes ? `${existingNotes}\n\n${statusChangeNote}` : statusChangeNote;
      }

      const response = await db.updateFormSubmission(id, updateData);

      if (response.error) throw new Error(response.error.message);
      
      setSubmissions(prev => 
        prev.map(item => 
          item.id === id ? { ...item, ...updateData } : item
        )
      );

      setShowStatusModal(false);
      setSelectedSubmissionForStatus(null);
      setStatusReason('');
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  const updateSubmissionNotes = async (id: string, notes: string) => {
    try {
      const response = await db.updateFormSubmission(id, { notes });

      if (response.error) throw new Error(response.error.message);
      
      setSubmissions(prev => 
        prev.map(item => 
          item.id === id ? { ...item, notes, updated_at: new Date().toISOString() } : item
        )
      );
      
      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission({ ...selectedSubmission, notes });
      }
    } catch (error) {
      console.error('更新备注失败:', error);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('确定要删除这条记录吗？此操作不可恢复。')) {
      return;
    }

    try {
      const response = await db.deleteFormSubmission(id);

      if (response.error) throw new Error(response.error.message);
      
      setSubmissions(prev => prev.filter(item => item.id !== id));
      setShowDetailModal(false);
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const exportToExcel = () => {
    const exportData = filteredSubmissions.map(item => ({
      '公司名称': item.company_name,
      '用户姓名': item.user_name,
      '联系电话': item.phone,
      '公司类型': item.company_types.map(type => companyTypeLabels[type]).join(', '),
      '来源页面': item.source_url,
      '状态': statusOptions.find(opt => opt.value === item.status)?.label || item.status,
      '备注': item.notes || '',
      '提交时间': new Date(item.created_at).toLocaleString('zh-CN'),
      '更新时间': new Date(item.updated_at).toLocaleString('zh-CN')
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '表单提交记录');
    
    const fileName = `表单提交记录_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const getStatusIcon = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    if (statusOption && statusOption.icon) {
      const IconComponent = statusOption.icon;
      return <IconComponent className="w-4 h-4" />;
    }
    return <AlertCircle className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.color || 'bg-gray-100 text-gray-700';
  };

  const openStatusModal = (submission: FormSubmission) => {
    setSelectedSubmissionForStatus(submission);
    setNewStatus(submission.status);
    setStatusReason('');
    setShowStatusModal(true);
  };

  const handleStatusConfirm = () => {
    if (selectedSubmissionForStatus) {
      updateSubmissionStatus(selectedSubmissionForStatus.id, newStatus, statusReason);
    }
  };

  const retryFetch = () => {
    fetchSubmissions();
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

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">连接失败</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="space-y-3">
            <button
              onClick={retryFetch}
              className="w-full bg-[#194fe8] hover:bg-[#1640c7] text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>重试连接</span>
            </button>
            
            <div className="text-sm text-gray-500 space-y-2">
              <p><strong>故障排除建议：</strong></p>
              <ul className="text-left space-y-1">
                <li>• 检查网络连接是否正常</li>
                <li>• 确认API服务器状态 ({import.meta.env.VITE_API_BASE_URL})</li>
                <li>• 验证环境变量配置</li>
                <li>• 检查管理员账号权限</li>
                <li>• 查看浏览器控制台获取详细错误信息</li>
              </ul>
            </div>
          </div>
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
              <p className="text-sm text-gray-600">总提交数</p>
              <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">待处理</p>
              <p className="text-2xl font-bold text-yellow-600">
                {submissions.filter(s => s.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">处理中</p>
              <p className="text-2xl font-bold text-blue-600">
                {submissions.filter(s => s.status === 'processing').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">已完成</p>
              <p className="text-2xl font-bold text-green-600">
                {submissions.filter(s => s.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 过滤和搜索 */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索公司名称、姓名或电话..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
            >
              <option value="all">全部时间</option>
              <option value="today">今天</option>
              <option value="week">最近7天</option>
              <option value="month">最近30天</option>
            </select>
          </div>

          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 bg-[#194fe8] hover:bg-[#1640c7] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>导出Excel</span>
          </button>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  公司信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  联系方式
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  公司类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  提交时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <Building className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {submission.company_name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {submission.user_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-1 text-gray-400" />
                      {submission.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {submission.company_types.map((type, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                        >
                          {companyTypeLabels[type]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => openStatusModal(submission)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${getStatusColor(submission.status)}`}
                    >
                      {getStatusIcon(submission.status)}
                      <span className="ml-1">
                        {statusOptions.find(opt => opt.value === submission.status)?.label}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(submission.created_at).toLocaleString('zh-CN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setNotes(submission.notes || '');
                          setShowDetailModal(true);
                        }}
                        className="text-[#194fe8] hover:text-[#1640c7] transition-colors"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSubmission(submission.id)}
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

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">暂无数据</p>
          </div>
        )}
      </div>

      {/* 状态选择模态框 */}
      {showStatusModal && selectedSubmissionForStatus && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowStatusModal(false)} />
            
            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">处理状态管理</h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">处理记录</h4>
                  <div className="text-sm text-gray-600">
                    <p><strong>公司：</strong>{selectedSubmissionForStatus.company_name}</p>
                    <p><strong>联系人：</strong>{selectedSubmissionForStatus.user_name}</p>
                    <p><strong>当前状态：</strong>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedSubmissionForStatus.status)}`}>
                        {statusOptions.find(opt => opt.value === selectedSubmissionForStatus.status)?.label}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    选择新的处理状态
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {statusOptions.slice(1).map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setNewStatus(option.value as FormSubmission['status'])}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          newStatus === option.value
                            ? 'border-[#194fe8] bg-[#194fe8]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <option.icon className={`w-5 h-5 ${
                            newStatus === option.value ? 'text-[#194fe8]' : 'text-gray-400'
                          }`} />
                          <span className={`font-medium ${
                            newStatus === option.value ? 'text-[#194fe8]' : 'text-gray-900'
                          }`}>
                            {option.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    处理说明 (可选)
                  </label>
                  <textarea
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                    rows={3}
                    placeholder="请输入状态变更的原因或说明..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleStatusConfirm}
                  className="px-6 py-2 bg-[#194fe8] hover:bg-[#1640c7] text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>确认更新</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 详情模态框 */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailModal(false)} />
            
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">提交详情</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">公司名称</label>
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedSubmission.company_name}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">用户姓名</label>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedSubmission.user_name}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">联系电话</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedSubmission.phone}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">公司类型</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubmission.company_types.map((type, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                        >
                          {companyTypeLabels[type]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">来源页面</label>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <a 
                        href={selectedSubmission.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#194fe8] hover:text-[#1640c7] break-all"
                      >
                        {selectedSubmission.source_url}
                      </a>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">提交时间</label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {new Date(selectedSubmission.created_at).toLocaleString('zh-CN')}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">更新时间</label>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {new Date(selectedSubmission.updated_at).toLocaleString('zh-CN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">处理状态</label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.slice(1).map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateSubmissionStatus(selectedSubmission.id, option.value as FormSubmission['status'])}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedSubmission.status === option.value
                            ? option.color
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">处理备注</label>
                    <button
                      onClick={() => setEditingNotes(!editingNotes)}
                      className="text-[#194fe8] hover:text-[#1640c7] text-sm"
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      {editingNotes ? '取消编辑' : '编辑备注'}
                    </button>
                  </div>
                  
                  {editingNotes ? (
                    <div className="space-y-3">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                        rows={4}
                        placeholder="请输入处理备注..."
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            updateSubmissionNotes(selectedSubmission.id, notes);
                            setEditingNotes(false);
                          }}
                          className="bg-[#194fe8] hover:bg-[#1640c7] text-white px-4 py-2 rounded-lg text-sm"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => {
                            setNotes(selectedSubmission.notes || '');
                            setEditingNotes(false);
                          }}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3 min-h-[100px]">
                      {selectedSubmission.notes ? (
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.notes}</p>
                      ) : (
                        <p className="text-gray-500 italic">暂无备注</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => deleteSubmission(selectedSubmission.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>删除记录</span>
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormManagement;