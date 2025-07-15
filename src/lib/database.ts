// PostgreSQL Database Client for ERP System
// 替代原来的 Supabase 客户端

// 类型定义
export type FormSubmission = {
  id: string;
  company_name: string;
  user_name: string;
  phone: string;
  company_types: string[];
  source_url: string;
  submitted_at: string;
  status: 'pending' | 'processing' | 'completed' | 'invalid';
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  category: string;
  publish_time: string;
  image_url?: string;
  summary?: string;
  content?: string;
  views: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type CustomerCase = {
  id: string;
  company_name: string;
  company_logo: string;
  industry: string;
  description: string;
  results: string;
  metrics: Record<string, any>;
  is_featured: boolean;
  sort_order: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};

export type CaseConfiguration = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  company_name: string;
  company_logo: string;
  stock_code?: string;
  image_url?: string;
  link_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type FeaturedCase = {
  id: string;
  title: string;
  company_name: string;
  industry: string;
  description: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PartnerCase = {
  id: string;
  company_name: string;
  logo_url?: string;
  industry: string;
  description: string;
  results: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AdminUser = {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
};

// API 响应类型
export type ApiResponse<T> = {
  data: T | null;
  error: { message: string } | null;
  count?: number;
};

// 获取API基础URL
const getApiBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    console.warn('VITE_API_BASE_URL not configured, using default localhost:3000');
    return 'http://localhost:3000/api';
  }
  return baseUrl;
};

// API客户端类
class DatabaseClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = getApiBaseUrl();
    // 从localStorage获取认证令牌
    this.authToken = localStorage.getItem('auth_token');
  }

  // 设置认证令牌
  setAuthToken(token: string | null) {
    this.authToken = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // 获取认证令牌
  getAuthToken(): string | null {
    return this.authToken || localStorage.getItem('auth_token');
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const token = this.getAuthToken();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          data: null,
          error: { message: data.message || `HTTP Error: ${response.status}` }
        };
      }

      return {
        data: data.data || data,
        error: null,
        count: data.count
      };
    } catch (error) {
      console.error('Database request error:', error);
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  // GET 请求
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST 请求
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT 请求
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE 请求
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // 表单提交相关方法
  async getFormSubmissions(filters?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<FormSubmission[]>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.get<FormSubmission[]>(`/form-submissions${query}`);
  }

  async createFormSubmission(submission: Omit<FormSubmission, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<FormSubmission>> {
    return this.post<FormSubmission>('/form-submissions', submission);
  }

  async updateFormSubmission(id: string, updates: Partial<FormSubmission>): Promise<ApiResponse<FormSubmission>> {
    return this.put<FormSubmission>(`/form-submissions/${id}`, updates);
  }

  async deleteFormSubmission(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/form-submissions/${id}`);
  }

  // 新闻文章相关方法
  async getNewsArticles(filters?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<NewsArticle[]>> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.get<NewsArticle[]>(`/news-articles${query}`);
  }

  async getNewsArticle(id: string): Promise<ApiResponse<NewsArticle>> {
    return this.get<NewsArticle>(`/news-articles/${id}`);
  }

  async createNewsArticle(article: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<NewsArticle>> {
    return this.post<NewsArticle>('/news-articles', article);
  }

  async updateNewsArticle(id: string, updates: Partial<NewsArticle>): Promise<ApiResponse<NewsArticle>> {
    return this.put<NewsArticle>(`/news-articles/${id}`, updates);
  }

  async deleteNewsArticle(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/news-articles/${id}`);
  }

  // 客户案例相关方法
  async getCustomerCases(filters?: {
    status?: string;
    featured?: boolean;
    industry?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<CustomerCase[]>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters?.industry) params.append('industry', filters.industry);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.get<CustomerCase[]>(`/customer-cases${query}`);
  }

  async createCustomerCase(customerCase: Omit<CustomerCase, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<CustomerCase>> {
    return this.post<CustomerCase>('/customer-cases', customerCase);
  }

  async updateCustomerCase(id: string, updates: Partial<CustomerCase>): Promise<ApiResponse<CustomerCase>> {
    return this.put<CustomerCase>(`/customer-cases/${id}`, updates);
  }

  async deleteCustomerCase(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/customer-cases/${id}`);
  }

  // 认证相关方法
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: AdminUser }>> {
    const response = await this.post<{ token: string; user: AdminUser }>('/auth/login', {
      email,
      password
    });
    
    if (response.data?.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    this.setAuthToken(null);
  }

  async getCurrentUser(): Promise<ApiResponse<AdminUser>> {
    return this.get<AdminUser>('/auth/me');
  }

  // 检查是否已认证
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

// 创建全局数据库客户端实例
export const db = new DatabaseClient();

// 向后兼容的错误处理函数
export const handleDatabaseError = (error: any) => {
  console.warn('Database error:', error?.message || error);
  return { 
    data: null, 
    error: { 
      message: error?.message || 'Database operation failed' 
    } 
  };
};

// 检查数据库配置状态
export const isDatabaseConfigured = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  return !!apiUrl;
};

// 导出默认实例以保持向后兼容
export default db; 