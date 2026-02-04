import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchOutline, FireFill } from 'antd-mobile-icons';
import { Swiper } from 'antd-mobile';
import LazyImage from '@/components/LazyImage';
import { CATEGORIES, FLASH_PRODUCTS, MOCK_PRODUCTS } from '@/constants/mockData';
import styles from './index.module.css';

export default function Home() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 15, seconds: 30 });

  // 倒计时 - 使用 setInterval + Page Visibility API 优化性能
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const tick = () => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 2;
          minutes = 15;
          seconds = 30;
        }
        return { hours, minutes, seconds };
      });
    };

    // 页面可见性变化时暂停/恢复
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(intervalId);
      } else {
        intervalId = setInterval(tick, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    intervalId = setInterval(tick, 1000);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const formatNum = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className={styles.container}>
      {/* 搜索栏 */}
      <div className={styles.searchHeader}>
        <div className={styles.searchBox}>
          <SearchOutline className={styles.searchIcon} />
          <span>搜索商品、品牌</span>
        </div>
      </div>

      {/* 轮播图 */}
      <div className={styles.bannerWrapper}>
        <Swiper autoplay loop className={styles.bannerItem}>
          {[1, 2, 3].map(item => (
            <Swiper.Item key={item}>
              <LazyImage
                src={`https://placehold.co/800x300/ff5000/white?text=Banner+${item}`}
                alt={`Banner ${item}`}
                className={styles.bannerImage}
              />
            </Swiper.Item>
          ))}
        </Swiper>
      </div>

      {/* 分类 */}
      <div className={styles.categoryWrapper}>
        <div className={styles.categoryGrid}>
          {CATEGORIES.map((cat, index) => (
            <div key={index} className={styles.categoryItem} onClick={() => navigate('/category')}>
              <div className={styles.categoryIcon} style={{ backgroundColor: `${cat.color}20` }}>
                {cat.icon}
              </div>
              <span className={styles.categoryName}>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 限时秒杀 */}
      <div className={`${styles.section} ${styles.flashSale}`}>
        <div className={styles.flashSaleHeader}>
          <div className={styles.flashSaleTitle}>
            <FireFill /> 限时秒杀
          </div>
          <div className={styles.countdown}>
            <span>距结束</span>
            <span className={styles.countdownNum}>{formatNum(countdown.hours)}</span>
            <span>:</span>
            <span className={styles.countdownNum}>{formatNum(countdown.minutes)}</span>
            <span>:</span>
            <span className={styles.countdownNum}>{formatNum(countdown.seconds)}</span>
          </div>
        </div>
        <div className={styles.flashProductList}>
          {FLASH_PRODUCTS.map(product => (
            <div
              key={product.id}
              className={styles.flashProductItem}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <LazyImage
                src={product.image}
                alt={product.name}
                className={styles.flashProductImg}
              />
              <div className={styles.flashPrice}>¥{product.price}</div>
              <div className={styles.flashOriginalPrice}>¥{product.originalPrice}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 推荐商品 */}
      <div className={styles.section} style={{ marginBottom: 24 }}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>🛍️ 为你推荐</div>
          <span className={styles.sectionMore}>查看更多 &gt;</span>
        </div>
        <div className={styles.productGrid}>
          {MOCK_PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface Product {
  id: number;
  title: string;
  price: number;
  sales: string;
  image: string;
  tags: string[];
}

const ProductCard = memo(({ product }: { product: Product }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.productCard} onClick={() => navigate(`/product/${product.id}`)}>
      <LazyImage src={product.image} alt={product.title} className={styles.productImg} />
      <div className={styles.productInfo}>
        <div className={styles.productTitle}>{product.title}</div>
        <div className={styles.productPriceRow}>
          <span className={styles.productPrice}>
            <span className={styles.productPricePrefix}>¥</span>
            {product.price}
          </span>
          <span className={styles.productSales}>已售{product.sales}</span>
        </div>
        <div className={styles.productTags}>
          {product.tags.map((tag, idx) => (
            <span key={idx} className={styles.productTag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
