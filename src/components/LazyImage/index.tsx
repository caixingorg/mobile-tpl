/*
 * 懒加载图片组件 - 支持骨架屏和加载占位
 */
import { useState, useRef, useEffect, memo } from 'react';
import styles from './index.module.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
}

const LazyImage = memo(
  ({
    src,
    alt,
    className = '',
    placeholder,
    rootMargin = '50px',
    threshold = 0.01,
  }: LazyImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Intersection Observer 监听图片是否进入视口
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin,
          threshold,
        }
      );

      observer.observe(container);

      return () => {
        observer.disconnect();
      };
    }, [rootMargin, threshold]);

    // 预加载图片
    useEffect(() => {
      if (!isInView) return;

      const img = new Image();
      img.src = src;
      img.onload = () => {
        setIsLoaded(true);
      };
    }, [isInView, src]);

    return (
      <div ref={containerRef} className={`${styles.container} ${className}`}>
        {/* 骨架屏/占位 */}
        {(!isLoaded || !isInView) && (
          <div className={styles.placeholder}>
            {placeholder || <div className={styles.skeleton} />}
          </div>
        )}

        {/* 实际图片 */}
        {isInView && (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={`${styles.image} ${isLoaded ? styles.loaded : ''}`}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
    );
  }
);

LazyImage.displayName = 'LazyImage';

export default LazyImage;
