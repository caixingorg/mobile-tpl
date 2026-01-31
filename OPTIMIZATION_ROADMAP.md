# 代码规范优化路线图

## 目标

消除所有 P0 级别问题，使项目通过 Code Quality Guardian 全部检查。

---

## 阶段 1：紧急修复（✅ 已完成）

### 1.1 修复 TypeScript 类型错误

- [x] Line 48: 'values' 未使用
- [x] Line 149: 'prefix' 属性不存在
- [x] Line 165: 'prefix'/'suffix' 属性不存在
- [x] Line 185,191,197: 'circle' 不是有效的 shape 值

### 1.2 消除内联 CSS

- [x] `src/pages/login/index.tsx` - 完全迁移到 CSS Modules
- [x] `src/pages/home/index.tsx` - 主要样式迁移完成

---

## 阶段 2：代码质量提升（✅ 已完成）

- [x] 格式化代码 (`pnpm run format`)
- [x] 减少 any 使用
- [x] `pnpm run lint` - 通过（0 错误）
- [x] `pnpm run type-check` - 通过
- [x] `pnpm run build` - 通过

---

## 阶段 3：建立防护机制（✅ 已完成）

### 3.1 Git 钩子

- [x] pre-commit - 提交前自动运行 lint-staged
- [x] commit-msg - 提交信息格式检查

**钩子功能：**

- 自动格式化代码
- 自动修复 ESLint 错误
- 检查提交信息规范
- 阻止不合规代码提交

### 3.2 CI/CD 集成

- [x] GitHub Actions CI 工作流
  - `.github/workflows/ci.yml` - 主 CI 流程
  - `.github/workflows/code-quality.yml` - PR 代码质量检查
- [x] PR 模板 - `.github/pull_request_template.md`

**CI 功能：**

- 自动运行 ESLint 检查
- 自动运行 TypeScript 类型检查
- 自动构建验证
- 检查代码格式化
- 构建产物大小检查

---

## 阶段 4：项目重构（✅ 已完成）

### 4.1 商城页面开发

- [x] 首页（home）- 轮播、分类、商品列表
- [x] 分类页（category）- 左侧导航 + 右侧子分类
- [x] 购物车（cart）- 商品管理、结算
- [x] 个人中心（profile）- 用户信息、订单、资产
- [x] 商品详情（product）- 图片轮播、规格、评价

### 4.2 底部导航

- [x] TabBar 组件
- [x] 四个主页面切换

### 4.3 主题切换

- [x] ThemeProvider 组件
- [x] 深色/浅色模式切换

---

## 阶段 5：目录结构优化（✅ 已完成）

### 5.1 合并重复目录

- [x] types/ + typings/ → types/

### 5.2 删除无用代码

- [x] 删除空的 hooks/ 目录
- [x] 删除未使用的 assets/react.svg

### 5.3 新增目录

- [x] constants/ - 应用常量
- [x] services/ - 服务层（合并 axios + api）
- [x] assets/images/ - 图片资源

### 5.4 重命名

- [x] assets/style/ → assets/styles/

---

## 执行记录

| 阶段           | 状态      | 完成时间   | 备注                    |
| -------------- | --------- | ---------- | ----------------------- |
| 阶段 1         | ✅ 已完成 | 2024-01-31 | TypeScript 错误已修复   |
| 阶段 2         | ✅ 已完成 | 2024-01-31 | 代码质量检查通过        |
| 阶段 3         | ✅ 已完成 | 2024-01-31 | Git 钩子 + CI/CD 已配置 |
| 阶段 4（重构） | ✅ 已完成 | 2024-01-31 | 商城四页面已完成        |
| 阶段 5（目录） | ✅ 已完成 | 2024-01-31 | 目录结构优化完成        |

---

## 🎉 所有阶段已完成！

### 最终成果

1. **✅ 类型安全** - TypeScript 严格模式，0 错误
2. **✅ 代码规范** - ESLint + Prettier，提交前自动检查
3. **✅ 功能完整** - 商城五页面（首页/分类/购物车/个人中心/商品详情）
4. **✅ 目录规范** - 清晰的目录结构，符合业界最佳实践
5. **✅ 防护机制** - Git 钩子 + CI/CD，阻止不合规代码
6. **✅ 主题支持** - 深色/浅色模式切换

### 质量指标

```
✅ ESLint:        0 错误, 8 警告（可忽略）
✅ TypeScript:    0 错误
✅ 构建:          成功 (1.70s)
✅ Git 钩子:      已配置（pre-commit + commit-msg）
✅ CI/CD:         已配置（GitHub Actions）
```

### 可用命令

```bash
# 开发
pnpm run dev              # 启动开发服务器

# 代码检查
pnpm run lint             # ESLint 检查
pnpm run lint:fix         # ESLint 自动修复
pnpm run format           # 格式化代码
pnpm run format:check     # 检查代码格式
pnpm run type-check       # TypeScript 类型检查

# 构建
pnpm run build            # 生产构建
pnpm run build:sit        # 测试环境构建

# 验证（Code Quality Guardian）
./.agents/skills/code-quality-guardian/scripts/verify-code.sh
```

### 提交规范

```bash
# 正确示例
git commit -m "feat: 添加购物车功能"
git commit -m "fix: 修复首页样式问题"
git commit -m "docs: 更新 README"
git commit -m "refactor: 优化商品列表性能"

# 错误示例（会被阻止）
git commit -m "修改了一些东西"
git commit -m "update"
```

---

**🎊 项目优化全部完成！代码质量和开发体验已大幅提升！**
