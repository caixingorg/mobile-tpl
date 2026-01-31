/*
 * @Author: flynn
 * @Date: 2024-03-29 16:13:37
 * @description: login
 */
import { useNavigate, useSearchParams, useSubmit } from 'react-router-dom';
import { NavBar, Form, Input, Button, Space, Toast, SafeArea, Card, Divider } from 'antd-mobile';

import { useState } from 'react';

import { useSettings } from '@/store';
import styles from './index.module.css';

function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const submit = useSubmit();
  const { theme, SET_THEME } = useSettings();

  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryA = params.get('a');

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    SET_THEME(newTheme);
    Toast.show({
      icon: 'success',
      content: `已切换至${newTheme === 'light' ? '浅色' : '深色'}主题`,
    });
  };

  // 登录处理
  const handleLogin = async () => {
    try {
      // 验证表单
      await form.validateFields();
      setLoading(true);
      // 模拟登录请求
      setTimeout(() => {
        const token = 'test-tokentokentokentokentokentokentokentokentokentokentokentokentoken';
        submit({ token, redirectTo: params.get('from') || '/' }, { method: 'post', replace: true });
        Toast.show({
          icon: 'success',
          content: '登录成功',
        });
      }, 800);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* 安全区域 */}
      <SafeArea position="top" />

      {/* 导航栏 */}
      <NavBar
        onBack={() => navigate('/')}
        right={
          <Button size="small" fill="none" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>
        }
      >
        登录
      </NavBar>

      {/* 登录表单区域 */}
      <div className={styles.formWrapper}>
        {/* Logo 区域 */}
        <div className={styles.logoSection}>
          <div className={styles.logoBox}>
            <span className={styles.logoText}>App</span>
          </div>
          <h3 className={styles.welcomeTitle}>欢迎回来</h3>
          <p className={styles.welcomeSubtitle}>请登录您的账号继续使用</p>
        </div>

        {/* 查询参数提示（如果有） */}
        {queryA && (
          <Card className={styles.queryCard}>
            <span className={styles.queryText}>
              查询参数: <span className={styles.queryValue}>a = {queryA}</span>
            </span>
          </Card>
        )}

        {/* 登录表单 */}
        <Card>
          <Form
            form={form}
            layout="vertical"
            initialValues={{ username: '', password: '' }}
            footer={
              <Button
                block
                type="submit"
                color="primary"
                size="large"
                loading={loading}
                onClick={handleLogin}
                className={styles.loginButton}
              >
                登 录
              </Button>
            }
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' },
              ]}
            >
              <Input placeholder="请输入用户名" clearable />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
              ]}
            >
              <Input placeholder="请输入密码" clearable type={visible ? 'text' : 'password'} />
              <div className={styles.passwordToggle}>
                <Button size="small" fill="none" onClick={() => setVisible(!visible)}>
                  {visible ? '隐藏密码' : '显示密码'}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>

        {/* 其他登录方式 */}
        <div className={styles.socialLoginSection}>
          <Divider>其他登录方式</Divider>
          <Space justify="center" block>
            <Button className={styles.socialButtonWechat}>微</Button>
            <Button className={styles.socialButtonQQ}>Q</Button>
            <Button className={styles.socialButtonPhone}>手</Button>
          </Space>
        </div>

        {/* 底部链接 */}
        <div className={styles.footerSection}>
          <Space>
            <Button fill="none" size="small" className={styles.footerButtonDefault}>
              忘记密码?
            </Button>
            <Divider direction="vertical" />
            <Button fill="none" size="small" className={styles.footerButtonPrimary}>
              注册账号
            </Button>
          </Space>
        </div>
      </div>

      <SafeArea position="bottom" />
    </div>
  );
}

export default Login;
