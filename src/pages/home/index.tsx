import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchOutline, FireFill } from 'antd-mobile-icons';
import { Swiper } from 'antd-mobile';
import styles from './index.module.css';

// 分类数据
const categories = [
  { name: '手机', icon: '📱', color: '#ff6b6b' },
  { name: '数码', icon: '💻', color: '#4ecdc4' },
  { name: '服装', icon: '👔', color: '#45b7d1' },
  { name: '鞋包', icon: '👟', color: '#96ceb4' },
  { name: '美妆', icon: '💄', color: '#feca57' },
  { name: '食品', icon: '🍔', color: '#ff9ff3' },
  { name: '家居', icon: '🏠', color: '#54a0ff' },
  { name: '图书', icon: '📚', color: '#5f27cd' },
  { name: '运动', icon: '⚽', color: '#00d2d3' },
  { name: '更多', icon: '➕', color: '#8395a7' },
];

// 限时秒杀商品
const flashProducts = [
  {
    id: 1,
    name: 'iPhone 15',
    price: 4999,
    originalPrice: 5999,
    image: 'https://placehold.co/200x200/ff5000/white?text=iPhone',
  },
  {
    id: 2,
    name: 'MacBook Air',
    price: 6999,
    originalPrice: 8999,
    image: 'https://placehold.co/200x200/333/white?text=MacBook',
  },
  {
    id: 3,
    name: 'AirPods Pro',
    price: 1299,
    originalPrice: 1999,
    image: 'https://placehold.co/200x200/666/white?text=AirPods',
  },
  {
    id: 4,
    name: 'iPad Air',
    price: 3299,
    originalPrice: 3999,
    image: 'https://placehold.co/200x200/999/white?text=iPad',
  },
];

// 推荐商品
const products = [
  {
    id: 1,
    title: 'Apple iPhone 15 Pro Max 256GB 钛金属',
    price: 9999,
    sales: '1万+',
    image: 'https://placehold.co/300x300/333/white?text=iPhone+15',
    tags: ['自营', '包邮'],
  },
  {
    id: 2,
    title: '索尼 WH-1000XM5 头戴式降噪耳机',
    price: 2499,
    sales: '5000+',
    image: 'https://placehold.co/300x300/666/white?text=Sony',
    tags: ['新品'],
  },
  {
    id: 3,
    title: 'Nike Air Force 1 空军一号板鞋',
    price: 749,
    sales: '10万+',
    image: 'https://placehold.co/300x300/ff6b6b/white?text=Nike',
    tags: ['爆款'],
  },
  {
    id: 4,
    title: '雅诗兰黛小棕瓶精华 50ml',
    price: 850,
    sales: '2万+',
    image: 'https://placehold.co/300x300/d4a5a5/white?text=EL',
    tags: ['自营'],
  },
  {
    id: 5,
    title: '戴森 V12 吸尘器 2023新款',
    price: 3999,
    sales: '3000+',
    image: 'https://placehold.co/300x300/999/white?text=Dyson',
    tags: ['官方'],
  },
  {
    id: 6,
    title: '乐高 机械组跑车模型',
    price: 2299,
    sales: '8000+',
    image: 'https://placehold.co/300x300/ff8a00/white?text=Lego',
    tags: ['热卖'],
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 15, seconds: 30 });

  // 倒计时 - 使用 requestAnimationFrame + Page Visibility API 优化性能
  useEffect(() => {
    let rafId: number;
    let lastTime = Date.now();

    const tick = () => {
      const now = Date.now();
      if (now - lastTime >= 1000) {
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
        lastTime = now;
      }
      rafId = requestAnimationFrame(tick);
    };

    // 页面可见性变化时暂停/恢复
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        lastTime = Date.now(); // 重置时间，避免跳变
        rafId = requestAnimationFrame(tick);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
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
              <img
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
          {categories.map((cat, index) => (
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
          {flashProducts.map(product => (
            <div
              key={product.id}
              className={styles.flashProductItem}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img src={product.image} alt={product.name} className={styles.flashProductImg} />
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
          {products.map(product => (
            <div
              key={product.id}
              className={styles.productCard}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img src={product.image} alt={product.title} className={styles.productImg} />
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
          ))}
        </div>
      </div>
    </div>
  );
}
