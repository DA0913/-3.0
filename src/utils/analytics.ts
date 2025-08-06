// 前端统计数据收集工具
interface AnalyticsData {
  page_url: string;
  referrer: string;
  user_agent: string;
  screen_resolution: string;
  session_id: string;
}

class Analytics {
  private sessionId: string;
  private lastActivity: number;
  private readonly sessionTimeout = 30 * 60 * 1000; // 30分钟

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.lastActivity = Date.now();
    this.setupPageUnloadTracking();
  }

  private getOrCreateSessionId(): string {
    const existingSessionId = sessionStorage.getItem('analytics_session_id');
    const lastActivity = sessionStorage.getItem('analytics_last_activity');
    
    if (existingSessionId && lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
      if (timeSinceLastActivity < this.sessionTimeout) {
        return existingSessionId;
      }
    }
    
    const newSessionId = this.generateSessionId();
    sessionStorage.setItem('analytics_session_id', newSessionId);
    return newSessionId;
  }

  private generateSessionId(): string {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private updateLastActivity(): void {
    this.lastActivity = Date.now();
    sessionStorage.setItem('analytics_last_activity', this.lastActivity.toString());
  }

  private getScreenResolution(): string {
    return `${screen.width}x${screen.height}`;
  }

  private setupPageUnloadTracking(): void {
    // 页面卸载时发送数据
    window.addEventListener('beforeunload', () => {
      this.flush();
    });

    // 页面可见性变化时发送数据
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    });
  }

  // 跟踪页面访问
  public trackPageView(customData?: Partial<AnalyticsData>): void {
    this.updateLastActivity();
    
    const data: AnalyticsData = {
      page_url: window.location.href,
      referrer: document.referrer || '',
      user_agent: navigator.userAgent,
      screen_resolution: this.getScreenResolution(),
      session_id: this.sessionId,
      ...customData
    };

    this.sendData(data);
  }

  // 跟踪自定义事件
  public trackEvent(eventName: string, eventData?: any): void {
    this.updateLastActivity();
    
    const data = {
      page_url: window.location.href,
      referrer: document.referrer || '',
      user_agent: navigator.userAgent,
      screen_resolution: this.getScreenResolution(),
      session_id: this.sessionId,
      event_name: eventName,
      event_data: eventData
    };

    this.sendData(data);
  }

  private async sendData(data: any): Promise<void> {
    try {
      // 使用 sendBeacon API 确保数据发送的可靠性
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics/track', blob);
      } else {
        // 降级方案：使用 fetch
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          keepalive: true // 确保在页面卸载时仍能发送
        }).catch(error => {
          console.warn('Analytics tracking failed:', error);
        });
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  // 强制发送所有待发送数据
  public flush(): void {
    // 这里可以实现批量发送逻辑
    // 目前每次都是实时发送，所以不需要特殊处理
  }

  // 设置用户ID（如果用户已登录）
  public setUserId(userId: string): void {
    sessionStorage.setItem('analytics_user_id', userId);
  }

  // 获取用户ID
  public getUserId(): string | null {
    return sessionStorage.getItem('analytics_user_id');
  }
}

// 创建全局实例
const analytics = new Analytics();

// 自动跟踪页面访问
if (typeof window !== 'undefined') {
  // 初始页面加载
  analytics.trackPageView();
  
  // SPA路由变化跟踪
  let currentUrl = window.location.href;
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    setTimeout(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        analytics.trackPageView();
      }
    }, 0);
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    setTimeout(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        analytics.trackPageView();
      }
    }, 0);
  };
  
  // 监听浏览器前进后退
  window.addEventListener('popstate', () => {
    setTimeout(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        analytics.trackPageView();
      }
    }, 0);
  });
}

export default analytics; 