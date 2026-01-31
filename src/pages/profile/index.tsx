import {
  SetOutline,
  PayCircleOutline,
  TruckOutline,
  GiftOutline,
  MessageOutline,
  StarOutline,
  EnvironmentOutline,
  FileOutline,
} from 'antd-mobile-icons';
import LazyImage from '@/components/LazyImage';
import styles from './index.module.css';

// 订单类型
const orderTypes = [
  { icon: PayCircleOutline, name: '待付款', badge: 2 },
  { icon: TruckOutline, name: '待发货', badge: 0 },
  { icon: GiftOutline, name: '待收货', badge: 1 },
  { icon: MessageOutline, name: '待评价', badge: 0 },
];

// 功能菜单
const menuItems = [
  { icon: '🎫', name: '优惠券', color: '#ff6b6b' },
  { icon: '💎', name: '积分', color: '#4ecdc4' },
  { icon: '⭐', name: '收藏', color: '#feca57' },
  { icon: '📍', name: '足迹', color: '#96ceb4' },
  { icon: '🔔', name: '消息', color: '#45b7d1' },
  { icon: '🎁', name: '会员', color: '#ff9ff3' },
  { icon: '💰', name: '钱包', color: '#54a0ff' },
  { icon: '🎮', name: '游戏', color: '#5f27cd' },
];

// 列表菜单
const listMenus = [
  { icon: <EnvironmentOutline />, name: '收货地址', color: '#ff6b6b', bgColor: '#fff0f0' },
  { icon: <MessageOutline />, name: '客服中心', color: '#4ecdc4', bgColor: '#e6f8f7' },
  { icon: <FileOutline />, name: '隐私政策', color: '#feca57', bgColor: '#fff9e6' },
  { icon: <StarOutline />, name: '关于我们', color: '#96ceb4', bgColor: '#f0f8f5' },
];

export default function Profile() {
  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <LazyImage
            src="https://placehold.co/150x150/ff5000/white?text=User"
            alt="Avatar"
            className={styles.avatar}
          />
          <div className={styles.userMeta}>
            <div className={styles.username}>用户123456</div>
            <div className={styles.userLevel}>超级会员</div>
          </div>
          <div className={styles.settingsBtn}>
            <SetOutline />
          </div>
        </div>
      </div>

      {/* 订单卡片 */}
      <div className={styles.orderCard}>
        <div className={styles.orderHeader}>
          <span className={styles.orderTitle}>我的订单</span>
          <span className={styles.orderMore}>查看全部 &gt;</span>
        </div>
        <div className={styles.orderTypes}>
          {orderTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <div key={index} className={styles.orderType}>
                <Icon className={styles.orderTypeIcon} />
                <span className={styles.orderTypeText}>{type.name}</span>
                {type.badge > 0 && <span className={styles.badge}>{type.badge}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* 资产区域 */}
      <div className={styles.assetSection}>
        <div className={styles.assetTitle}>我的资产</div>
        <div className={styles.assetGrid}>
          <div className={styles.assetItem}>
            <div className={styles.assetValue}>128</div>
            <div className={styles.assetLabel}>优惠券</div>
          </div>
          <div className={styles.assetItem}>
            <div className={styles.assetValue}>2580</div>
            <div className={styles.assetLabel}>积分</div>
          </div>
          <div className={styles.assetItem}>
            <div className={styles.assetValue}>¥688.00</div>
            <div className={styles.assetLabel}>余额</div>
          </div>
          <div className={styles.assetItem}>
            <div className={styles.assetValue}>12</div>
            <div className={styles.assetLabel}>红包</div>
          </div>
        </div>
      </div>

      {/* 功能菜单 */}
      <div className={styles.menuSection}>
        <div className={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <div key={index} className={styles.menuItem}>
              <div className={styles.menuIcon} style={{ backgroundColor: `${item.color}20` }}>
                {item.icon}
              </div>
              <span className={styles.menuText}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 列表菜单 */}
      <div className={styles.listMenu}>
        {listMenus.map((item, index) => (
          <div key={index} className={styles.listItem}>
            <div
              className={styles.listIcon}
              style={{ color: item.color, backgroundColor: item.bgColor }}
            >
              {item.icon}
            </div>
            <span className={styles.listContent}>{item.name}</span>
            <span className={styles.listArrow}>&gt;</span>
          </div>
        ))}
      </div>
    </div>
  );
}
