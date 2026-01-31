# TypeScript 代码风格指南

## 目录

1. [命名规范](#命名规范)
2. [类型系统](#类型系统)
3. [函数设计](#函数设计)
4. [类与接口](#类与接口)
5. [React 特定规范](#React-特定规范)
6. [导入导出](#导入导出)
7. [错误处理](#错误处理)
8. [测试规范](#测试规范)

## 命名规范

### 文件命名

```
组件: PascalCase.tsx (UserProfile.tsx)
工具: camelCase.ts (formatDate.ts)
常量: camelCase.ts (constants.ts)
类型: PascalCase.ts 或 types.ts
测试: *.test.ts 或 *.spec.ts
```

### 代码命名

```typescript
// 变量 - camelCase
const userName = 'John';
let retryCount = 0;

// 常量 - SCREAMING_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// 函数 - camelCase + 动词开头
function getUserInfo() {}
const handleClick = () => {};

// 类型/接口 - PascalCase
interface UserInfo {}
type Status = 'active' | 'inactive';

// 类 - PascalCase
class UserManager {}

// 枚举 - PascalCase + 大写下划线
enum HttpStatusCode {
  OK = 200,
  NOT_FOUND = 404,
}

// 布尔值 - is/has/should 前缀
const isLoading = true;
const hasError = false;
const shouldRetry = true;

// 事件处理 - handle 前缀
const handleSubmit = () => {};
const handleInputChange = () => {};

// 自定义 Hook - use 前缀
const useAuth = () => {};
const useLocalStorage = () => {};
```

## 类型系统

### 优先使用具体类型

❌ 避免：

```typescript
function process(data: any) {}
const user: any = fetchUser();
```

✅ 推荐：

```typescript
interface User {
  id: string;
  name: string;
}

function process(data: User) {}
const user: User = fetchUser();
```

### 使用 unknown 替代 any

```typescript
// 需要类型断言时
function process(data: unknown) {
  if (typeof data === 'string') {
    // TypeScript 知道这里是 string
    return data.toUpperCase();
  }
}
```

### 类型守卫

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value && 'name' in value;
}
```

### 泛型命名

```typescript
// 单字母用于简单场景
function identity<T>(arg: T): T {
  return arg;
}

// 描述性名称用于复杂场景
interface ApiResponse<DataType, ErrorType> {
  data: DataType;
  error?: ErrorType;
}
```

## 函数设计

### 单一职责

❌ 避免：

```typescript
function processUser(user: User) {
  validateUser(user);
  saveToDatabase(user);
  sendEmail(user);
  updateCache(user);
}
```

✅ 推荐：

```typescript
function validateUser(user: User): boolean {
  // 只负责验证
}

async function saveUser(user: User): Promise<void> {
  // 只负责保存
}

// 组合使用
async function processUser(user: User) {
  if (!validateUser(user)) {
    throw new Error('Invalid user');
  }
  await saveUser(user);
}
```

### 参数对象模式

```typescript
// 参数过多时使用对象
interface CreateUserOptions {
  name: string;
  email: string;
  age?: number;
  role?: string;
}

function createUser(options: CreateUserOptions) {
  const { name, email, age = 18, role = 'user' } = options;
  // ...
}

// 调用清晰
createUser({
  name: 'John',
  email: 'john@example.com',
  age: 25,
});
```

### 早期返回

```typescript
// 避免深层嵌套
function processData(data: Data | null) {
  if (!data) {
    return null;
  }

  if (!data.isValid) {
    return null;
  }

  // 主逻辑
  return transform(data);
}
```

### 默认参数

```typescript
// 使用默认参数替代条件判断
function greet(name: string, greeting = 'Hello') {
  return `${greeting}, ${name}!`;
}

// 替代
function greet(name: string, greeting?: string) {
  const actualGreeting = greeting ?? 'Hello';
  return `${actualGreeting}, ${name}!`;
}
```

## 类与接口

### 优先使用接口

```typescript
// 定义对象形状时优先使用 interface
interface User {
  id: string;
  name: string;
  email: string;
}

// 需要联合类型时使用 type
type Status = 'active' | 'inactive' | 'pending';
type UserOrNull = User | null;
```

### 访问修饰符

```typescript
class UserManager {
  // 私有属性
  private users: User[] = [];

  // 受保护属性（子类可访问）
  protected logger: Logger;

  // 公共方法
  public addUser(user: User): void {
    this.validateUser(user);
    this.users.push(user);
  }

  // 私有方法
  private validateUser(user: User): boolean {
    return !!user.id && !!user.email;
  }
}
```

### 只读属性

```typescript
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

class ImmutablePoint {
  constructor(
    readonly x: number,
    readonly y: number
  ) {}
}
```

## React 特定规范

### 组件定义

```typescript
// 函数组件 + 显式返回类型
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

export function UserCard({ user, onEdit }: UserCardProps): JSX.Element {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      {onEdit && (
        <button onClick={() => onEdit(user)}>Edit</button>
      )}
    </div>
  );
}

// 默认导出
export default UserCard;
```

### Hooks 规范

```typescript
// 自定义 Hook
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// 使用
const [name, setName] = useLocalStorage('name', '');
```

### 事件处理

```typescript
// 显式定义事件类型
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
  // ...
}

function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
  const value = event.target.value;
  // ...
}

function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  // ...
}
```

## 导入导出

### 导入顺序

```typescript
// 1. React/框架核心
import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';

// 2. 第三方库
import axios from 'axios';
import { format } from 'date-fns';

// 3. 内部绝对路径
import { Button } from '@/components';
import { useAuth } from '@/hooks';
import { api } from '@/services';

// 4. 内部相对路径
import { helper } from './utils';
import styles from './styles.module.css';
```

### 导出规范

```typescript
// 命名导出（推荐）
export function helper() {}
export const CONSTANTS = {};
export type User = {};

// 默认导出（一个文件一个）
export default Component;

// 重新导出
export { helper } from './utils';
export * from './types';
export type { User } from './models';
```

## 错误处理

### 使用 Result 模式

```typescript
type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

function parseJSON(json: string): Result<unknown> {
  try {
    return { success: true, data: JSON.parse(json) };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// 使用
const result = parseJSON(userJson);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### 自定义错误类

```typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}
```

## 测试规范

### 测试文件命名

```
组件测试: ComponentName.test.tsx
工具测试: utils.test.ts
E2E 测试: *.spec.ts
```

### 测试结构

```typescript
import { render, screen } from '@testing-library/react';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John',
    email: 'john@example.com',
  };

  it('should render user name', () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('should call onEdit when edit button clicked', () => {
    const onEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={onEdit} />);

    screen.getByText('Edit').click();

    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

## 代码审查清单

### 提交前自检

- [ ] 所有代码都有适当的类型注解
- [ ] 没有使用 `any` 类型（除非必要且有注释）
- [ ] 函数长度不超过 50 行
- [ ] 没有嵌套超过 3 层的代码
- [ ] 所有魔法数字都有常量定义
- [ ] 命名清晰表达意图
- [ ] 测试覆盖率达标

### 常见代码异味

- [ ] 重复代码（DRY 原则）
- [ ] 过长的参数列表（>3 个参数考虑使用对象）
- [ ] 过深的嵌套（考虑提前返回）
- [ ] 注释掉的代码（应该删除）
- [ ] TODO 注释（应该有对应的 Issue）
