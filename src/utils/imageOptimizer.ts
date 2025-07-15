/**
 * 图片优化工具函数
 * 用于优化图片加载和处理
 */

/**
 * 预加载图片
 * @param src 图片URL
 * @returns Promise 图片加载完成的Promise
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * 批量预加载图片
 * @param srcs 图片URL数组
 * @returns Promise 所有图片加载完成的Promise
 */
export const preloadImages = (srcs: string[]): Promise<HTMLImageElement[]> => {
  return Promise.all(srcs.map(preloadImage));
};

/**
 * 优化图片URL，添加尺寸和质量参数
 * @param url 原始图片URL
 * @param width 目标宽度
 * @param quality 图片质量 (0-100)
 * @returns 优化后的图片URL
 */
export const optimizeImageUrl = (url: string, width: number = 400, quality: number = 80): string => {
  // 检查是否是Pexels图片
  if (url.includes('pexels.com')) {
    // Pexels已经支持宽度和质量参数
    return `${url}?auto=compress&cs=tinysrgb&w=${width}&q=${quality}`;
  }
  
  // 其他图片服务可以在这里添加
  
  // 默认返回原始URL
  return url;
};

/**
 * 获取图片的主色调
 * @param imageUrl 图片URL
 * @returns Promise<string> 返回十六进制颜色值
 */
export const getImageDominantColor = async (imageUrl: string): Promise<string> => {
  try {
    const img = await preloadImage(imageUrl);
    
    // 创建canvas来分析图片
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '#f0f4f9'; // 默认背景色
    
    // 设置canvas大小为图片的1/10，以提高性能
    const size = 10;
    canvas.width = size;
    canvas.height = size;
    
    // 在canvas上绘制图片
    ctx.drawImage(img, 0, 0, size, size);
    
    // 获取像素数据
    const imageData = ctx.getImageData(0, 0, size, size).data;
    
    // 计算平均颜色
    let r = 0, g = 0, b = 0;
    const pixelCount = imageData.length / 4;
    
    for (let i = 0; i < imageData.length; i += 4) {
      r += imageData[i];
      g += imageData[i + 1];
      b += imageData[i + 2];
    }
    
    r = Math.floor(r / pixelCount);
    g = Math.floor(g / pixelCount);
    b = Math.floor(b / pixelCount);
    
    // 转换为十六进制
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch (error) {
    console.error('获取图片主色调失败:', error);
    return '#f0f4f9'; // 默认背景色
  }
};

/**
 * 检查图片是否存在
 * @param url 图片URL
 * @returns Promise<boolean> 图片是否存在
 */
export const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * 获取图片的实际尺寸
 * @param url 图片URL
 * @returns Promise<{width: number, height: number}> 图片尺寸
 */
export const getImageDimensions = async (url: string): Promise<{width: number, height: number}> => {
  try {
    const img = await preloadImage(url);
    return {
      width: img.naturalWidth,
      height: img.naturalHeight
    };
  } catch (error) {
    console.error('获取图片尺寸失败:', error);
    return { width: 0, height: 0 };
  }
};