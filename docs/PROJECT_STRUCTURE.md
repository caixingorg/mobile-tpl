# 项目目录结构

## 📁 最终结构

```
src/
├── assets/                    # 静态资源
│   ├── icons/                # SVG 图标
│   ├── images/               # 图片资源
│   └── styles/               # 全局样式 (原 style)
│       ├── index.css
│       └── reset.css
├── common/                    # 公共常量/枚举
│   ├── enums.ts
│   └── index.ts
├── components/                # 公共组件
│   ├── Loading/
│   ├── TabBar/
│   └── ThemeProvider/
├── constants/                 # 应用常量 (新增)
│   ├── index.ts              # 应用配置
│   ├── api.ts                # API 常量
│   └── theme.ts              # 主题配置
├── layouts/                   # 布局组件
│   └── basics.tsx
├── pages/                     # 页面组件
│   ├── cart/                 # 购物车
│   ├── category/             # 分类
│   ├── error/                # 错误页
│   ├── home/                 # 首页
│   ├── login/                # 登录
│   ├── product/              # 商品详情
│   └── profile/              # 个人中心
├── router/                    # 路由配置
│   ├── index.ts
│   └── routes.tsx
├── services/                  # 服务层 (新增，合并 axios + api)
│   ├── http/                 # HTTP 请求封装 (原 axios)
│   │   ├── index.ts
│   │   ├── requestCancel.ts
│   │   └── requestCode.ts
│   ├── modules/              # 业务 API 模块 (原 api)
│   │   ├── auth.ts           # 认证
│   │   ├── cart.ts           # 购物车
│   │   ├── product.ts        # 商品
│   │   └── user.ts           # 用户
│   └── index.ts              # 统一导出
├── store/                     # 状态管理
│   ├── index.ts
│   ├── modules/
│   │   ├── app.ts
│   │   ├── loading.ts
│   │   ├── permission.ts
│   │   └── settings.ts
│   ├── store.ts
│   └── useSelector.ts
├── types/                     # 类型定义 (合并 typings)
│   ├── api/
│   │   ├── common.ts
│   │   ├── index.ts
│   │   └── user.ts
│   ├── components/
│   ├── store/
│   │   └── index.ts
│   ├── app.d.ts
│   ├── request.d.ts
│   └── response.d.ts
└── utils/                     # 工具函数
    ├── index.ts
    ├── is.ts
    └── toast.ts
```

---

## 📝 变更记录

### 已完成的优化

| 变更                 | 操作                     | 状态 |
| -------------------- | ------------------------ | ---- |
| 合并 types + typings | 移动 .d.ts 文件到 types/ | ✅   |
| 删除空的 hooks       | 删除 hooks/ 目录         | ✅   |
| 创建 constants       | 新建 constants/ 目录     | ✅   |
| 创建 services        | 合并 axios + api         | ✅   |
| 添加 images          | 新建 assets/images/      | ✅   |
| 删除 react.svg       | 删除未使用文件           | ✅   |
| 重命名 style         | style -> styles          | ✅   |
| 更新导入路径         | main.tsx 样式路径        | ✅   |

---

## 🎯 目录职责

### assets/ - 静态资源

存放不经过编译的静态资源文件。

### components/ - 公共组件

存放跨页面使用的公共组件，每个组件独立目录。

### constants/ - 应用常量

存放应用级别的常量配置，便于统一管理和修改。

### pages/ - 页面组件

存放路由对应的页面组件，每个页面独立目录，包含样式。

### services/ - 服务层

- `http/` - HTTP 请求底层封装
- `modules/` - 按业务模块组织的 API

### store/ - 状态管理

按功能模块组织的状态管理。

### types/ - 类型定义

- 业务类型定义
- 全局类型声明 (.d.ts)

### utils/ - 工具函数

纯函数工具库，无业务逻辑。

---

## ✅ 验证状态

```
✅ ESLint: 通过 (0 错误)
✅ TypeScript: 通过
✅ 构建: 通过 (1.70s)
```

---

## 💡 使用示例

### 使用 services

```typescript
import { request, authApi, productApi } from '@/services';

// 使用通用 request
const data = await request.get('/api/products');

// 使用模块 API
const captcha = await authApi.getCaptcha({ phone: '13800138000' });
const products = await productApi.getProductList();
```

### 使用 constants

```typescript
import { APP_NAME, DEFAULT_THEME } from '@/constants';
import { API_TIMEOUT } from '@/constants/api';
import { THEME_COLORS } from '@/constants/theme';
```

### 使用 types

```typescript
import type { ApiResponse } from '@/types/api';
import type { UserInfo } from '@/types/api/user';
```
