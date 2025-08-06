import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Users, 
  Globe, 
  Clock, 
  TrendingUp, 
  Monitor, 
  Smartphone, 
  Tablet,
  Chrome,
  RefreshCw,
  Download,
  Calendar,
  MapPin,
  BarChart3,
  PieChart
} from 'lucide-react';
import { db } from '../lib/database';

interface AnalyticsData {
  overview: {
    pageViews: number;
    uniqueVisitors: number;
    ipCount: number;
    visitTime: string;
    avgPageTime: string;
    avgUserTime: string;
    avgVisitTime: string;
    bounceRate: string;
  };
  trendData: Array<{
    date: string;
    pv: number;
    uv: number;
  }>;
  topPages: Array<{
    url: string;
    views: number;
  }>;
  geoData: Array<{
    region: string;
    views: number;
    percentage: number;
  }>;
  deviceData: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  browserData: Array<{
    browser: string;
    views: number;
    percentage: number;
  }>;
  referrerData: Array<{
    source: string;
    views: number;
  }>;
}

// 模拟数据 - 在实际项目中应该从后端API获取
const mockAnalyticsData: AnalyticsData = {
  overview: {
    pageViews: 192,
    uniqueVisitors: 125,
    ipCount: 101,
    visitTime: '131',
    avgPageTime: '1.47',
    avgUserTime: '1.54',
    avgVisitTime: '00:00:28',
    bounceRate: '84%'
  },
  trendData: [
    { date: '07-11', pv: 52, uv: 35 },
    { date: '07-12', pv: 42, uv: 28 },
    { date: '07-13', pv: 28, uv: 20 },
    { date: '07-14', pv: 65, uv: 45 },
    { date: '07-15', pv: 58, uv: 38 },
    { date: '07-16', pv: 85, uv: 62 },
    { date: '07-17', pv: 45, uv: 32 }
  ],
  topPages: [
    { url: 'https://www.jiufire.com/', views: 55 },
    { url: 'http://jiufire.com/', views: 45 },
    { url: 'https://www.jiufire.com/syc-rd-65.html', views: 10 },
    { url: 'https://www.jiufire.com/syc-rd-101.html', views: 7 },
    { url: 'https://www.jiufire.com/h-col-109.html', views: 6 },
    { url: 'https://www.jiufire.com/h-col-104.html', views: 6 },
    { url: 'https://www.jiufire.com/h-col-110.html', views: 5 },
    { url: 'https://jiufire.com/', views: 5 },
    { url: 'https://www.jiufire.com/h-col-102.html', views: 4 },
    { url: 'https://www.jiufire.com/h-col-119.html', views: 3 }
  ],
  geoData: [
    { region: '四川', views: 38, percentage: 32 },
    { region: '河南', views: 23, percentage: 19 },
    { region: '江苏', views: 19, percentage: 16 },
    { region: '广东', views: 11, percentage: 9 },
    { region: '黑龙江', views: 6, percentage: 5 },
    { region: '四川', views: 5, percentage: 4 },
    { region: '浙江', views: 5, percentage: 4 },
    { region: '陕西', views: 4, percentage: 3 },
    { region: '湖北', views: 4, percentage: 3 },
    { region: '山东', views: 4, percentage: 3 }
  ],
  deviceData: {
    desktop: 75,
    mobile: 20,
    tablet: 5
  },
  browserData: [
    { browser: 'Chrome', views: 120, percentage: 65 },
    { browser: 'Safari', views: 45, percentage: 24 },
    { browser: 'Firefox', views: 15, percentage: 8 },
    { browser: 'Edge', views: 6, percentage: 3 }
  ],
  referrerData: [
    { source: 'https://map.mm.cn/', views: 2 }
  ]
};

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedChart, setSelectedChart] = useState('trend');

  const timeRanges = [
    { value: '1d', label: '今日' },
    { value: '7d', label: '7天' },
    { value: '30d', label: '30天' },
    { value: '90d', label: '90天' }
  ];

  const fetchData = async () => {
    try {
      if (!db.isAuthenticated()) {
        console.error('User not authenticated');
        return;
      }

      const token = db.getAuthToken();
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const newData = await response.json();
        setData(newData);
      } else {
        console.error('Failed to fetch analytics data:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      await fetchData();
    } catch (error) {
      console.error('Failed to refresh analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  // 核心指标卡片
  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  // 趋势图表组件
  const TrendChart: React.FC = () => {
    const maxPV = Math.max(...data.trendData.map(d => d.pv));
    const maxUV = Math.max(...data.trendData.map(d => d.uv));
    const maxValue = Math.max(maxPV, maxUV);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">访问趋势</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">PV</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">UV</span>
            </div>
          </div>
        </div>
        
        <div className="h-64 relative">
          <svg width="100%" height="100%" viewBox="0 0 600 200">
            {/* 网格线 */}
            {[20, 40, 60, 80].map(y => (
              <line
                key={y}
                x1="40"
                y1={y * 2}
                x2="580"
                y2={y * 2}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            ))}
            
            {/* PV线 */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={data.trendData.map((d, i) => 
                `${40 + i * 80},${180 - (d.pv / maxValue) * 160}`
              ).join(' ')}
            />
            
            {/* UV线 */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              points={data.trendData.map((d, i) => 
                `${40 + i * 80},${180 - (d.uv / maxValue) * 160}`
              ).join(' ')}
            />
            
            {/* 数据点 */}
            {data.trendData.map((d, i) => (
              <g key={i}>
                <circle
                  cx={40 + i * 80}
                  cy={180 - (d.pv / maxValue) * 160}
                  r="3"
                  fill="#3b82f6"
                />
                <circle
                  cx={40 + i * 80}
                  cy={180 - (d.uv / maxValue) * 160}
                  r="3"
                  fill="#10b981"
                />
              </g>
            ))}
            
            {/* X轴标签 */}
            {data.trendData.map((d, i) => (
              <text
                key={i}
                x={40 + i * 80}
                y="195"
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {d.date}
              </text>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  // 饼图组件
  const PieChart: React.FC<{
    title: string;
    data: Array<{ label: string; value: number; color: string }>;
  }> = ({ title, data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const angle = (percentage / 100) * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                
                const startX = 100 + 70 * Math.cos((startAngle - 90) * Math.PI / 180);
                const startY = 100 + 70 * Math.sin((startAngle - 90) * Math.PI / 180);
                const endX = 100 + 70 * Math.cos((endAngle - 90) * Math.PI / 180);
                const endY = 100 + 70 * Math.sin((endAngle - 90) * Math.PI / 180);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                const pathData = [
                  `M 100 100`,
                  `L ${startX} ${startY}`,
                  `A 70 70 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                  `Z`
                ].join(' ');
                
                currentAngle += angle;
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={item.color}
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              })}
              <circle cx="100" cy="100" r="40" fill="white" />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600">总计</div>
                <div className="text-lg font-bold text-gray-900">{total}</div>
              </div>
            </div>
          </div>
          
          <div className="ml-8 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {item.label}: {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 列表组件
  const DataList: React.FC<{
    title: string;
    data: Array<{ label: string; value: number; extra?: string }>;
    showPercentage?: boolean;
  }> = ({ title, data, showPercentage = false }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-900 truncate">{item.label}</div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">{item.value}</span>
              {showPercentage && item.extra && (
                <span className="text-sm text-gray-500">{item.extra}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 页面标题和控制栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据统计</h1>
          <p className="text-gray-600 mt-1">网站访问数据统计分析</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>刷新</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span>导出</span>
          </button>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <StatCard
          title="访问量PV"
          value={data.overview.pageViews}
          icon={<Eye className="w-5 h-5" />}
          color="text-blue-600"
        />
        <StatCard
          title="独立访客UV"
          value={data.overview.uniqueVisitors}
          icon={<Users className="w-5 h-5" />}
          color="text-green-600"
        />
        <StatCard
          title="IP"
          value={data.overview.ipCount}
          icon={<Globe className="w-5 h-5" />}
          color="text-purple-600"
        />
        <StatCard
          title="访问次数VV"
          value={data.overview.visitTime}
          icon={<TrendingUp className="w-5 h-5" />}
          color="text-orange-600"
        />
        <StatCard
          title="平均页面停留时间"
          value={data.overview.avgPageTime}
          icon={<Clock className="w-5 h-5" />}
          color="text-red-600"
        />
        <StatCard
          title="人均浏览页面数"
          value={data.overview.avgUserTime}
          icon={<BarChart3 className="w-5 h-5" />}
          color="text-indigo-600"
        />
        <StatCard
          title="平均访问时长"
          value={data.overview.avgVisitTime}
          icon={<Clock className="w-5 h-5" />}
          color="text-pink-600"
        />
        <StatCard
          title="跳出率"
          value={data.overview.bounceRate}
          icon={<TrendingUp className="w-5 h-5" />}
          color="text-gray-600"
        />
      </div>

      {/* 趋势图表 */}
      <TrendChart />

      {/* 详细统计图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 新老访客 */}
        <PieChart
          title="新老访客"
          data={[
            { label: '新访客', value: 78, color: '#3b82f6' },
            { label: '老访客', value: 47, color: '#f59e0b' }
          ]}
        />

        {/* 访问来源 */}
        <PieChart
          title="访问来源"
          data={[
            { label: '直接访问', value: 89, color: '#3b82f6' },
            { label: '外部链接', value: 23, color: '#f59e0b' },
            { label: '搜索引擎', value: 13, color: '#ef4444' }
          ]}
        />

        {/* 访问终端 */}
        <PieChart
          title="访问终端"
          data={[
            { label: '电脑', value: data.deviceData.desktop, color: '#3b82f6' },
            { label: '手机平板', value: data.deviceData.mobile + data.deviceData.tablet, color: '#f59e0b' },
            { label: '其他', value: 5, color: '#10b981' }
          ]}
        />

        {/* 热门页面TOP10 */}
        <DataList
          title="热门页面 TOP10"
          data={data.topPages.map(page => ({
            label: page.url,
            value: page.views
          }))}
        />

        {/* 访问地域TOP10 */}
        <DataList
          title="访问地域 TOP10"
          data={data.geoData.map(region => ({
            label: region.region,
            value: region.views,
            extra: `${region.percentage}%`
          }))}
          showPercentage={true}
        />

        {/* 来源链接TOP10 */}
        <DataList
          title="来源链接 TOP10"
          data={data.referrerData.map(ref => ({
            label: ref.source,
            value: ref.views
          }))}
        />
      </div>

      {/* 访问地域分布地图 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">访问地域分布</h3>
        <div className="flex justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-2" />
            <p>地图组件待集成</p>
            <p className="text-sm">可集成第三方地图服务如百度地图、高德地图等</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 