# 代码规范优化路线图

## 目标

消除所有 P0 级别问题，使项目通过 Code Quality Guardian 全部检查。

## 阶段 1：紧急修复（今日完成）

### 1.1 修复 TypeScript 类型错误

**文件**: `src/pages/login/index.tsx`

**问题清单**:

- [x] Line 48: 'values' 未使用
- [x] Line 149: 'prefix' 属性不存在
- [x] Line 165: 'prefix'/'suffix' 属性不存在
- [x] Line 185,191,197: 'circle' 不是有效的 shape 值

### 1.2 消除内联 CSS

**文件**: `src/pages/home/index.tsx`, `src/pages/login/index.tsx`

**策略**:

- 创建 CSS Modules 文件
- 将内联样式迁移到 CSS 类
- 保持视觉一致

## 阶段 2：代码质量提升（本周完成）

### 2.1 格式化代码

```bash
pnpm run format
```

### 2.2 减少 any 使用

- 识别 12 处 any
- 逐步替换为具体类型

### 2.3 验证

```bash
pnpm run lint
pnpm run type-check
pnpm run build
```

## 阶段 3：建立防护机制（持续）

### 3.1 Git 钩子

- 提交前自动检查
- 阻止不合规代码提交

### 3.2 CI 集成

- PR 时自动运行验证
- 代码审查清单

---

## 执行记录

| 阶段   | 状态      | 完成时间 |
| ------ | --------- | -------- |
| 阶段 1 | 🔄 进行中 | -        |
| 阶段 2 | ⏳ 待开始 | -        |
| 阶段 3 | ⏳ 待开始 | -        |
