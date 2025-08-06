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
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Check,
  X,
  Users
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { db } from '../lib/database';

interface PartnershipApplication {
  id: string;
  company_name: string;
  user_name: string;
  contact_phone: string;
  join_reason: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

const PartnershipApplicationsManagement: React.FC = () => {
  const [applications, setApplications] = useState<PartnershipApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<PartnershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<PartnershipApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApplicationForStatus, setSelectedApplicationForStatus] = useState<PartnershipApplication | null>(null);
  const [newStatus, setNewStatus] = useState<PartnershipApplication['status']>('pending');

  const statusOptions = [
    { 
      value: 'all', 
      label: '全部状态', 
      color: 'bg-gray-100 text-gray-700',
      icon: RefreshCw
    },
    { 
      value: 'pending', 
      label: '待处理', 
      color: 'bg-yellow-100 text-yellow-700',
      icon: Clock
    },
    { 
      value: 'processing', 
      label: '处理中', 
      color: 'bg-blue-100 text-blue-700',
      icon: AlertCircle
    },
    { 
      value: 'approved', 
      label: '已通过', 
      color: 'bg-green-100 text-green-700',
      icon: CheckCircle
    },
    { 
      value: 'rejected', 
      label: '已拒绝', 
      color: 'bg-red-100 text-red-700',
      icon: XCircle
    }
  ];

  const dateOptions = [
    { value: 'all', label: '全部时间' },
    { value: 'today', label: '今天' },
    { value: 'week', label: '本周' },
    { value: 'month', label: '本月' },
    { value: 'quarter', label: '本季度' }
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter, dateFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!db.isAuthenticated()) {
        throw new Error('用户未登录：请先登录管理员账号');
      }

      const token = db.getAuthToken();
      const response = await fetch('/api/partnership-applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('获取渠道合作申请失败:', error);
      setError(error instanceof Error ? error.message : '获取数据失败');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // 搜索过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.company_name.toLowerCase().includes(term) ||
        app.user_name.toLowerCase().includes(term) ||
        app.contact_phone.includes(term) ||
        app.join_reason.toLowerCase().includes(term)
      );
    }

    // 状态过滤
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // 日期过滤
    if (dateFilter && dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter(app => 
        new Date(app.created_at) >= filterDate
      );
    }

    // 按创建时间降序排序
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setFilteredApplications(filtered);
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: PartnershipApplication['status']) => {
    try {
      if (!db.isAuthenticated()) {
        throw new Error('用户未登录：请先登录管理员账号');
      }

      const token = db.getAuthToken();
      const response = await fetch(`/api/partnership-applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('更新状态失败');
      }

      // 重新获取数据
      await fetchApplications();
      setShowStatusModal(false);
      setSelectedApplicationForStatus(null);
    } catch (error) {
      console.error('更新状态失败:', error);
      setError(error instanceof Error ? error.message : '更新状态失败');
    }
  };

  const exportToExcel = () => {
    const exportData = filteredApplications.map(app => ({
      '申请ID': app.id,
      '公司名称': app.company_name,
      '联系人': app.user_name,
      '联系电话': app.contact_phone,
      '加盟理由': app.join_reason,
      '状态': statusOptions.find(opt => opt.value === app.status)?.label || app.status,
      '提交时间': new Date(app.submitted_at).toLocaleString('zh-CN'),
      '创建时间': new Date(app.created_at).toLocaleString('zh-CN'),
      '更新时间': new Date(app.updated_at).toLocaleString('zh-CN')
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '渠道合作申请');
    
    const fileName = `渠道合作申请_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: PartnershipApplication['status']) => {
    const option = statusOptions.find(opt => opt.value === status);
    if (!option) return null;

    const Icon = option.icon;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {option.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#194fe8] border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">加载渠道合作申请...</span>
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
              <p className="text-sm text-gray-600">总申请数</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">待处理</p>
              <p className="text-2xl font-bold text-yellow-600">
                {applications.filter(app => app.status === 'pending').length}
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
              <p className="text-sm text-gray-600">已通过</p>
              <p className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === 'approved').length}
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
              <p className="text-sm text-gray-600">已拒绝</p>
              <p className="text-2xl font-bold text-red-600">
                {applications.filter(app => app.status === 'rejected').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
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
                placeholder="搜索公司名称、联系人或电话..."
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
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={fetchApplications}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>刷新</span>
            </button>
            
            <button
              onClick={exportToExcel}
              className="flex items-center space-x-2 bg-[#194fe8] hover:bg-[#1640c7] text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>导出Excel</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* 申请列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            渠道合作申请列表 ({filteredApplications.length})
          </h3>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无渠道合作申请</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    申请信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    联系方式
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    提交时间
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.company_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.user_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{application.contact_phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.submitted_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowDetailModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApplicationForStatus(application);
                            setNewStatus(application.status);
                            setShowStatusModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="更新状态"
                        >
                          <Edit className="w-4 h-4" />
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

      {/* 详情模态框 */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">渠道合作申请详情</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedApplication(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="w-4 h-4 inline mr-1" />
                    公司名称
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedApplication.company_name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    联系人姓名
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedApplication.user_name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    联系电话
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedApplication.contact_phone}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    申请状态
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  加盟理由
                </label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {selectedApplication.join_reason}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    提交时间
                  </label>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {formatDate(selectedApplication.submitted_at)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最后更新
                  </label>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {formatDate(selectedApplication.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedApplicationForStatus(selectedApplication);
                  setNewStatus(selectedApplication.status);
                  setShowStatusModal(true);
                  setShowDetailModal(false);
                }}
                className="bg-[#194fe8] hover:bg-[#1640c7] text-white px-4 py-2 rounded-lg transition-colors"
              >
                更新状态
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedApplication(null);
                }}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 状态更新模态框 */}
      {showStatusModal && selectedApplicationForStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md mx-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">更新申请状态</h2>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedApplicationForStatus(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">申请公司</p>
                <p className="font-medium text-gray-900">{selectedApplicationForStatus.company_name}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  选择新状态
                </label>
                <div className="space-y-2">
                  {statusOptions.filter(opt => opt.value !== 'all').map(option => {
                    const Icon = option.icon;
                    return (
                      <label key={option.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={newStatus === option.value}
                          onChange={(e) => setNewStatus(e.target.value as PartnershipApplication['status'])}
                          className="sr-only"
                        />
                        <div className={`flex items-center w-full p-3 rounded-lg border-2 transition-colors ${
                          newStatus === option.value 
                            ? 'border-[#194fe8] bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <Icon className={`w-5 h-5 mr-3 ${
                            newStatus === option.value ? 'text-[#194fe8]' : 'text-gray-400'
                          }`} />
                          <span className={`font-medium ${
                            newStatus === option.value ? 'text-[#194fe8]' : 'text-gray-700'
                          }`}>
                            {option.label}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedApplicationForStatus(null);
                  }}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedApplicationForStatus.id, newStatus)}
                  className="bg-[#194fe8] hover:bg-[#1640c7] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  确认更新
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnershipApplicationsManagement; 