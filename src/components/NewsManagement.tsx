import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Calendar,
  Tag,
  TrendingUp,
  Image as ImageIcon,
  Save,
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { db, NewsArticle } from '../lib/database';
import ImageUploader from './ImageUploader';
import RichTextEditor from './RichTextEditor';

const NewsManagement: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '公司新闻',
    summary: '',
    content: '',
    image_url: '',
    is_featured: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const categories = [
    '公司新闻',
    '新闻中心', 
    '行业动态',
    '政策解读',
    '市场分析',
    '操作指南'
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, categoryFilter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      
      // 使用新的数据库客户端获取新闻文章
      const response = await db.getNewsArticles({
        limit: 100,
        offset: 0
      });

      if (response.error) {
        console.error('获取文章失败:', response.error);
        // 如果是网络错误，使用默认数据
        if (response.error.message.includes('Network')) {
          console.log('网络连接问题，使用默认数据');
          setArticles([]);
        } else {
          throw new Error(response.error.message);
        }
      } else {
        setArticles(response.data || []);
      }
    } catch (error) {
      console.error('获取文章失败:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = [...articles];

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(article => article.category === categoryFilter);
    }

    setFilteredArticles(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    const errors = [];
    if (!formData.title.trim()) errors.push('请输入文章标题');
    if (!formData.content.trim()) errors.push('请输入文章内容');
    
    if (errors.length > 0) {
      setSubmitError(errors.join(', '));
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      if (editingArticle) {
        // 更新文章
          const response = await db.updateNewsArticle(editingArticle.id, {
            ...formData,
            updated_at: new Date().toISOString()
          });

          if (response.error) throw new Error(response.error.message);
      } else {
        // 创建新文章
          const response = await db.createNewsArticle({
            ...formData,
            publish_time: new Date().toISOString(),
            views: 0
          });

          if (response.error) throw new Error(response.error.message);
      }

      await fetchArticles();
      resetForm();
    } catch (error) {
      console.error('保存文章失败:', error); 
      setSubmitError('保存失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      category: article.category || '公司新闻',
      summary: article.summary || '',
      content: article.content || '',
      image_url: article.image_url || '',
      is_featured: article.is_featured
    });
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;

    try {
      const response = await db.deleteNewsArticle(id);

      if (response.error) throw new Error(response.error.message);
      await fetchArticles();
    } catch (error) {
      console.error('删除文章失败:', error);
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const response = await db.updateNewsArticle(id, { is_featured: !currentStatus });

      if (response.error) throw new Error(response.error.message);
      await fetchArticles();
    } catch (error) {
      console.error('更新精选状态失败:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '公司新闻', 
      summary: '',
      content: '',
      image_url: '',
      is_featured: false
    });
    setEditingArticle(null);
    setShowEditor(false);
    setSubmitError(null);
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
              <p className="text-sm text-gray-600">总文章数</p>
              <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-blue-600" /> 
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">精选文章</p> 
              <p className="text-2xl font-bold text-orange-600">
                {articles.filter(a => a.is_featured).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总阅读量</p> 
              <p className="text-2xl font-bold text-green-600">
                {articles.reduce((sum, article) => sum + article.views, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">本月发布</p> 
              <p className="text-2xl font-bold text-purple-600">
                {articles.filter(a => {
                  const articleDate = new Date(a.created_at);
                  const now = new Date();
                  return articleDate.getMonth() === now.getMonth() && 
                         articleDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div> 
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
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
                placeholder="搜索文章标题或摘要..."
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)} 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
            >
              <option value="all">全部分类</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowEditor(true)} 
            className="flex items-center space-x-2 bg-[#194fe8] hover:bg-[#1640c7] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>新建文章</span>
          </button>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"> 
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  文章信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分类
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  阅读量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  发布时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-start space-x-3">
                      {article.image_url ? (
                        <img
                          src={article.image_url} 
                          alt={article.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0"> 
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {article.title}
                        </p>
                        {article.summary && (
                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                            {article.summary}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"> 
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {article.is_featured && (
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full flex items-center space-x-1">
                          <Star className="w-3 h-3" /> 
                          <span>精选</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {article.views}
                  </td> 
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(article.publish_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="text-[#194fe8] hover:text-[#1640c7] transition-colors" 
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleFeatured(article.id, article.is_featured)}
                        className="text-orange-600 hover:text-orange-700 transition-colors"
                        title={article.is_featured ? '取消精选' : '设为精选'} 
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
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

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-gray-400" /> 
            </div>
            <p className="text-gray-500">暂无文章</p>
          </div>
        )}
      </div>

      {/* 简洁的文章编辑器 */}
      {showEditor && ( 
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={resetForm} />
            
            <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
              {/* 编辑器头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3"> 
                  <div className="w-10 h-10 bg-[#194fe8] rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {editingArticle ? '编辑文章' : '新建文章'}
                    </h3>
                    <p className="text-sm text-gray-500"> 
                      创建优质内容，分享行业见解
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                > 
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* 基本信息 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2"> 
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      文章标题 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent text-lg"
                      placeholder="请输入吸引人的文章标题"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      文章分类 * 
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 封面图片 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3"> 
                    封面图片
                  </label>
                  <ImageUploader
                    value={formData.image_url}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                    placeholder="上传文章封面图片，建议尺寸 800x450"
                  />
                </div>

                {/* 文章摘要 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"> 
                    文章摘要
                  </label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                    rows={3}
                    placeholder="请输入文章摘要，简要描述文章内容（建议100-200字）"
                  />
                </div>

                {/* 文章内容 - 简洁版本 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"> 
                    文章内容 *
                  </label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="开始编写您的文章内容..."
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    💡 支持富文本编辑、图片上传、表格、代码块等功能
                  </p>
                </div>

                {/* 文章设置 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">文章设置</h4> 
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4 text-[#194fe8] border-gray-300 rounded focus:ring-[#194fe8]"
                    /> 
                    <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-orange-500" />
                        <span>设为精选文章（将在首页显示）</span>
                      </div>
                    </label>
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
                        <span>{editingArticle ? '更新文章' : '发布文章'}</span>
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

export default NewsManagement;