# Decisions - 架构决策

_记录优化过程中的关键决策和理由_

---

## [2026-02-04] 关键决策

### 1. 为什么删除权限路由模块？

**原因**:

- `GenerateRoutes()` 始终返回空数组，没有实际逻辑
- App.tsx 中有复杂的动态路由生成，但最终使用静态路由
- 增加了不必要的复杂度和维护成本

**决策**: 删除整个权限模块，直接使用静态路由配置

### 2. 为什么删除PostCSS配置文件？

**原因**:

- Vite配置中已内联PostCSS配置（Autoprefixer + PostCssPxToViewport + Tailwind）
- 两处配置容易造成混淆
- Vite文档推荐在vite.config.ts中配置PostCSS

**决策**: 删除独立配置文件，统一在Vite配置中管理

### 3. 为什么简化dist目录删除逻辑？

**原因**:

- 原代码使用80+行的递归函数实现目录删除
- Node.js 14.14.0+ 提供了 `fs.rmSync()` 原生API
- 递归函数容易出错且难维护

**决策**: 使用 `fs.rmSync('./dist', { recursive: true, force: true })` 一行代替

### 4. 为什么删除时间戳打包功能？

**原因**:

- formatDate 函数已实现但被完全注释
- publicPath 和 outputDir 都使用固定值
- 没有证据表明需要时间戳目录

**决策**: 删除未使用的代码，保持简洁
