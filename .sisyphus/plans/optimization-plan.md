# mobile-tpl 项目优化计划

**创建时间**: 2026-02-04  
**目标**: 消除技术债务，提升代码质量、性能和可维护性

---

## 阶段 1: 快速修复 (P0 - 高优先级) ⚡

### 任务清单

- [ ] **Task 1.1**: 优化首页倒计时性能
  - **位置**: `src/pages/home/index.tsx`
  - **问题**: requestAnimationFrame 每帧执行但每秒才更新状态
  - **方案**: 改用 setInterval 或抽取为独立组件
  - **预计时间**: 30分钟
  - **可并行**: ✅

- [ ] **Task 1.2**: 修复主题初始化重复逻辑
  - **位置**: `src/main.tsx` + `src/components/ThemeProvider/index.tsx`
  - **问题**: 主题初始化在两处重复执行
  - **方案**: 统一在 ThemeProvider 中管理
  - **预计时间**: 20分钟
  - **可并行**: ✅

- [ ] **Task 1.3**: 统一 React Query 配置
  - **位置**: `src/hooks/useProducts.ts` + `src/main.tsx`
  - **问题**: staleTime 重复定义且不一致
  - **方案**: 创建 `src/constants/query.ts`，移除 hooks 中的重复配置
  - **预计时间**: 30分钟
  - **可并行**: ✅

- [ ] **Task 1.4**: 提取 Axios 白名单到常量
  - **位置**: `src/services/http/index.ts`
  - **问题**: 白名单硬编码在服务层
  - **方案**: 移到 `src/constants/api.ts`
  - **预计时间**: 15分钟
  - **可并行**: ✅

- [ ] **Task 1.5**: 清理未使用的权限路由逻辑
  - **位置**: `src/store/modules/permission.ts` + `src/App.tsx`
  - **问题**: GenerateRoutes 始终返回空数组，但 App.tsx 仍在调用
  - **方案**: 移除无用代码或实现真实逻辑（建议移除）
  - **预计时间**: 30分钟
  - **可并行**: ⚠️ 依赖路由配置理解

---

## 阶段 2: 代码质量提升 (P1 - 中优先级) 🔧

### 任务清单

- [ ] **Task 2.1**: 添加环境变量类型定义
  - **位置**: `src/vite-env.d.ts`
  - **问题**: import.meta.env 缺少类型支持
  - **方案**: 定义 ImportMetaEnv 接口
  - **预计时间**: 20分钟
  - **可并行**: ✅

- [ ] **Task 2.2**: 提取硬编码数据到常量
  - **位置**: `src/pages/home/index.tsx`, `src/pages/category/index.tsx`
  - **问题**: 静态数据写死在组件中
  - **方案**: 创建 `src/constants/mockData.ts`
  - **预计时间**: 40分钟
  - **可并行**: ✅

- [ ] **Task 2.3**: 逐步消除 any 类型
  - **位置**: `src/services/http/*`, `.eslintrc.cjs`
  - **问题**: any 类型滥用，ESLint 规则关闭
  - **方案**:
    - 将 `@typescript-eslint/no-explicit-any` 改为 'warn'
    - 为 requestCancel 和 requestCode 添加类型
  - **预计时间**: 1小时
  - **可并行**: ✅

- [ ] **Task 2.4**: 清理 PostCSS 配置冗余
  - **位置**: `postcss.config.js` + `vite.config.ts`
  - **问题**: 配置重复
  - **方案**: 删除 `postcss.config.js`，统一使用 Vite 配置
  - **预计时间**: 10分钟
  - **可并行**: ✅

- [ ] **Task 2.5**: 清理 Vite 配置中的注释代码
  - **位置**: `vite.config.ts` (line 24-49, 79-85)
  - **问题**: 大量被注释的代码影响可读性
  - **方案**: 删除无用代码或恢复功能
  - **预计时间**: 20分钟
  - **可并行**: ✅

---

## 阶段 3: 长期优化 (P2 - 低优先级) 🚀

### 任务清单

- [ ] **Task 3.1**: 添加 ErrorBoundary 错误边界
  - **位置**: `src/components/ErrorBoundary/` + `src/App.tsx`
  - **目的**: 捕获运行时错误，提升用户体验
  - **预计时间**: 1小时
  - **可并行**: ✅

- [ ] **Task 3.2**: 为核心组件添加单元测试
  - **位置**: `src/components/__tests__/`
  - **范围**: LazyImage, ThemeProvider, TabBar
  - **预计时间**: 2-3小时
  - **可并行**: ✅

- [ ] **Task 3.3**: 优化懒加载图片组件
  - **位置**: `src/components/LazyImage/index.tsx`
  - **方案**: 评估是否需要自定义实现或使用库
  - **预计时间**: 1小时
  - **可并行**: ✅

---

## 执行策略

### 并行执行组

**组 1 (阶段 1 - 可并行任务)**:

- Task 1.1: 倒计时优化
- Task 1.2: 主题初始化
- Task 1.3: React Query 配置
- Task 1.4: Axios 白名单

**组 2 (阶段 1 - 独立任务)**:

- Task 1.5: 权限路由清理 (需单独处理)

**组 3 (阶段 2 - 可并行任务)**:

- Task 2.1: 环境变量类型
- Task 2.2: 数据提取
- Task 2.3: any 类型消除
- Task 2.4: PostCSS 清理
- Task 2.5: Vite 配置清理

### 验证标准

每个阶段完成后必须通过:

- ✅ `pnpm run lint` - 0 错误
- ✅ `pnpm run type-check` - 0 错误
- ✅ `pnpm run build` - 构建成功
- ✅ 手动测试主要功能 (首页、分类、购物车等)

---

## 预计时间

- **阶段 1**: 2-3 小时
- **阶段 2**: 2-3 小时
- **阶段 3**: 4-6 小时 (可选)

**总计**: 4-6 小时核心优化 + 4-6 小时扩展优化
