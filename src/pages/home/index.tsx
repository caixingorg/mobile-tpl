/*
 * @Author: flynn
 * @Date: 2024-03-29 16:10:20
 * @description: Home
 */
import { useMemo, useRef, useState } from 'react';
import { useNavigate, useFetcher } from 'react-router-dom';
import {
  NavBar,
  Space,
  Button,
  Card,
  List,
  Grid,
  Badge,
  Avatar,
  Toast,
  Dialog,
  SafeArea,
  Swiper,
  Tag,
  Divider,
} from 'antd-mobile';
import {
  SetOutline,
  UserCircleOutline,
  ContentOutline,
  StarOutline,
  HeartOutline,
  MessageOutline,
  PayCircleOutline,
  CalendarOutline,
  UnorderedListOutline,
  EnvironmentOutline,
  GiftOutline,
} from 'antd-mobile-icons';

import PopTest, { PopTestRef } from '@/components/Popups/PopTest';
import PopTestTwo from '@/components/Popups/PopTestTwo';
import Test from '@/components/Test';
import ThemeOne from '@/components/Test/ThemeOne';
import LangOne from '@/components/Test/LangOne';

import { useAppStore, useSettings } from '@/store';
import { DialogContext, PopupNames } from '@/common';
import { usePopup } from '@/hooks';
import styles from './index.module.css';

// 功能菜单数据
const menuItems = [
  { icon: <ContentOutline />, text: '订单', badge: '99+' },
  { icon: <StarOutline />, text: '收藏', badge: '' },
  { icon: <HeartOutline />, text: '关注', badge: '' },
  { icon: <MessageOutline />, text: '消息', badge: '3' },
];

// 服务列表数据
const serviceItems = [
  { icon: <PayCircleOutline />, text: '钱包', color: '#ff6b6b' },
  { icon: <CalendarOutline />, text: '日程', color: '#4ecdc4' },
  { icon: <UnorderedListOutline />, text: '待办', color: '#45b7d1' },
  { icon: <EnvironmentOutline />, text: '地址', color: '#96ceb4' },
  { icon: <GiftOutline />, text: '优惠券', color: '#feca57' },
  { icon: <SetOutline />, text: '设置', color: '#ff9ff3' },
];

function Home() {
  const [count, setCount] = useState(0);
  const [two, setTwo] = useState(false);

  const countMemo = useMemo(() => {
    return count * 5 - count;
  }, [count]);

  const navigate = useNavigate();
  const fetcher = useFetcher();

  const token = useAppStore(state => state.token);
  const SET_TOKEN = useAppStore(state => state.SET_TOKEN);
  const SET_THEME = useSettings(state => state.SET_THEME);
  const theme = useSettings(state => state.theme);

  const ref = useRef<PopTestRef>(null);
  const { popShow } = usePopup();

  // 跳转登录
  const handleJumpLogin = () => {
    navigate('/login', { state: { b: 666 } });
  };

  // 登出
  const handleLogout = () => {
    Dialog.confirm({
      content: '确定要退出登录吗？',
      onConfirm: () => {
        fetcher.submit(null, { action: '/logout', method: 'post' });
        Toast.show({
          icon: 'success',
          content: '已退出登录',
        });
      },
    });
  };

  // 点击计数
  const handleClick = () => {
    setCount(count + 1);
    popShow(PopupNames.popTest);
    setTwo(true);
    Toast.show({
      content: `点击了 ${count + 1} 次`,
      duration: 1000,
    });
  };

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    SET_THEME(newTheme);
    Toast.show({
      icon: 'success',
      content: `已切换至${newTheme === 'light' ? '浅色' : '深色'}主题`,
    });
  };

  // 修改 token
  const handleModifyToken = () => {
    SET_TOKEN(token + '123');
    Toast.show({
      icon: 'success',
      content: 'Token 已更新',
    });
  };

  return (
    <DialogContext.Provider value={{}}>
      <div className={styles.container}>
        <SafeArea position="top" />

        {/* 顶部导航 */}
        <NavBar
          back={null}
          left={<span className={styles.navTitle}>首页</span>}
          right={
            <Space>
              <Button size="small" fill="none" onClick={() => navigate('/home2')}>
                <Badge content={Badge.dot}>
                  <SetOutline className={styles.iconDefault} />
                </Badge>
              </Button>
            </Space>
          }
        />

        {/* 轮播图 */}
        <div className={styles.swiperWrapper}>
          <Swiper autoplay loop className={styles.swiperItem}>
            {[1, 2, 3].map(item => (
              <Swiper.Item key={item}>
                <div
                  style={{
                    height: '150px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    background:
                      item === 1
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : item === 2
                          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                          : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  }}
                >
                  轮播图 {item}
                </div>
              </Swiper.Item>
            ))}
          </Swiper>
        </div>

        {/* 用户信息卡片 */}
        <div style={{ padding: '0 12px', marginTop: '12px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Avatar
                src=""
                fallback={<UserCircleOutline style={{ fontSize: '48px' }} />}
                style={{ '--size': '56px' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>用户昵称</div>
                <div style={{ marginTop: '4px' }}>
                  <Tag color="primary" fill="outline" style={{ fontSize: '12px' }}>
                    VIP
                  </Tag>
                </div>
              </div>
              <Button size="small" fill="outline" onClick={handleJumpLogin}>
                切换账号
              </Button>
            </div>
          </Card>
        </div>

        {/* 功能菜单 */}
        <div style={{ padding: '0 12px', marginTop: '12px' }}>
          <Card bodyStyle={{ padding: '16px 8px' }}>
            <Grid columns={4} gap={8}>
              {menuItems.map((item, index) => (
                <Grid.Item key={index}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Badge content={item.badge}>
                      <div style={{ fontSize: '24px', color: '#666' }}>{item.icon}</div>
                    </Badge>
                    <span style={{ fontSize: '13px', color: '#666' }}>{item.text}</span>
                  </div>
                </Grid.Item>
              ))}
            </Grid>
          </Card>
        </div>

        {/* 服务列表 */}
        <div style={{ padding: '0 12px', marginTop: '12px' }}>
          <Card title="我的服务">
            <Grid columns={3} gap={12}>
              {serviceItems.map((item, index) => (
                <Grid.Item key={index}>
                  <Button
                    fill="none"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      height: 'auto',
                      padding: '12px 0',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '20px',
                        backgroundColor: item.color,
                      }}
                    >
                      {item.icon}
                    </div>
                    <span style={{ fontSize: '13px', color: '#666' }}>{item.text}</span>
                  </Button>
                </Grid.Item>
              ))}
            </Grid>
          </Card>
        </div>

        {/* Token 信息 */}
        <div style={{ padding: '0 12px', marginTop: '12px' }}>
          <Card
            title="Token 信息"
            extra={
              <Space>
                <Button size="small" onClick={handleModifyToken}>
                  修改
                </Button>
                <Button size="small" color="danger" onClick={handleLogout}>
                  重置
                </Button>
              </Space>
            }
          >
            <div style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  color: '#666',
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                }}
              >
                {token}
              </span>
            </div>
          </Card>
        </div>

        {/* 主题切换 */}
        <div style={{ padding: '0 12px', marginTop: '12px' }}>
          <Card>
            <List header="主题设置">
              <List.Item
                prefix={<ThemeOne />}
                extra={
                  <Space>
                    <Button
                      size="small"
                      color={theme === 'dark' ? 'primary' : 'default'}
                      fill={theme === 'dark' ? 'solid' : 'outline'}
                      onClick={toggleTheme}
                    >
                      Dark
                    </Button>
                    <Button
                      size="small"
                      color={theme === 'light' ? 'primary' : 'default'}
                      fill={theme === 'light' ? 'solid' : 'outline'}
                      onClick={toggleTheme}
                    >
                      Light
                    </Button>
                  </Space>
                }
              >
                当前主题: {theme}
              </List.Item>
              <List.Item prefix={<LangOne />}>语言设置</List.Item>
            </List>
          </Card>
        </div>

        {/* 计数器演示 */}
        <div style={{ padding: '0 12px', marginTop: '12px' }}>
          <Card title="React 状态演示" extra={<Tag color="primary">Demo</Tag>}>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                  marginBottom: '8px',
                }}
              >
                {count}
              </div>
              <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
                Count: {count} | Memo: {countMemo}
              </div>
              <Space justify="center" block>
                <Button color="primary" onClick={handleClick}>
                  点击 +1
                </Button>
                <Button
                  color="primary"
                  fill="outline"
                  onClick={() => popShow(PopupNames.PopTestTwo)}
                >
                  打开弹窗
                </Button>
              </Space>
            </div>

            <Divider />

            <Test count={count} />
          </Card>
        </div>

        <PopTest ref={ref} />
        {two ? <PopTestTwo /> : null}

        <SafeArea position="bottom" />
      </div>
    </DialogContext.Provider>
  );
}

export default Home;
