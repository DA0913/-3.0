import React, { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
}

/**
 * 懒加载图片组件
 * 只有当图片进入视口时才会加载图片
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  width,
  height,
  fallbackSrc = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    // 重置状态
    setIsLoaded(false);
    setIsError(false);
    setImageSrc(null);

    // 创建Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 图片进入视口，开始加载
          setImageSrc(src);
          // 停止观察
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '200px 0px', // 提前200px开始加载
      threshold: 0.01 // 只要有1%进入视口就开始加载
    });

    // 开始观察
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    // 清理函数
    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [src]);

  // 处理图片加载完成
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // 处理图片加载失败
  const handleError = () => {
    setIsError(true);
    setImageSrc(fallbackSrc);
  };

  return (
    <div 
      ref={imageRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }}
    >
      {/* 占位符 */}
      {!isLoaded && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${placeholderClassName}`}>
          <ImageIcon className="w-8 h-8 text-gray-300" />
        </div>
      )}
      
      {/* 实际图片 */}
      {imageSrc && (
        <img
          src={isError ? fallbackSrc : imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;