# 前端性能优化计划

> 创建时间: 2026-01-31  
> 负责人: 前端性能优化专家  
> 状态: 进行中

---

## 📋 项目概览

| 项目     | 值                                    |
| -------- | ------------------------------------- |
| 项目类型 | React + Vite + TypeScript 移动端商城  |
| 当前分支 | main                                  |
| 目标     | 提升首屏加载速度 30%+，优化运行时性能 |
| 预计工期 | 2-3 天                                |

---

## 🎯 优化目标

### 核心指标

| 指标                           | 当前预估 | 目标值   | 优先级 |
| ------------------------------ | -------- | -------- | ------ |
| First Contentful Paint (FCP)   | ~1.5s    | < 1.0s   | P0     |
| Largest Contentful Paint (LCP) | ~2.5s    | < 1.8s   | P0     |
| Time to Interactive (TTI)      | ~3.5s    | < 2.5s   | P1     |
| Cumulative Layout Shift (CLS)  | ~0.05    | < 0.1    | P1     |
| 运行时内存占用                 | 高       | 降低 20% | P2     |

---

## 🚨 P0 - 关键优化（立即修复）

### 1. 倒计时组件内存泄漏 ⏱️

| 字段         | 内容                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------ |
| **问题描述** | 首页秒杀倒计时使用 `setInterval`，每秒强制更新状态，即使页面在后台或组件不可见时仍继续运行 |
| **影响范围** | `src/pages/home/index.tsx`                                                                 |
| **性能影响** | 每秒触发重渲染，后台运行时浪费 CPU/电池                                                    |
| **修复方案** | 使用 `requestAnimationFrame` + Page Visibility API，后台时自动暂停                         |
| **预计工时** | 30 分钟                                                                                    |
| **状态**     | 🔴 待修复                                                                                  |

**当前代码（问题）：**

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    setCountdown(prev => { ... }); // 每秒强制重渲染
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

**优化后代码：**

```tsx
useEffect(() => {
  let rafId: number;
  let lastTime = Date.now();

  const tick = () => {
    const now = Date.now();
    if (now - lastTime >= 1000) {
      setCountdown(prev => { ... });
      lastTime = now;
    }
    rafId = requestAnimationFrame(tick);
  };

  const handleVisibility = () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else { lastTime = Date.now(); rafId = requestAnimationFrame(tick); }
  };

  document.addEventListener('visibilitychange', handleVisibility);
  rafId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(rafId);
    document.removeEventListener('visibilitychange', handleVisibility);
  };
}, []);
```

---

### 2. Scroll 事件未节流 ⏱️

| 字段         | 内容                                                |
| ------------ | --------------------------------------------------- |
| **问题描述** | 商品详情页滚动监听每帧都触发 `setState`，无节流处理 |
| **影响范围** | `src/pages/product/index.tsx`                       |
| **性能影响** | 滚动时 60fps 触发，造成卡顿和多余渲染               |
| **修复方案** | 使用 `lodash-es/throttle` 限制 100ms 触发一次       |
| **预计工时** | 20 分钟                                             |
| **状态**     | 🔴 待修复                                           |

**当前代码（问题）：**

```tsx
useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 100); // 每帧触发！
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

**优化后代码：**

```tsx
import { throttle } from 'lodash-es';

useEffect(() => {
  const handleScroll = throttle(
    () => {
      setIsScrolled(window.scrollY > 100);
    },
    100,
    { leading: false, trailing: true }
  );

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

---

### 3. Zustand Devtools 生产环境泄露 🔧

| 字段         | 内容                                               |
| ------------ | -------------------------------------------------- |
| **问题描述** | `devtools` 始终启用，生产环境也加载 Redux DevTools |
| **影响范围** | `src/store/modules/app.ts` 及所有 store            |
| **性能影响** | 增加包体积，可能泄露状态信息                       |
| **修复方案** | 仅在开发环境启用 `enabled: import.meta.env.DEV`    |
| **预计工时** | 15 分钟                                            |
| **状态**     | 🔴 待修复                                          |

**优化后代码：**

```tsx
devtools(persist(...), {
  name: StoreKey.APP,
  enabled: import.meta.env.DEV  // 仅开发环境
})
```

---

## ⚡ P1 - 构建优化（高价值）

### 4. 添加 Bundle 分析工具 📦

| 字段         | 内容                            |
| ------------ | ------------------------------- |
| **问题描述** | 无法直观了解打包产物体积分布    |
| **修复方案** | 集成 `rollup-plugin-visualizer` |
| **预计工时** | 20 分钟                         |
| **状态**     | 🟡 待实施                       |

**实施步骤：**

1. `pnpm add -D rollup-plugin-visualizer`
2. 配置 vite.config.ts
3. 添加分析脚本 `"analyze": "vite build --mode analyze"`

---

### 5. 启用 Brotli/Gzip 预压缩 📦

| 字段         | 内容                                                      |
| ------------ | --------------------------------------------------------- |
| **问题描述** | 服务器实时压缩消耗 CPU，且压缩率不如预压缩                |
| **修复方案** | 使用 `vite-plugin-compression` 预生成 `.gz` 和 `.br` 文件 |
| **预计工时** | 30 分钟                                                   |
| **状态**     | 🟡 待实施                                                 |

---

### 6. CSS 优化 📦

| 字段         | 内容                                             |
| ------------ | ------------------------------------------------ |
| **问题描述** | CSS Modules 文件总量 1197 行，可能包含未使用样式 |
| **修复方案** | 集成 `purgecss` 或 `cssnano` 深度优化            |
| **预计工时** | 40 分钟                                          |
| **状态**     | 🟡 待评估                                        |

---

## 🖼 P2 - 图片优化（首屏关键）

### 7. 图片懒加载 🖼️

| 字段         | 内容                                           |
| ------------ | ---------------------------------------------- |
| **问题描述** | 所有图片立即加载，包括视口外图片               |
| **影响范围** | 首页商品列表、分类页、购物车                   |
| **修复方案** | 使用 `loading="lazy"` 或 Intersection Observer |
| **预计工时** | 45 分钟                                        |
| **状态**     | 🟡 待实施                                      |

**实施代码：**

```tsx
// 封装懒加载图片组件
const LazyImage = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />
);
```

---

### 8. 响应式图片 🖼️

| 字段         | 内容                            |
| ------------ | ------------------------------- |
| **问题描述** | 移动端加载大图，浪费带宽        |
| **修复方案** | 使用 `srcset` 提供多尺寸图片    |
| **预计工时** | 需后端配合，30 分钟（前端部分） |
| **状态**     | 🟡 待规划                       |

---

### 9. 图片骨架屏 🖼️

| 字段         | 内容                         |
| ------------ | ---------------------------- |
| **问题描述** | 图片加载期间无占位，布局跳动 |
| **修复方案** | 添加模糊占位或骨架屏动画     |
| **预计工时** | 60 分钟                      |
| **状态**     | 🟢 待定                      |

---

## 🌐 P3 - 网络优化

### 10. 请求缓存策略 🌐

| 字段         | 内容                              |
| ------------ | --------------------------------- |
| **问题描述** | 每次请求都发网络请求，无缓存机制  |
| **修复方案** | 集成 React Query (TanStack Query) |
| **预计工时** | 2-3 小时（需重构服务层）          |
| **状态**     | 🟡 待规划                         |

**收益：**

- 自动缓存和去重
- 后台自动刷新
- 乐观更新支持

---

### 11. 接口预加载 🌐

| 字段         | 内容                                 |
| ------------ | ------------------------------------ |
| **问题描述** | 路由切换后才发起请求，等待时间长     |
| **修复方案** | React Router v6.4+ loader + prefetch |
| **预计工时** | 1-2 小时                             |
| **状态**     | 🟢 待定                              |

---

### 12. DNS 预解析 🌐

| 字段         | 内容                                             |
| ------------ | ------------------------------------------------ |
| **问题描述** | 首次请求 API 需 DNS 解析                         |
| **修复方案** | `index.html` 添加 `dns-prefetch` 和 `preconnect` |
| **预计工时** | 10 分钟                                          |
| **状态**     | 🟡 待实施                                        |

**实施代码：**

```html
<head>
  <link rel="dns-prefetch" href="https://api.yoursite.com" />
  <link rel="preconnect" href="https://api.yoursite.com" crossorigin />
</head>
```

---

## 🎨 P4 - 渲染优化

### 13. 组件 Memo 化 🎨

| 字段         | 内容                               |
| ------------ | ---------------------------------- |
| **问题描述** | 商品卡片等组件频繁重渲染           |
| **修复方案** | 使用 `React.memo` + `useMemo` 优化 |
| **预计工时** | 40 分钟                            |
| **状态**     | 🟢 待定                            |

---

### 14. 内联样式对象引用变化 🎨

| 字段         | 内容                                         |
| ------------ | -------------------------------------------- |
| **问题描述** | 内联样式每次渲染创建新对象，导致子组件重渲染 |
| **影响范围** | 分类页动态背景色等                           |
| **修复方案** | 使用 CSS 变量或 `useMemo` 缓存               |
| **预计工时** | 30 分钟                                      |
| **状态**     | 🟢 待定                                      |

---

### 15. 长列表虚拟滚动 🎨

| 字段         | 内容                                             |
| ------------ | ------------------------------------------------ |
| **问题描述** | 商品列表超过 50 项时渲染性能下降                 |
| **修复方案** | 集成 `react-window` 或 `@tanstack/react-virtual` |
| **预计工时** | 2 小时                                           |
| **状态**     | 🟢 待定（当前数据量小，暂缓）                    |

---

## 📱 P5 - 体验优化

### 16. HTML 基础优化 📱

| 字段         | 内容                                                    |
| ------------ | ------------------------------------------------------- |
| **问题描述** | `index.html` 缺少 description、theme-color 等 meta 标签 |
| **修复方案** | 完善 meta 标签，添加 SEO 和 PWA 支持                    |
| **预计工时** | 20 分钟                                                 |
| **状态**     | 🟡 待实施                                               |

**实施内容：**

```html
<meta name="description" content="xxx商城 - 优质商品，极速配送" />
<meta name="theme-color" content="#ff5000" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<link rel="apple-touch-icon" href="/icon-192x192.png" />
```

---

### 17. 首屏骨架屏 📱

| 字段         | 内容                      |
| ------------ | ------------------------- |
| **问题描述** | JS 加载前白屏，用户体验差 |
| **修复方案** | 添加 HTML/CSS 骨架屏      |
| **预计工时** | 1 小时                    |
| **状态**     | 🟢 待定                   |

---

### 18. Service Worker 缓存 📱

| 字段         | 内容                         |
| ------------ | ---------------------------- |
| **问题描述** | 无离线访问能力，重复下载资源 |
| **修复方案** | 集成 `vite-plugin-pwa`       |
| **预计工时** | 1-2 小时                     |
| **状态**     | 🟢 待定                      |

---

## 📅 实施计划

### Phase 1: 紧急修复（Day 1 - 2 小时）

| 序号 | 任务                  | 负责人 | 状态 | 完成时间   |
| ---- | --------------------- | ------ | ---- | ---------- |
| 1.1  | 修复倒计时内存泄漏    | @dev   | ✅   | 2026-01-31 |
| 1.2  | 修复 Scroll 节流问题  | @dev   | ✅   | 2026-01-31 |
| 1.3  | 关闭生产环境 Devtools | @dev   | ✅   | 2026-01-31 |
| 1.4  | 添加 DNS 预解析       | @dev   | ✅   | 2026-01-31 |
| 1.5  | HTML meta 标签优化    | @dev   | ✅   | 2026-01-31 |

### Phase 2: 构建分析（Day 1-2 - 2 小时）

| 序号 | 任务                  | 负责人 | 状态 | 完成时间   |
| ---- | --------------------- | ------ | ---- | ---------- |
| 2.1  | 添加 Bundle 分析工具  | @dev   | ✅   | 2026-01-31 |
| 2.2  | 运行分析，识别大包    | @dev   | 🟡   | -          |
| 2.3  | 按需加载 Antd Mobile  | @dev   | 🟡   | -          |
| 2.4  | 启用 Gzip/Brotli 压缩 | @dev   | ✅   | 2026-01-31 |

### Phase 3: 图片优化（Day 2 - 3 小时）

| 序号 | 任务                      | 负责人 | 状态 | 完成时间   |
| ---- | ------------------------- | ------ | ---- | ---------- |
| 3.1  | 实现图片懒加载组件        | @dev   | ✅   | 2026-01-31 |
| 3.2  | 替换所有 img 为 LazyImage | @dev   | ✅   | 2026-01-31 |
| 3.3  | 添加图片骨架屏            | @dev   | ✅   | 2026-01-31 |
| 3.4  | 规划响应式图片方案        | @dev   | 🟢   | -          |

### Phase 4: 数据层优化（Day 2-3 - 4 小时）

| 序号 | 任务             | 负责人 | 状态 | 完成时间   |
| ---- | ---------------- | ------ | ---- | ---------- |
| 4.1  | 集成 React Query | @dev   | ✅   | 2026-01-31 |
| 4.2  | 重构 HTTP 层缓存 | @dev   | ✅   | 2026-01-31 |
| 4.3  | 实现接口预加载   | @dev   | 🟢   | -          |

### Phase 5: 渲染优化（Day 3 - 3 小时）

| 序号 | 任务         | 负责人 | 状态 | 完成时间   |
| ---- | ------------ | ------ | ---- | ---------- |
| 5.1  | 组件 Memo 化 | @dev   | ✅   | 2026-01-31 |
| 5.2  | 内联样式优化 | @dev   | 🟢   | -          |
| 5.3  | 虚拟滚动评估 | @dev   | 🟢   | -          |
| 5.4  | 首屏骨架屏   | @dev   | 🟢   | -          |

### Phase 6: PWA（Day 3 - 2 小时）

| 序号 | 任务                  | 负责人 | 状态 | 完成时间 |
| ---- | --------------------- | ------ | ---- | -------- |
| 6.1  | 集成 vite-plugin-pwa  | @dev   | 🟢   | -        |
| 6.2  | 配置 Service Worker   | @dev   | 🟢   | -        |
| 6.3  | 添加 Web App Manifest | @dev   | 🟢   | -        |

---

## ✅ 验收标准

### 性能指标

- [ ] Lighthouse Performance 评分 > 90
- [ ] FCP < 1.0s
- [ ] LCP < 1.8s
- [ ] TTI < 2.5s
- [ ] 包体积减少 > 20%

### 代码质量

- [ ] 无内存泄漏（通过 Chrome DevTools Memory 验证）
- [ ] 滚动帧率 > 55fps
- [ ] 无控制台警告

---

## 📝 更新记录

| 日期       | 版本 | 更新内容                                              | 更新人              |
| ---------- | ---- | ----------------------------------------------------- | ------------------- |
| 2026-01-31 | v1.0 | 初始文档创建                                          | @performance-expert |
| 2026-01-31 | v1.1 | Phase 1-2 完成：内存泄漏修复、Bundle 分析、压缩       | @performance-expert |
| 2026-01-31 | v1.2 | Phase 3-5 完成：图片懒加载、React Query、组件 Memo 化 | @performance-expert |

---

## 📚 参考链接

- [Web Vitals](https://web.dev/vitals/)
- [React 性能优化](https://react.dev/learn/thinking-in-react)
- [Vite 性能优化](https://vitejs.dev/guide/performance.html)
