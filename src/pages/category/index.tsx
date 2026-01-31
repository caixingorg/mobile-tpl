import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

// 分类数据
const categories = [
  { id: 1, name: '热门推荐' },
  { id: 2, name: '手机数码' },
  { id: 3, name: '电脑办公' },
  { id: 4, name: '家用电器' },
  { id: 5, name: '美妆护肤' },
  { id: 6, name: '服装鞋包' },
  { id: 7, name: '食品生鲜' },
  { id: 8, name: '家居家装' },
  { id: 9, name: '运动户外' },
  { id: 10, name: '图书文具' },
  { id: 11, name: '母婴用品' },
  { id: 12, name: '汽车用品' },
];

// 子分类数据
const subCategories: Record<number, { name: string; image: string }[]> = {
  1: [
    { name: '新品上市', image: 'https://placehold.co/150x150/ff5000/white?text=新品' },
    { name: '热销爆款', image: 'https://placehold.co/150x150/ff6b6b/white?text=热销' },
    { name: '限时特惠', image: 'https://placehold.co/150x150/feca57/white?text=特惠' },
    { name: '品质好物', image: 'https://placehold.co/150x150/4ecdc4/white?text=品质' },
    { name: '超值秒杀', image: 'https://placehold.co/150x150/96ceb4/white?text=秒杀' },
    { name: '品牌特卖', image: 'https://placehold.co/150x150/45b7d1/white?text=特卖' },
  ],
  2: [
    { name: '5G手机', image: 'https://placehold.co/150x150/333/white?text=5G' },
    { name: '游戏手机', image: 'https://placehold.co/150x150/666/white?text=游戏' },
    { name: '拍照手机', image: 'https://placehold.co/150x150/999/white?text=拍照' },
    { name: '平板电脑', image: 'https://placehold.co/150x150/ccc/333?text=平板' },
    { name: '智能手表', image: 'https://placehold.co/150x150/ff6b6b/white?text=手表' },
    { name: '蓝牙耳机', image: 'https://placehold.co/150x150/4ecdc4/white?text=耳机' },
    { name: '移动电源', image: 'https://placehold.co/150x150/feca57/white?text=电源' },
    { name: '手机壳膜', image: 'https://placehold.co/150x150/96ceb4/white?text=壳膜' },
    { name: '数据线', image: 'https://placehold.co/150x150/45b7d1/white?text=数据线' },
  ],
  3: [
    { name: '轻薄本', image: 'https://placehold.co/150x150/333/white?text=轻薄本' },
    { name: '游戏本', image: 'https://placehold.co/150x150/666/white?text=游戏本' },
    { name: '机械键盘', image: 'https://placehold.co/150x150/999/white?text=键盘' },
    { name: '电竞鼠标', image: 'https://placehold.co/150x150/ff6b6b/white?text=鼠标' },
    { name: '显示器', image: 'https://placehold.co/150x150/4ecdc4/white?text=显示器' },
    { name: '打印机', image: 'https://placehold.co/150x150/feca57/white?text=打印机' },
  ],
  4: [
    { name: '电视', image: 'https://placehold.co/150x150/333/white?text=电视' },
    { name: '空调', image: 'https://placehold.co/150x150/666/white?text=空调' },
    { name: '冰箱', image: 'https://placehold.co/150x150/999/white?text=冰箱' },
    { name: '洗衣机', image: 'https://placehold.co/150x150/ff6b6b/white?text=洗衣机' },
    { name: '扫地机器人', image: 'https://placehold.co/150x150/4ecdc4/white?text=扫地机' },
    { name: '空气净化器', image: 'https://placehold.co/150x150/feca57/white?text=净化器' },
  ],
  5: [
    { name: '面部护理', image: 'https://placehold.co/150x150/d4a5a5/white?text=面部' },
    { name: '彩妆香氛', image: 'https://placehold.co/150x150/ff6b6b/white?text=彩妆' },
    { name: '洗发护发', image: 'https://placehold.co/150x150/4ecdc4/white?text=护发' },
    { name: '身体护理', image: 'https://placehold.co/150x150/feca57/white?text=身体' },
    { name: '口腔护理', image: 'https://placehold.co/150x150/96ceb4/white?text=口腔' },
    { name: '女士护理', image: 'https://placehold.co/150x150/45b7d1/white?text=女士' },
  ],
  6: [
    { name: '男装', image: 'https://placehold.co/150x150/333/white?text=男装' },
    { name: '女装', image: 'https://placehold.co/150x150/ff6b6b/white?text=女装' },
    { name: '运动鞋', image: 'https://placehold.co/150x150/666/white?text=运动鞋' },
    { name: '休闲鞋', image: 'https://placehold.co/150x150/999/white?text=休闲鞋' },
    { name: '包包', image: 'https://placehold.co/150x150/feca57/white?text=包包' },
    { name: '配饰', image: 'https://placehold.co/150x150/4ecdc4/white?text=配饰' },
  ],
  7: [
    { name: '休闲零食', image: 'https://placehold.co/150x150/ff6b6b/white?text=零食' },
    { name: '新鲜水果', image: 'https://placehold.co/150x150/96ceb4/white?text=水果' },
    { name: '肉禽蛋品', image: 'https://placehold.co/150x150/feca57/white?text=肉禽' },
    { name: '海鲜水产', image: 'https://placehold.co/150x150/45b7d1/white?text=海鲜' },
    { name: '酒水饮料', image: 'https://placehold.co/150x150/4ecdc4/white?text=酒水' },
    { name: '粮油调味', image: 'https://placehold.co/150x150/d4a5a5/white?text=粮油' },
  ],
  8: [
    { name: '床品套件', image: 'https://placehold.co/150x150/d4a5a5/white?text=床品' },
    { name: '收纳整理', image: 'https://placehold.co/150x150/feca57/white?text=收纳' },
    { name: '厨房用具', image: 'https://placehold.co/150x150/4ecdc4/white?text=厨具' },
    { name: '灯具照明', image: 'https://placehold.co/150x150/96ceb4/white?text=灯具' },
    { name: '家具', image: 'https://placehold.co/150x150/45b7d1/white?text=家具' },
    { name: '卫浴用品', image: 'https://placehold.co/150x150/ff6b6b/white?text=卫浴' },
  ],
  9: [
    { name: '跑步鞋', image: 'https://placehold.co/150x150/ff6b6b/white?text=跑鞋' },
    { name: '运动服装', image: 'https://placehold.co/150x150/4ecdc4/white?text=运动服' },
    { name: '健身器材', image: 'https://placehold.co/150x150/feca57/white?text=健身' },
    { name: '户外装备', image: 'https://placehold.co/150x150/96ceb4/white?text=户外' },
    { name: '球类运动', image: 'https://placehold.co/150x150/45b7d1/white?text=球类' },
    { name: '骑行装备', image: 'https://placehold.co/150x150/d4a5a5/white?text=骑行' },
  ],
  10: [
    { name: '文学小说', image: 'https://placehold.co/150x150/d4a5a5/white?text=小说' },
    { name: '经管励志', image: 'https://placehold.co/150x150/feca57/white?text=经管' },
    { name: '科技科普', image: 'https://placehold.co/150x150/4ecdc4/white?text=科技' },
    { name: '教育考试', image: 'https://placehold.co/150x150/96ceb4/white?text=教育' },
    { name: '文具用品', image: 'https://placehold.co/150x150/45b7d1/white?text=文具' },
    { name: '艺术美术', image: 'https://placehold.co/150x150/ff6b6b/white?text=艺术' },
  ],
  11: [
    { name: '奶粉', image: 'https://placehold.co/150x150/feca57/white?text=奶粉' },
    { name: '尿裤湿巾', image: 'https://placehold.co/150x150/4ecdc4/white?text=尿裤' },
    { name: '童装童鞋', image: 'https://placehold.co/150x150/ff6b6b/white?text=童装' },
    { name: '玩具乐器', image: 'https://placehold.co/150x150/96ceb4/white?text=玩具' },
    { name: '孕产用品', image: 'https://placehold.co/150x150/45b7d1/white?text=孕产' },
    { name: '宝宝洗护', image: 'https://placehold.co/150x150/d4a5a5/white?text=洗护' },
  ],
  12: [
    { name: '机油保养', image: 'https://placehold.co/150x150/333/white?text=机油' },
    { name: '行车记录仪', image: 'https://placehold.co/150x150/666/white?text=记录仪' },
    { name: '车载电器', image: 'https://placehold.co/150x150/999/white?text=电器' },
    { name: '内饰用品', image: 'https://placehold.co/150x150/ff6b6b/white?text=内饰' },
    { name: '外饰改装', image: 'https://placehold.co/150x150/4ecdc4/white?text=改装' },
    { name: '轮胎', image: 'https://placehold.co/150x150/feca57/white?text=轮胎' },
  ],
};

export default function Category() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(1);

  const currentSubCategories = subCategories[activeCategory] || [];

  return (
    <div className={styles.container}>
      {/* 左侧分类 */}
      <div className={styles.sidebar}>
        {categories.map(cat => (
          <div
            key={cat.id}
            className={activeCategory === cat.id ? styles.categoryItemActive : styles.categoryItem}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </div>
        ))}
      </div>

      {/* 右侧内容 */}
      <div className={styles.content}>
        {/* Banner */}
        <div className={styles.banner}>
          <img
            src={`https://placehold.co/600x200/ff5000/white?text=${categories.find(c => c.id === activeCategory)?.name}`}
            alt="banner"
            className={styles.bannerImg}
          />
        </div>

        {/* 子分类 */}
        <div className={styles.subCategoryTitle}>热门分类</div>
        <div className={styles.subCategoryGrid}>
          {currentSubCategories.map((item, index) => (
            <div
              key={index}
              className={styles.subCategoryItem}
              onClick={() => navigate('/product/1')}
            >
              <img src={item.image} alt={item.name} className={styles.subCategoryImg} />
              <span className={styles.subCategoryName}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
