---
name: code-quality-guardian
description: |
  代码质量守护者 - 确保生成的代码符合业界优秀规范。

  使用场景：
  1. 生成新代码文件前 - 检查规范要求
  2. 代码审查时 - 验证代码质量
  3. 重构代码时 - 确保符合最佳实践
  4. 配置项目规范 - 初始化 ESLint/Prettier 等

  支持语言：TypeScript/JavaScript、React、Vue、Node.js、Python

  核心能力：
  - 代码规范检查（命名、格式、结构）
  - 常见反模式识别
  - 安全漏洞检测
  - 性能优化建议
  - 自动生成配置文件
---

# Code Quality Guardian

代码质量守护者，确保所有生成的代码符合业界优秀规范。

## 核心原则

### 1. 生成前检查

每次生成代码前，先确认：

- [ ] 项目已配置的规范工具（ESLint/Prettier/等）
- [ ] 目标文件的命名规范
- [ ] 代码结构模式

### 2. 生成时遵循

代码生成必须遵循：

- **单一职责** - 每个函数/组件只做一件事
- **显式优于隐式** - 避免魔法数字、隐式依赖
- **类型安全** - TypeScript 优先，避免 `any`
- **可测试性** - 便于单元测试的代码结构

### 3. 生成后验证

代码生成后必须检查：

- [ ] 运行 `lint` 无错误
- [ ] 运行 `format` 无变化
- [ ] 运行 `type-check` 通过
- [ ] 命名符合规范

## 语言特定规范

### CSS 规范（⚠️ 重点）

#### 🚫 严禁内联 CSS

**绝对禁止：**

```jsx
// ❌ 禁止 style 属性
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

1. 动态计算的定位值（拖拽位置）
2. 第三方库强制要求
3. CSS 变量动态设置

详见 [CSS 风格指南](references/css-style-guide.md)

---

### TypeScript/React

#### 命名规范

```
文件夹: kebab-case (components, utils)
组件文件: PascalCase (UserProfile.tsx)
工具文件: camelCase (formatDate.ts)
常量: SCREAMING_SNAKE_CASE (MAX_RETRY_COUNT)
类型/接口: PascalCase (UserInfo)
枚举: PascalCase + 大写下划线 (StatusCode)
函数: camelCase + 动词开头 (getUserInfo)
布尔值: is/has/should 前缀 (isLoading)
事件处理: handle 前缀 (handleClick)
自定义 Hook: use 前缀 (useAuth)
```

#### 文件结构

```typescript
// 1. 导入（按类型分组）
import React from 'react'; // 第三方
import { useAuth } from '@/hooks'; // 内部绝对路径
import { helper } from './utils'; // 内部相对路径

// 2. 类型定义
interface Props {
  userId: string;
}

// 3. 常量
const MAX_RETRY = 3;

// 4. 组件/函数
export function UserCard({ userId }: Props) {
  // 实现
}

// 5. 默认导出（如需要）
export default UserCard;
```

#### 禁止事项

❌ 不要使用：

- `any` 类型（使用 `unknown` 或具体类型）
- 魔法数字（提取为常量）
- 嵌套超过 3 层的条件语句
- 超过 100 行的函数
- 隐式返回（除了简单箭头函数）
- `console.log`（使用日志库）

#### 推荐模式

✅ 使用：

- 早期返回替代嵌套 if
- 解构赋值
- 可选链操作符 `?.`
- 空值合并运算符 `??`
- 类型守卫函数

### Node.js/后端

#### API 设计

```typescript
// RESTful 命名
GET    /api/users           // 列表
GET    /api/users/:id       // 详情
POST   /api/users           // 创建
PUT    /api/users/:id       // 全量更新
PATCH  /api/users/:id       // 部分更新
DELETE /api/users/:id       // 删除

// 响应格式
interface ApiResponse<T> {
  code: number;
  data: T;
  msg: string;
}
```

#### 错误处理

```typescript
// 使用自定义错误类
class BusinessError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

// 统一错误处理中间件
app.use((err, req, res, next) => {
  if (err instanceof BusinessError) {
    return res.status(err.statusCode).json({
      code: err.code,
      msg: err.message,
    });
  }
  // 日志记录
  logger.error(err);
  res.status(500).json({ code: 'INTERNAL_ERROR', msg: '服务器内部错误' });
});
```

### Python

#### 命名规范

```python
# 模块/包: snake_case
import my_module

# 类: PascalCase
class UserManager:
    pass

# 函数/变量: snake_case
def get_user_by_id(user_id: str) -> User:
    pass

# 常量: SCREAMING_SNAKE_CASE
MAX_RETRY_COUNT = 3

# 私有: _前缀
_private_var = 1
```

#### 类型注解

```python
from typing import Optional, List, Dict

def process_data(
    items: List[Dict[str, any]],
    threshold: Optional[int] = None
) -> bool:
    """处理数据项。

    Args:
        items: 数据项列表
        threshold: 处理阈值，默认为 None

    Returns:
        处理是否成功
    """
    pass
```

## 常见反模式

### 1. 过于复杂的条件

❌ 反面示例：

```typescript
if (user && user.profile && user.profile.address && user.profile.address.city === 'Beijing') {
  // ...
}
```

✅ 正确做法：

```typescript
const isBeijingUser = user?.profile?.address?.city === 'Beijing';
if (isBeijingUser) {
  // ...
}
```

### 2. 重复代码

❌ 反面示例：

```typescript
// 多处重复相同的验证逻辑
if (!email.includes('@')) return 'Invalid email';
// ... 其他地方又写一遍
```

✅ 正确做法：

```typescript
// 提取为工具函数
function validateEmail(email: string): boolean {
  return email.includes('@');
}
```

### 3. 隐式副作用

❌ 反面示例：

```typescript
function checkUser(user) {
  if (!user.active) {
    deleteUser(user); // 隐藏的副作用！
    return false;
  }
  return true;
}
```

✅ 正确做法：

```typescript
function isUserActive(user): boolean {
  return user.active;
}

// 副作用明确分离
if (!isUserActive(user)) {
  deleteUser(user); // 副作用显式可见
}
```

## 安全检查清单

生成涉及以下内容的代码时必须检查：

### 用户输入

- [ ] 所有输入都有验证
- [ ] 防止 SQL/NoSQL 注入
- [ ] 防止 XSS（输出转义）
- [ ] 防止命令注入

### 认证授权

- [ ] Token 安全存储（httpOnly Cookie）
- [ ] 敏感操作需要二次验证
- [ ] 权限检查 middleware
- [ ] 密码加密存储（bcrypt）

### 敏感数据

- [ ] 日志中不打印敏感信息
- [ ] 错误信息不暴露内部细节
- [ ] 配置文件不提交密钥
- [ ] 使用环境变量管理密钥

## 性能检查清单

- [ ] 避免循环中的重复计算
- [ ] 大数据集使用分页
- [ ] 图片/资源使用懒加载
- [ ] API 响应有缓存策略
- [ ] 避免 N+1 查询问题
- [ ] 使用 debounce/throttle 控制频率

## 配置文件模板

参考 `assets/` 目录下的配置文件模板：

- `eslint-configs/` - 各语言 ESLint 配置
- `prettier-configs/` - Prettier 配置
- `ts-configs/` - TypeScript 配置

## 验证脚本

使用 `scripts/` 目录下的验证脚本：

- `verify-code.ts` - 代码规范验证
- `check-security.ts` - 安全检查
- `measure-complexity.ts` - 复杂度分析

## 快速检查命令

```bash
# 完整检查
npm run lint && npm run format:check && npm run type-check

# 安全检查
npx eslint . --ext .ts,.tsx --rule 'no-eval: error'

# 复杂度检查
npx complexity-report src/
```
