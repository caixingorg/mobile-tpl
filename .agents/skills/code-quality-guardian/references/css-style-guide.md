# CSS 代码风格指南

## 核心原则

### 🚫 严禁内联 CSS

**绝对禁止在以下地方写 CSS：**

❌ **HTML/JSX 中的 style 属性**

```jsx
// 严格禁止！
<div style={{ color: 'red', marginTop: '10px' }}>
<div style="color: red; margin-top: 10px;">
```

❌ **JavaScript 中动态生成 style 字符串**

```javascript
// 严格禁止！
element.style.cssText = 'color: red; margin-top: 10px;';
element.setAttribute('style', 'color: red;');
```

❌ **CSS-in-JS 的内联对象**

```jsx
// 严格禁止！
const styles = { color: 'red', marginTop: '10px' };
<div css={styles}>
```

✅ **正确做法 - 使用 CSS 类**

```jsx
// 使用 CSS Modules
import styles from './Button.module.css';
<button className={styles.primary}>

// 或使用 Tailwind
<button className="bg-blue-500 text-white px-4 py-2">

// 或使用 CSS 变量
<button className={classNames('btn', { 'btn-active': isActive })}>
```

### 唯一例外

以下情况**允许**使用内联样式：

1. **动态计算的定位值**（如拖拽位置）

```jsx
// 允许 - 动态定位
div style={{ transform: `translate(${x}px, ${y}px)` }}
```

2. **第三方库要求的样式**（如地图、图表库）

```jsx
// 允许 - 第三方库需要
<Chart style={{ width: '100%', height: '400px' }} />
```

3. **CSS 变量动态设置**（非直接样式）

```jsx
// 允许 - CSS 变量
<div style={{ '--theme-color': dynamicColor }}>
```

**注意**：即使允许的情况，也必须添加注释说明原因。

---

## 命名规范

### BEM 命名法（推荐用于纯 CSS 项目）

```css
/* Block */
.card {
}

/* Element */
.card__header {
}
.card__body {
}
.card__footer {
}

/* Modifier */
.card--large {
}
.card--primary {
}
.card__title--highlight {
}
```

**规则：**

- **Block**：组件名，使用 kebab-case（.user-card）
- **Element**：元素名，双下划线连接（.user-card\_\_avatar）
- **Modifier**：修饰符，双横线连接（.user-card--active）

### Tailwind 类名组织（推荐用于 Tailwind 项目）

```jsx
// 按类别排序：布局 → 间距 → 尺寸 → 外观 → 交互
<button
  className="
    /* 布局 */
    flex items-center justify-center
    /* 间距 */
    px-4 py-2 mt-2
    /* 尺寸 */
    w-full h-10
    /* 外观 */
    bg-blue-500 text-white rounded-lg
    /* 交互 */
    hover:bg-blue-600 focus:ring-2
  "
>
  提交
</button>
```

**规则：**

1. 按类别分组
2. 同类属性按字母排序
3. 复杂的类名使用 clsx 或 classnames 管理

### CSS Modules 命名

```css
/* Button.module.css */
/* 使用 camelCase，便于 JS 中访问 */
.primary {
}
.secondary {
}
.large {
}
.disabled {
}
```

```jsx
// Button.tsx
import styles from './Button.module.css';

<button className={classNames(styles.primary, styles.large)}>
```

---

## 文件组织

### 文件命名

```
全局样式: styles/global.css 或 styles/index.css
组件样式: ComponentName.module.css
页面样式: page-name.module.css
工具类: styles/utilities.css
变量: styles/variables.css
主题: styles/theme.css
```

### 目录结构

```
src/
├── styles/
│   ├── index.css          # 全局入口
│   ├── variables.css      # CSS 变量
│   ├── utilities.css      # 工具类
│   └── mixins.css         # SCSS/Less mixins
├── components/
│   ├── Button/
│   │   ├── index.tsx
│   │   └── Button.module.css  # 组件样式紧邻组件
│   └── Card/
│       ├── index.tsx
│       └── Card.module.css
└── pages/
    ├── Home/
    │   ├── index.tsx
    │   └── Home.module.css
```

---

## 代码规范

### 选择器规范

```css
/* ✅ 正确 - 使用类选择器 */
.btn-primary {
}

/* ❌ 错误 - 不要使用 ID 选择器 */
#submit-button {
}

/* ❌ 错误 - 不要使用元素选择器 */
div {
}
button {
}

/* ❌ 错误 - 不要使用深层嵌套 */
.card .header .title span {
}

/* ✅ 正确 - 最多 3 层嵌套 */
.card__header__title {
}
```

### 属性排序

```css
.example {
  /* 1. 定位 */
  position: relative;
  top: 0;
  left: 0;
  z-index: 10;

  /* 2. 盒模型 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  margin: 0;
  padding: 16px;

  /* 3. 边框 */
  border: 1px solid #ccc;
  border-radius: 8px;

  /* 4. 背景 */
  background-color: #fff;
  background-image: url(...);

  /* 5. 文字 */
  color: #333;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;

  /* 6. 其他 */
  opacity: 1;
  transform: none;
  transition: all 0.3s ease;

  /* 7. 动画 */
  animation: fadeIn 0.3s ease;
}
```

### CSS 变量使用

```css
/* styles/variables.css */
:root {
  /* 颜色 */
  --color-primary: #1890ff;
  --color-success: #52c41a;
  --color-warning: #faad14;
  --color-error: #f5222d;
  --color-text-primary: rgba(0, 0, 0, 0.85);
  --color-text-secondary: rgba(0, 0, 0, 0.65);
  --color-bg-base: #f0f2f5;

  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  /* 阴影 */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.15);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.15);
}
```

```css
/* 使用变量 */
.btn-primary {
  background-color: var(--color-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}
```

---

## 最佳实践

### 1. 移动端适配

```css
/* ✅ 使用 rem 或 viewport 单位 */
.container {
  width: 100vw;
  padding: 0.16rem; /* 基于根字体大小 */
}

/* ❌ 不要写死 px */
.container {
  width: 375px;
}
```

### 2. 响应式设计

```css
/* 移动优先 */
.card {
  width: 100%;
  padding: 16px;
}

/* 平板 */
@media (min-width: 768px) {
  .card {
    width: 50%;
    padding: 24px;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .card {
    width: 33.33%;
    padding: 32px;
  }
}
```

### 3. 性能优化

```css
/* ✅ 使用 will-change 谨慎 */
.animated-element {
  will-change: transform; /* 动画前添加 */
}

.animation-end {
  will-change: auto; /* 动画后移除 */
}

/* ✅ 使用 transform 替代位置属性 */
.moving-element {
  transform: translateX(100px); /* GPU 加速 */
}

/* ❌ 避免 */
.moving-element {
  left: 100px; /* 触发重排 */
}
```

### 4. 可访问性

```css
/* ✅ 焦点样式 */
.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ✅ 减少动画（尊重用户偏好） */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* ✅ 足够的颜色对比度 */
.text-primary {
  color: #333; /* 对比度 > 4.5:1 */
}
```

---

## 禁止事项

```css
/* ❌ !important 地狱 */
.element {
  color: red !important;
}

/* ❌ 行高不写单位 */
.element {
  line-height: 1.5; /* ✅ 正确 */
  line-height: 15px; /* 避免 */
}

/* ❌ 魔术数字 */
.element {
  margin-top: 37px; /* 没有意义的数字 */
}

/* ❌ 过度特定 */
body div.container > div.content p.text span {
  /* 太长了！ */
}

/* ❌ 空规则 */
.element {
}

/* ❌ 浏览器前缀（使用 autoprefixer） */
.element {
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
```

---

## 工具推荐

### 检查工具

```bash
# Stylelint - CSS 代码检查
npm install -D stylelint stylelint-config-standard

# 检查 CSS 语法
npx stylelint "src/**/*.css"
```

### Stylelint 配置

```json
// .stylelintrc.json
{
  "extends": ["stylelint-config-standard"],
  "rules": {
    "selector-class-pattern": "^[a-z][a-zA-Z0-9_-]+$",
    "no-empty-source": true,
    "declaration-empty-line-before": null
  }
}
```

---

## 代码审查清单

### CSS 文件

- [ ] 使用类选择器，非 ID/元素选择器
- [ ] 无内联样式（除了允许的例外）
- [ ] 属性按规范排序
- [ ] 无 !important（除非必要且有注释）
- [ ] 使用 CSS 变量管理主题值
- [ ] 响应式断点一致

### JSX 文件

- [ ] 无 style 属性
- [ ] 类名有意义且符合命名规范
- [ ] 复杂的类名逻辑使用 classnames/clsx
- [ ] 动态样式使用 CSS 类切换

### 性能

- [ ] 无过多嵌套（最多 3 层）
- [ ] 动画使用 transform/opacity
- [ ] 图片有适当尺寸

### 可访问性

- [ ] 焦点样式可见
- [ ] 颜色对比度足够
- [ ] 支持 prefers-reduced-motion
