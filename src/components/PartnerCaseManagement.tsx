import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Upload,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { db } from '../lib/database';
import ImageUploader from './ImageUploader';

interface PartnerCase {
  id: string;
  industry: string;
  company_name: string;
  logo_url: string;
  image_url: string;
  description: string;
  contact_name: string;
  contact_title: string;
  created_at: string;
  updated_at: string;
}

const PartnerCaseManagement = () => {
  const [cases, setCases] = useState<PartnerCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingCase, setEditingCase] = useState<PartnerCase | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 表单数据
  const [formData, setFormData] = useState({
    industry: '',
    company_name: '',
    logo_url: '',
    image_url: '',
    description: '',
    contact_name: '',
    contact_title: ''
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await db.getPartnerCases();
      if (response.data) {
        setCases(response.data);
      }
    } catch (error) {
      console.error('获取案例失败:', error);
      setError('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (case_: PartnerCase) => {
    setEditingCase(case_);
    setFormData({
      industry: case_.industry,
      company_name: case_.company_name,
      logo_url: case_.logo_url,
      image_url: case_.image_url,
      description: case_.description,
      contact_name: case_.contact_name,
      contact_title: case_.contact_title
    });
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这个案例吗？')) return;

    try {
      await db.deletePartnerCase(id);
      setCases(cases.filter(c => c.id !== id));
    } catch (error) {
      console.error('删除案例失败:', error);
      setError('删除失败');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCase) {
        await db.updatePartnerCase(editingCase.id, formData);
        setCases(cases.map(c => 
          c.id === editingCase.id ? { ...c, ...formData } : c
        ));
      } else {
        const response = await db.createPartnerCase(formData);
        if (response.data) {
          setCases([...cases, response.data]);
        }
      }
      setShowEditor(false);
      setEditingCase(null);
      setFormData({
        industry: '',
        company_name: '',
        logo_url: '',
        image_url: '',
        description: '',
        contact_name: '',
        contact_title: ''
      });
    } catch (error) {
      console.error('保存案例失败:', error);
      setError('保存失败');
    }
  };

  const filteredCases = cases.filter(case_ =>
    case_.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">合作伙伴案例管理</h2>
        <button
          onClick={() => setShowEditor(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          添加案例
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="搜索案例..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredCases.map((case_) => (
            <div
              key={case_.id}
              className="bg-white rounded-lg shadow p-6 flex items-start justify-between"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={case_.logo_url}
                  alt={case_.company_name}
                  className="w-16 h-16 object-contain rounded"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{case_.company_name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{case_.industry}</p>
                  <p className="text-gray-600">{case_.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(case_)}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(case_.id)}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCase ? '编辑案例' : '添加案例'}
              </h3>
              <button
                onClick={() => {
                  setShowEditor(false);
                  setEditingCase(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  行业
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公司名称
                </label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公司Logo
                </label>
                <ImageUploader
                  currentImage={formData.logo_url}
                  onImageUpload={(url) => setFormData({ ...formData, logo_url: url })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  案例图片
                </label>
                <ImageUploader
                  currentImage={formData.image_url}
                  onImageUpload={(url) => setFormData({ ...formData, image_url: url })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  案例描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  联系人姓名
                </label>
                <input
                  type="text"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  联系人职位
                </label>
                <input
                  type="text"
                  value={formData.contact_title}
                  onChange={(e) => setFormData({ ...formData, contact_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditor(false);
                    setEditingCase(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerCaseManagement; 