import { useNavigate, useLocation } from 'react-router-dom';
import {
  UnorderedListOutline,
  AppstoreOutline,
  TruckOutline,
  UserOutline,
} from 'antd-mobile-icons';
import styles from './index.module.css';

const tabs = [
  { key: '/', title: '首页', icon: UnorderedListOutline },
  { key: '/category', title: '分类', icon: AppstoreOutline },
  { key: '/cart', title: '购物车', icon: TruckOutline },
  { key: '/profile', title: '我的', icon: UserOutline },
];

export default function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // 详情页和登录页不显示底部导航
  if (location.pathname.startsWith('/product/') || location.pathname === '/login') {
    return null;
  }

  return (
    <div className={styles.tabBar}>
      <div className={styles.tabList}>
        {tabs.map(tab => {
          const isActive = location.pathname === tab.key;
          const Icon = tab.icon;
          return (
            <div
              key={tab.key}
              className={isActive ? styles.tabItemActive : styles.tabItem}
              onClick={() => navigate(tab.key)}
            >
              <Icon className={styles.tabIcon} />
              <span className={styles.tabText}>{tab.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
