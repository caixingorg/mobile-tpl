import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper } from 'antd-mobile';
import { LeftOutline, StarOutline, MessageOutline, AppstoreOutline } from 'antd-mobile-icons';
import { throttle } from 'lodash-es';
import styles from './index.module.css';

// 模拟商品数据
const productData = {
  id: 1,
  name: 'Apple iPhone 15 Pro Max 256GB 钛金属',
  desc: 'A17 Pro芯片 | 钛金属设计 | 4800万像素主摄 | 5倍光学变焦',
  price: 9999,
  originalPrice: 10999,
  sales: '10万+',
  rating: 4.9,
  ratingCount: '2万+',
  images: [
    'https://placehold.co/400x400/333/white?text=iPhone+15',
    'https://placehold.co/400x400/444/white?text=Image+2',
    'https://placehold.co/400x400/555/white?text=Image+3',
  ],
  specs: [
    { label: '选择', value: '颜色、版本' },
    { label: '发货', value: '上海 免运费' },
    { label: '保障', value: '正品保证 · 7天无理由' },
  ],
  reviews: [
    {
      id: 1,
      username: '用户***123',
      avatar: 'https://placehold.co/100x100/ff5000/white?text=U1',
      rating: 5,
      content: '手机非常流畅，拍照效果特别好，钛金属质感很棒！',
    },
    {
      id: 2,
      username: '用户***456',
      avatar: 'https://placehold.co/100x100/4ecdc4/white?text=U2',
      rating: 5,
      content: '物流很快，包装完好，非常满意这次购物。',
    },
  ],
};

export default function Product() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // 使用 throttle 优化滚动性能，100ms 节流
  const handleScroll = useMemo(
    () =>
      throttle(
        () => {
          setIsScrolled(window.scrollY > 100);
        },
        100,
        { leading: false, trailing: true }
      ),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      handleScroll.cancel();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className={styles.container}>
      {/* 头部导航 */}
      <div
        className={`${styles.header} ${isScrolled ? styles.headerSolid : styles.headerTransparent}`}
      >
        <div className={styles.backBtn} onClick={() => navigate(-1)}>
          <LeftOutline />
        </div>
        <div className={styles.headerActions}>
          <div className={styles.actionBtn}>
            <StarOutline />
          </div>
          <div className={styles.actionBtn}>
            <AppstoreOutline />
          </div>
        </div>
      </div>

      {/* 图片轮播 */}
      <div className={styles.gallery}>
        <Swiper loop>
          {productData.images.map((img, index) => (
            <Swiper.Item key={index}>
              <img src={img} alt={`Product ${index + 1}`} className={styles.galleryImg} />
            </Swiper.Item>
          ))}
        </Swiper>
      </div>

      {/* 价格区域 */}
      <div className={styles.priceSection}>
        <div className={styles.priceRow}>
          <span className={styles.currentPrice}>
            <span className={styles.pricePrefix}>¥</span>
            {productData.price}
          </span>
          <span className={styles.originalPrice}>¥{productData.originalPrice}</span>
        </div>
        <div className={styles.priceTags}>
          <span className={styles.priceTag}>限时特惠</span>
          <span className={styles.priceTag}>已售{productData.sales}</span>
        </div>
      </div>

      {/* 商品信息 */}
      <div className={styles.infoSection}>
        <div className={styles.productName}>{productData.name}</div>
        <div className={styles.productDesc}>{productData.desc}</div>
        <div className={styles.productMeta}>
          <span>发货地: 上海</span>
          <span>运费: 免运费</span>
          <span>月销量: {productData.sales}</span>
        </div>
      </div>

      {/* 规格选择 */}
      <div className={styles.specSection}>
        {productData.specs.map((spec, index) => (
          <div key={index} className={styles.specRow}>
            <span className={styles.specLabel}>{spec.label}</span>
            <span className={styles.specValue}>
              {spec.value}
              <span className={styles.specArrow}>&gt;</span>
            </span>
          </div>
        ))}
      </div>

      {/* 评价 */}
      <div className={styles.reviewSection}>
        <div className={styles.reviewHeader}>
          <span className={styles.reviewTitle}>
            商品评价 <span className={styles.reviewRate}>{productData.rating}分</span>
          </span>
          <span className={styles.reviewMore}>查看全部 &gt;</span>
        </div>
        {productData.reviews.map(review => (
          <div key={review.id} className={styles.reviewItem}>
            <div className={styles.reviewUser}>
              <img src={review.avatar} alt={review.username} className={styles.reviewAvatar} />
              <span className={styles.reviewUsername}>{review.username}</span>
            </div>
            <div className={styles.reviewContent}>{review.content}</div>
          </div>
        ))}
      </div>

      {/* 底部操作栏 */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomActions}>
          <div className={styles.bottomAction}>
            <AppstoreOutline className={styles.bottomActionIcon} />
            <span>店铺</span>
          </div>
          <div className={styles.bottomAction}>
            <MessageOutline className={styles.bottomActionIcon} />
            <span>客服</span>
          </div>
          <div className={styles.bottomAction}>
            <StarOutline className={styles.bottomActionIcon} />
            <span>收藏</span>
          </div>
        </div>
        <button className={styles.addCartBtn}>加入购物车</button>
        <button className={styles.buyBtn}>立即购买</button>
      </div>
    </div>
  );
}
