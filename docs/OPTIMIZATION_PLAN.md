# React Mobile Template 渐进式优化计划

## 📋 计划概述

本计划采用**增量式优化策略**，将优化任务分为 5 个阶段，每个阶段：

- ✅ 独立可验证
- ✅ 可随时回滚
- ✅ 有明确的检查点
- ⏱️ 类型安全放到最后阶段

---

## 🗂️ 阶段规划

```
阶段 1: 工程化基础建设（Week 1）
    ↓ 验证通过
阶段 2: 代码规范与风格统一（Week 1-2）
    ↓ 验证通过
阶段 3: 核心架构简化（Week 2-3）
    ↓ 验证通过
阶段 4: 性能与安全问题修复（Week 3-4）
    ↓ 验证通过
阶段 5: 类型安全完善（Week 4-5）
```

---

## 📝 备份策略

### 自动备份脚本

创建 `scripts/backup.sh`：

```bash
#!/bin/bash

# 备份脚本
BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${TIMESTAMP}"

# 创建备份目录
mkdir -p ${BACKUP_DIR}

# 创建压缩备份
git archive --format=tar.gz --output=${BACKUP_DIR}/${BACKUP_NAME}.tar.gz HEAD

echo "✅ 备份完成: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
```

### 每个阶段开始前的操作

```bash
# 1. 确保所有修改已提交
git add .
git commit -m "checkpoint: 阶段 X 开始前状态"

# 2. 创建备份分支
git branch backup/before-stage-X

# 3. 创建备份压缩包
chmod +x scripts/backup.sh
./scripts/backup.sh
```

### 回滚方案

```bash
# 方案 1: 使用 Git 回滚
git reset --hard backup/before-stage-X

# 方案 2: 使用备份压缩包
tar -xzf backups/backup_YYYYMMDD_HHMMSS.tar.gz -C ./restore

# 方案 3: 使用 git reflog
git reflog  # 查看历史
git reset --hard HEAD@{n}  # 回滚到指定版本
```

---

## 阶段 1: 工程化基础建设

### 目标

建立完整的工程化基础设施，为后续优化奠定基础。

### 任务清单

#### 1.1 添加 Prettier 配置

**文件：** `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

**文件：** `.prettierignore`

```
node_modules
dist
*.lock
*.log
.DS_Store
coverage
```

#### 1.2 添加 EditorConfig

**文件：** `.editorconfig`

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,jsx,ts,tsx,json}]
indent_style = space
indent_size = 2
max_line_length = 100

[*.{css,less,scss}]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

#### 1.3 配置 Husky + lint-staged

```bash
# 安装依赖
pnpm add -D husky lint-staged

# 初始化 husky
npx husky init
```

**文件：** `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 正在检查代码..."
npx lint-staged
```

**文件：** `.husky/commit-msg`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "📝 检查提交信息..."
npx --no-install commitlint --edit "$1"
```

**修改：** `package.json`

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix --max-warnings 0", "prettier --write"],
    "*.{css,less,scss}": ["prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

#### 1.4 添加 Commitlint

```bash
pnpm add -D @commitlint/config-conventional @commitlint/cli
```

**文件：** `commitlint.config.js`

```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复
        'docs', // 文档
        'style', // 格式（不影响代码运行的变动）
        'refactor', // 重构
        'perf', // 性能优化
        'test', // 测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回滚
        'build', // 构建
        'ci', // CI配置
      ],
    ],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
  },
};
```

#### 1.5 添加验证脚本

**修改：** `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:sit": "tsc && vite build --mode sit",
    "build:prod": "tsc && vite build --mode production",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,less,json,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,less,json,md}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "prepare": "husky"
  }
}
```

### 验证清单

- [ ] `pnpm format` 能正常格式化代码
- [ ] `pnpm lint` 无错误
- [ ] `pnpm type-check` 通过
- [ ] 提交代码时自动触发 lint-staged
- [ ] 提交信息不规范时被阻止

### 检查点

```bash
# 验证命令
pnpm run format:check
pnpm run lint
pnpm run type-check

# Git 钩子测试
git add .
git commit -m "test: verify husky works"
# 预期：如果提交信息不规范应该被阻止
```

---

## 阶段 2: 代码规范与风格统一

### 目标

统一代码风格，移除冗余代码，修复明显错误。

### 任务清单

#### 2.1 精简 ESLint 配置

**备份原配置：**

```bash
cp .eslintrc.cjs .eslintrc.cjs.bak
```

**新配置：** `.eslintrc.cjs`

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier', // 必须放最后
  ],
  ignorePatterns: ['dist', 'node_modules', '*.config.*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react-refresh', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // React
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/prop-types': 'off',

    // TypeScript
    '@typescript-eslint/no-explicit-any': 'off', // 阶段 5 再处理
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
      },
    ],

    // 基础规则
    'no-console': 'off', // 允许 console，但生产环境会移除
    'no-debugger': 'error',
    'no-unused-vars': 'off', // 使用 TS 规则

    // 风格规则（主要由 Prettier 处理）
    quotes: 'off',
    semi: 'off',
    indent: 'off',
  },
};
```

#### 2.2 修复拼写错误

**修改：** `.env.development`, `.env.production`, `.env.sit`

```diff
- VITE_APP_SERVE_URl
+ VITE_APP_SERVE_URL
```

**修改：** `vite.config.ts`

```diff
- target: env.VITE_APP_SERVE_URl,
+ target: env.VITE_APP_SERVE_URL,
```

#### 2.3 格式化所有代码

```bash
# 格式化全部代码
pnpm run format

# 检查 ESLint
pnpm run lint:fix
```

#### 2.4 统一文件命名

**重命名文件夹：**

```bash
# 组件文件夹统一使用 PascalCase
mv src/components/Popups src/components/popups
mv src/components/Test src/components/test
```

**更新引用：**

```typescript
// 修改所有导入路径
import PopTest from '@/components/popups/PopTest';
```

### 验证清单

- [ ] `pnpm lint` 无错误
- [ ] `pnpm build` 成功
- [ ] `pnpm dev` 正常启动
- [ ] 所有页面能正常访问

### 检查点

```bash
# 构建验证
pnpm run build

# 开发环境验证
pnpm run dev
# 访问 http://localhost:7788 检查是否正常
```

---

## 阶段 3: 核心架构简化

### 目标

简化过度设计的模块，提升代码可维护性。

### 任务清单

#### 3.1 简化 Axios 封装

**备份：**

```bash
cp src/axios/index.ts src/axios/index.ts.bak
```

**新实现：** `src/axios/index.ts`

```typescript
/*
 * Axios 封装 - 简化版
 */
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import qs from 'qs';
import { cancelRequest } from './requestCancel';
import ErrorCodeHandle from './requestCode';
import { useAppStore } from '@/store';

/** 不需要处理异常白名单 */
const whiteList: string[] = ['/qiniu/upload/uptoken'];

// 创建实例
const service = axios.create({
  timeout: 20000,
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

// 请求拦截
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAppStore.getState().token;
    if (token) {
      config.headers['token'] = token;
    }
    cancelRequest.addPending(config);
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const url = response.config.url ?? '';
    cancelRequest.removePending(response.config);

    if (!whiteList.some(e => url.match(e))) {
      ErrorCodeHandle(response);
    }

    if (response.data.code === 200) {
      return response;
    }
    return Promise.reject(response);
  },
  (error: AxiosError) => {
    if (error.code === 'ERR_CANCELED') {
      console.log('请求取消:', error.config?.url);
      return Promise.reject(error);
    }
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.error('请求超时');
    }
    return Promise.reject(error);
  }
);

// 简化的请求方法
export const request = {
  get: <T>(url: string, params?: object) =>
    service.get<Res.ResponseRes<T>>(url, { params }).then(res => res.data),

  post: <T>(url: string, data?: object) =>
    service.post<Res.ResponseRes<T>>(url, data).then(res => res.data),

  postForm: <T>(url: string, params?: object) =>
    service
      .post<Res.ResponseRes<T>>(url, qs.stringify(params), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      })
      .then(res => res.data),

  put: <T>(url: string, data?: object) =>
    service.put<Res.ResponseRes<T>>(url, data).then(res => res.data),

  delete: <T>(url: string, params?: object) =>
    service.delete<Res.ResponseRes<T>>(url, { params }).then(res => res.data),
};

export default service;
```

**更新 API 调用：** `src/api/api.ts`

```typescript
import { request } from '@/axios';

/** 测试接口 */
export const getCaptcha = (params: object) =>
  request.get<{ captchaImg: string }>('/api/captcha', params);
```

#### 3.2 优化 useSelector

**方案：** 使用 Zustand 官方推荐的 useShallow

**修改：** `src/store/useSelector.ts`

```typescript
/*
 * 推荐使用 Zustand 官方 useShallow
 * 本文件保留用于兼容，建议逐步迁移
 */
import { useShallow } from 'zustand/react/shallow';

export { useShallow };

/**
 * 兼容旧版 useSelector，建议迁移到 useShallow
 * @deprecated 请使用 useShallow
 */
export function useSelector<T extends object, K extends keyof T>(
  fields?: K[] | readonly K[]
): (state: T) => Pick<T, K> {
  return useShallow((state: T) => {
    if (!fields) return state;
    const result = {} as Pick<T, K>;
    fields.forEach(key => {
      result[key] = state[key];
    });
    return result;
  });
}
```

**安装依赖：**

```bash
pnpm add zustand  # 确保版本支持 useShallow
```

#### 3.3 简化弹窗管理（可选）

**说明：** 这是一个较大的改动，如果当前弹窗系统工作正常，可以暂缓修改。

如果决定修改：

**新实现：** `src/store/modules/popups-simple.ts`

```typescript
/*
 * 简化版弹窗管理
 */
import { create } from 'zustand';
import { PopupNames } from '@/common';

interface PopupState {
  visible: boolean;
  data?: unknown;
}

interface PopupStore {
  popups: Record<PopupNames, PopupState>;
  open: (name: PopupNames, data?: unknown) => void;
  close: (name: PopupNames) => void;
  closeAll: () => void;
}

const initialState: Record<PopupNames, PopupState> = {
  [PopupNames.popTest]: { visible: false },
  [PopupNames.PopTestTwo]: { visible: false },
};

export const usePopupSimple = create<PopupStore>(set => ({
  popups: initialState,
  open: (name, data) =>
    set(state => ({
      popups: { ...state.popups, [name]: { visible: true, data } },
    })),
  close: name =>
    set(state => ({
      popups: { ...state.popups, [name]: { visible: false } },
    })),
  closeAll: () => set({ popups: initialState }),
}));
```

### 验证清单

- [ ] 所有 API 调用正常
- [ ] 弹窗功能正常
- [ ] Store 状态更新正常
- [ ] 构建成功

### 检查点

```bash
# 功能验证
pnpm run dev

# 测试各功能模块
# 1. 登录/登出
# 2. 页面跳转
# 3. 弹窗开关
# 4. 主题切换
```

---

## 阶段 4: 性能与安全问题修复

### 目标

修复性能隐患和安全问题。

### 任务清单

#### 4.1 修复 useSelector 潜在问题

**问题：** 自定义 useSelector 使用 useRef 可能导致闭包问题

**解决方案：** 完全迁移到 Zustand 官方 useShallow

**迁移示例：**

```typescript
// 修改前
const { theme, SET_THEME } = useSettings(useSelector(['theme', 'SET_THEME']));

// 修改后
import { useShallow } from 'zustand/react/shallow';
const { theme, SET_THEME } = useSettings(
  useShallow(state => ({ theme: state.theme, SET_THEME: state.SET_THEME }))
);
```

**批量替换脚本：** `scripts/migrate-useSelector.sh`

```bash
#!/bin/bash

# 批量替换 useSelector 到 useShallow
find src -name "*.tsx" -type f -exec sed -i '' 's/useSelector/useShallow/g' {} +
```

#### 4.2 路由懒加载优化

**现状分析：**

- 当前已实现 React.lazy 动态导入
- 可以进一步优化为按权限懒加载

**无需修改，当前实现已合理。**

#### 4.3 添加错误提示机制

**新增：** `src/utils/toast.ts`

```typescript
import { Toast } from 'antd-mobile';

export const toast = {
  success: (content: string) => {
    Toast.show({ icon: 'success', content });
  },
  fail: (content: string) => {
    Toast.show({ icon: 'fail', content });
  },
  loading: (content: string = '加载中...') => {
    return Toast.show({ icon: 'loading', content, duration: 0 });
  },
  clear: () => {
    Toast.clear();
  },
};
```

**更新：** `src/axios/requestCode.ts`

```typescript
import { Toast } from 'antd-mobile';
import type { AxiosResponse } from 'axios';
import { useAppStore } from '@/store';
import router from '@/router';

const noTokenUrl: string[] = ['app/main/getToken'];

export default (response: AxiosResponse): void => {
  const code: number = response.data.code;
  const url: string = response.config.url ?? '';

  if (code === 401 && !noTokenUrl.includes(url)) {
    useAppStore.getState().REMOVE_TOKEN();
    Toast.show({ icon: 'fail', content: '登录已过期，请重新登录' });
    router.navigate('/login', { replace: true });
  } else if (code !== 200) {
    Toast.show({ icon: 'fail', content: response.data.msg || '请求失败' });
  }
};
```

#### 4.4 安全头部配置

**修改：** `vite.config.ts`

```typescript
server: {
  port: 7788,
  host: '0.0.0.0',
  open: false,
  strictPort: false,
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
  proxy: {
    '/api': {
      target: env.VITE_APP_SERVE_URL,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

#### 4.5 添加全局 Loading 状态

**新增：** `src/store/modules/loading.ts`

```typescript
import { create } from 'zustand';

interface LoadingState {
  global: boolean;
  apis: Map<string, boolean>;
  setGlobal: (loading: boolean) => void;
  setApiLoading: (key: string, loading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>(set => ({
  global: false,
  apis: new Map(),
  setGlobal: loading => set({ global: loading }),
  setApiLoading: (key, loading) =>
    set(state => {
      const apis = new Map(state.apis);
      if (loading) {
        apis.set(key, true);
      } else {
        apis.delete(key);
      }
      return { apis };
    }),
}));
```

### 验证清单

- [ ] Toast 提示正常显示
- [ ] 401 错误时正确跳转登录页
- [ ] Loading 状态正确显示/隐藏
- [ ] 安全头部响应正常

### 检查点

```bash
# 构建验证
pnpm run build

# 功能验证
pnpm run dev

# 测试错误场景
# 1. 401 错误处理
# 2. 网络错误处理
# 3. 普通接口错误
```

---

## 阶段 5: 类型安全完善

### 目标

全面梳理和优化类型定义，消除 `any` 和 `unknown`。

### 任务清单

#### 5.1 建立类型规范

**文件：** `src/types/README.md`

```markdown
# 类型规范

## 命名规范

- 接口：PascalCase，以 I 开头（如 IUserInfo）
- 类型别名：PascalCase（如 ApiResponse）
- 枚举：PascalCase，成员大写下划线（如 ApiStatus）

## 目录结构

- api/ - 接口请求/响应类型
- store/ - 状态管理类型
- components/ - 组件 Props 类型
- common/ - 公共类型
```

#### 5.2 定义 API 类型

**新建：** `src/types/api/common.ts`

```typescript
// 通用 API 类型

export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  msg: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
```

**新建：** `src/types/api/user.ts`

```typescript
// 用户相关接口类型

export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  username: string;
  avatar?: string;
}

export interface UserInfo {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  roles: string[];
}
```

#### 5.3 更新 Axios 类型

**修改：** `src/axios/index.ts`

```typescript
import { ApiResponse } from '@/types/api/common';

export const request = {
  get: <T>(url: string, params?: object) =>
    service.get<ApiResponse<T>>(url, { params }).then(res => res.data),
  // ...
};
```

#### 5.4 更新 API 定义

**修改：** `src/api/api.ts`

```typescript
import { request } from '@/axios';
import type { LoginParams, LoginResponse } from '@/types/api/user';
import type { ApiResponse } from '@/types/api/common';

/** 登录接口 */
export const login = (params: LoginParams) => request.post<LoginResponse>('/api/login', params);

/** 获取用户信息 */
export const getUserInfo = () => request.get<LoginResponse>('/api/user/info');

/** 测试接口 - 获取验证码 */
export const getCaptcha = (params: { phone?: string }) =>
  request.get<{ captchaImg: string; expireTime: number }>('/api/captcha', params);
```

#### 5.5 组件 Props 类型

**示例：** `src/components/Test/index.tsx`

```typescript
import { memo } from 'react';

interface TestProps {
  count?: number;
  onClick?: () => void;
}

export default memo(function Test({ count = 0, onClick }: TestProps) {
  return (
    <div onClick={onClick}>
      index count: {count}
    </div>
  );
});
```

#### 5.6 启用严格类型检查

**修改：** `tsconfig.json`

```json
{
  "compilerOptions": {
    // ... 现有配置
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

**修改：** `.eslintrc.cjs`

```javascript
rules: {
  // ...
  '@typescript-eslint/no-explicit-any': 'warn', // 改为 warn，逐步修复
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
}
```

### 验证清单

- [ ] `pnpm type-check` 无错误
- [ ] 所有 API 调用有类型提示
- [ ] 组件 Props 有类型定义
- [ ] 无新的 `any` 引入

### 检查点

```bash
# 类型检查
pnpm run type-check

# 查看 any 使用情况
npx tsc --noEmit | grep -i "any"
```

---

## 🔄 回滚流程

### 发现问题时的处理流程

```
1. 停止开发
   ↓
2. 记录问题（截图、日志）
   ↓
3. 评估影响范围
   ↓
4. 决定回滚或修复
   ↓
5. 执行回滚/修复
   ↓
6. 验证恢复
```

### 回滚命令速查

```bash
# 查看备份分支
git branch -a | grep backup

# 回滚到阶段前
git reset --hard backup/before-stage-X

# 或使用 reflog
git reflog
git reset --hard HEAD@{n}

# 强制推送（如果需要）
git push -f
```

---

## ✅ 最终检查清单

### 工程化

- [ ] Prettier 配置生效
- [ ] ESLint 配置精简
- [ ] Husky 钩子正常
- [ ] Commitlint 生效

### 代码质量

- [ ] 无拼写错误
- [ ] 文件命名统一
- [ ] 代码格式一致

### 架构

- [ ] Axios 封装简化
- [ ] useSelector 优化
- [ ] 类型定义完善

### 性能与安全

- [ ] 错误处理完善
- [ ] 安全头部配置
- [ ] Loading 状态管理

### 类型安全

- [ ] 无显式 any
- [ ] API 类型完整
- [ ] 组件 Props 类型完整

---

## 📊 进度跟踪

| 阶段              | 状态      | 开始日期 | 完成日期 | 负责人 |
| ----------------- | --------- | -------- | -------- | ------ |
| 1. 工程化基础建设 | ⬜ 未开始 | -        | -        | -      |
| 2. 代码规范统一   | ⬜ 未开始 | -        | -        | -      |
| 3. 核心架构简化   | ⬜ 未开始 | -        | -        | -      |
| 4. 性能与安全     | ⬜ 未开始 | -        | -        | -      |
| 5. 类型安全完善   | ⬜ 未开始 | -        | -        | -      |

---

**计划制定时间：** 2026-01-31  
**版本：** v1.0  
**备注：** 按计划逐步执行，每阶段完成后更新状态
