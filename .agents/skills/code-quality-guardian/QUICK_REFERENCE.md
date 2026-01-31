# Code Quality Guardian - 快速参考

## 🎨 CSS 规范（重要！）

### 🚫 严禁内联 CSS

**绝对禁止：**

```jsx
// ❌ 禁止！
<div style={{ color: 'red', marginTop: '10px' }}>
<div style="color: red; margin-top: 10px;">
```

**正确做法：**

```jsx
// ✅ CSS Modules
import styles from './Button.module.css';
<button className={styles.primary}>

// ✅ Tailwind
<button className="bg-blue-500 text-white px-4 py-2">

// ✅ 动态类名
<button className={isActive ? styles.active : styles.default}>
```

**唯一例外（需注释说明）：**

```jsx
// ALLOW-INLINE: 动态定位
<div style={{ transform: `translate(${x}px, ${y}px)` }}>
```

### CSS 命名规范

| 类型   | BEM 方案             | Tailwind                           |
| ------ | -------------------- | ---------------------------------- |
| 组件   | .user-card           | className="bg-white rounded-lg"    |
| 元素   | .user-card\_\_avatar | className="w-10 h-10 rounded-full" |
| 修饰符 | .user-card--active   | className="ring-2 ring-blue-500"   |

### CSS 属性排序

```css
.example {
  /* 1. 定位 */ position, top, left, z-index
  /* 2. 盒模型 */ display, width, height, margin, padding
  /* 3. 边框 */ border, border-radius
  /* 4. 背景 */ background-color, background-image
  /* 5. 文字 */ color, font-size, line-height
  /* 6. 其他 */ opacity, transform, transition
  /* 7. 动画 */ animation
}
```

---

## 命名速查表

| 类型        | 规范                 | 示例                      |
| ----------- | -------------------- | ------------------------- |
| 组件文件    | PascalCase.tsx       | UserProfile.tsx           |
| 工具文件    | camelCase.ts         | formatDate.ts             |
| 类型/接口   | PascalCase           | UserInfo, ApiResponse     |
| 类          | PascalCase           | UserManager               |
| 函数        | camelCase + 动词     | getUserInfo, handleClick  |
| 常量        | SCREAMING_SNAKE_CASE | MAX_RETRY_COUNT           |
| 布尔值      | is/has/should 前缀   | isLoading, hasError       |
| 自定义 Hook | use 前缀             | useAuth, useLocalStorage  |
| 事件处理    | handle 前缀          | handleSubmit, handleClick |

## 禁止清单

❌ **永远不要**

- 使用 `any` 类型（使用 `unknown` 或具体类型）
- 使用魔法数字（提取为常量）
- 函数超过 100 行
- 嵌套超过 3 层
- 使用 `console.log`（使用日志库）
- 提交敏感密钥到代码库

## 推荐模式

✅ **总是使用**

- 早期返回替代嵌套 if
- 解构赋值
- 可选链操作符 `?.`
- 空值合并运算符 `??`
- 类型守卫函数
- 单一职责原则

## 安全检查

生成涉及以下内容时必须检查：

- [ ] 用户输入已验证
- [ ] 防 SQL/NoSQL 注入
- [ ] 防 XSS（输出转义）
- [ ] 敏感数据不在日志中
- [ ] Token 安全存储

## 验证命令

```bash
# 完整检查
./scripts/verify-code.sh

# 或分别运行
npm run lint
npm run format:check
npm run type-check
npm run build
```

## 配置文件模板

```bash
# 复制到项目根目录
cp assets/eslint-configs/typescript-react.cjs .eslintrc.cjs
cp assets/prettier-configs/default.json .prettierrc
cp assets/tsconfig/react.json tsconfig.json
```

## 代码生成检查清单

### 生成前

- [ ] 了解项目命名规范
- [ ] 确认类型定义位置
- [ ] 明确错误处理要求

### 生成时

- [ ] 使用具体类型（避免 any）
- [ ] 函数不超过 50 行
- [ ] 添加适当的注释

### 生成后

- [ ] 运行 lint 无错误
- [ ] 运行 format:check 通过
- [ ] 运行 type-check 通过
- [ ] 运行 build 成功

## 快速修复

```bash
# 自动修复 ESLint 问题
npm run lint:fix

# 自动格式化代码
npm run format

# 查看 any 使用情况
grep -r "any" src --include="*.ts" --include="*.tsx"

# 检查内联 CSS
./.agents/skills/code-quality-guardian/scripts/check-inline-css.sh

# 查看内联样式位置
grep -r 'style={{[^}]*}}' src --include="*.tsx" --include="*.jsx"
```

## 参考文档

- [TypeScript 风格指南](references/typescript-style-guide.md)
- [代码审查清单](references/code-review-checklist.md)
- [SKILL.md](SKILL.md) - 完整技能说明
