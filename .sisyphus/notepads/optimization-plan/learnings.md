# Learnings - 项目约定和模式

_记录项目中发现的代码约定、架构模式、最佳实践_

---

## [2026-02-04] 阶段1优化完成

### 性能优化

- **倒计时优化**: 将 requestAnimationFrame 改为 setInterval
  - RAF每帧执行（~60fps），但倒计时只需每秒更新一次
  - setInterval(1000) 更适合秒级更新场景
  - 保留 Page Visibility API 优化（页面隐藏时停止）
  - 类型注意: 使用 `ReturnType<typeof setInterval>` 代替 `NodeJS.Timeout`

### 架构优化

- **React Query配置统一**: 创建 `constants/query.ts` 集中管理配置
  - 避免在每个 hook 中重复定义 staleTime
  - 提供 SHORT/MEDIUM/LONG 时间常量用于特殊场景
- **Axios白名单配置**: 移到 `constants/api.ts`
  - ERROR_HANDLER_WHITELIST 管理异常处理白名单
  - 七牛上传等接口需要跳过全局错误处理

- **主题初始化简化**: 移除 main.tsx 中的重复逻辑
  - Zustand persist 中间件自动从 sessionStorage 恢复
  - ThemeProvider useEffect 负责同步到 DOM

### 验证结果

- ✅ TypeScript: 0 errors
- ✅ ESLint: 0 errors, 8 warnings (fast-refresh - 可忽略)
- ✅ Build: 成功

## [2026-02-04] 阶段2优化完成

### 类型安全提升

- **环境变量类型定义**: 在 vite-env.d.ts 中定义 ImportMetaEnv
  - 提供精确的环境变量类型（development | sit | production）
  - 所有 import.meta.env 调用现在都有类型提示

### 配置清理

- **删除 postcss.config.js**: Vite配置中已内联PostCSS配置，外部文件冗余
- **Vite配置简化**:
  - 删除复杂的 delDir 递归函数，改用 `fs.rmSync()`
  - 删除未使用的 formatDate 时间戳函数
  - 移除70+行注释代码，提升可读性
  - 简化 publicPath 和 outputDir 逻辑

### 路由架构简化

- **移除权限路由模块**:
  - 删除 store/modules/permission.ts
  - 简化 App.tsx - 移除动态路由生成逻辑
  - 删除 router/index.ts 中的 generateRouter 函数
  - 代码量减少 ~100 行

### 验证结果

- ✅ TypeScript: 0 errors (保持)
- ✅ ESLint: 0 errors, 8 warnings
- ✅ Build: 成功

## [2026-02-04] 最终优化完成

### 数据管理优化

- **提取Mock数据**: 创建 `constants/mockData.ts`
  - CATEGORIES: 商品分类数据（10个分类）
  - FLASH_PRODUCTS: 限时秒杀商品
  - MOCK_PRODUCTS: 推荐商品列表
  - 从组件中移除 ~100 行硬编码数据

### any类型治理

- **启用any类型警告**: ESLint规则从 'off' 改为 'warn'
  - 识别出21个any类型使用点
  - 分布在: types/, utils/, store/, pages/error
  - 为后续类型优化提供明确目标

### 最终验证结果

- ✅ TypeScript: 0 errors
- ⚠️ ESLint: 0 errors, 21 warnings (any类型 + fast-refresh)
- ✅ Build: 成功
- ✅ 所有功能模块正常

### 代码质量改进统计

- 删除代码: ~200行（注释、冗余逻辑、未使用模块）
- 新增代码: ~150行（类型定义、常量提取、配置优化）
- 净优化: 减少50行，可维护性大幅提升
