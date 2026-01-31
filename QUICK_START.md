# 优化计划快速开始指南

## 🚀 开始之前

确保你已阅读：
1. `PROJECT_ANALYSIS.md` - 项目分析报告
2. `OPTIMIZATION_PLAN.md` - 详细优化计划

## 📋 准备工作

```bash
# 1. 确保所有更改已提交
git add .
git commit -m "checkpoint: 开始优化前的状态"

# 2. 创建优化分支
git checkout -b optimization/2024-improvements

# 3. 给脚本添加执行权限
chmod +x scripts/*.sh
```

## 🎯 阶段执行流程

每个阶段遵循以下流程：

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   1. 备份   │ → │   2. 执行   │ → │   3. 验证   │ → │   4. 提交   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## 阶段 1: 工程化基础建设

### 1.1 创建备份
```bash
./scripts/backup.sh
```

### 1.2 执行任务

安装依赖：
```bash
pnpm add -D prettier husky lint-staged @commitlint/config-conventional @commitlint/cli
```

创建配置文件：

**.prettierrc**
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

**.editorconfig**
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2
max_line_length = 100
```

初始化 Husky：
```bash
npx husky init
```

创建 `.husky/pre-commit`：
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
echo "🔍 正在检查代码..."
npx lint-staged
```

创建 `commitlint.config.js`：
```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert', 'build', 'ci']
    ],
  },
};
```

更新 `package.json`：
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,less,scss,json,md}": ["prettier --write"]
  },
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx,css,less,json,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,less,json,md}\"",
    "type-check": "tsc --noEmit",
    "prepare": "husky"
  }
}
```

### 1.3 验证
```bash
./scripts/check-stage.sh 1
```

### 1.4 提交
```bash
git add .
git commit -m "build: 配置工程化工具 (prettier, husky, lint-staged, commitlint)"
```

---

## 阶段 2: 代码规范统一

### 2.1 创建备份
```bash
./scripts/backup.sh
```

### 2.2 执行任务

精简 ESLint 配置（参考 OPTIMIZATION_PLAN.md 中的配置）

修复拼写错误：
```bash
# 替换所有 VITE_APP_SERVE_URl 为 VITE_APP_SERVE_URL
sed -i '' 's/VITE_APP_SERVE_URl/VITE_APP_SERVE_URL/g' .env.*
sed -i '' 's/VITE_APP_SERVE_URl/VITE_APP_SERVE_URL/g' vite.config.ts
```

格式化代码：
```bash
pnpm run format
```

### 2.3 验证
```bash
./scripts/check-stage.sh 2
```

### 2.4 提交
```bash
git add .
git commit -m "style: 统一代码规范，精简 ESLint 配置，修复拼写错误"
```

---

## 阶段 3: 核心架构简化

### 3.1 创建备份
```bash
./scripts/backup.sh
```

### 3.2 执行任务

简化 Axios 封装（参考 OPTIMIZATION_PLAN.md）

更新 useSelector：
```bash
# 安装 zustand 最新版
pnpm add zustand@latest
```

### 3.3 验证
```bash
./scripts/check-stage.sh 3
```

### 3.4 提交
```bash
git add .
git commit -m "refactor: 简化 axios 封装，优化 useSelector 实现"
```

---

## 阶段 4: 性能与安全

### 4.1 创建备份
```bash
./scripts/backup.sh
```

### 4.2 执行任务

创建 Toast 工具、Loading Store、配置安全头部（参考 OPTIMIZATION_PLAN.md）

### 4.3 验证
```bash
./scripts/check-stage.sh 4
```

### 4.4 提交
```bash
git add .
git commit -m "feat: 添加错误提示机制，配置安全头部，优化性能"
```

---

## 阶段 5: 类型安全完善

### 5.1 创建备份
```bash
./scripts/backup.sh
```

### 5.2 执行任务

创建类型目录结构：
```bash
mkdir -p src/types/api
mkdir -p src/types/store
mkdir -p src/types/components
```

定义 API 类型、更新组件 Props 类型（参考 OPTIMIZATION_PLAN.md）

### 5.3 验证
```bash
./scripts/check-stage.sh 5
```

### 5.4 提交
```bash
git add .
git commit -m "types: 完善类型定义，提升类型安全"
```

---

## 🔄 回滚操作

如果某个阶段出现问题：

### 方式 1: 使用备份分支
```bash
# 查看所有备份分支
git branch -a | grep backup

# 回滚到指定备份
git reset --hard backup/before-stage-X
```

### 方式 2: 使用备份脚本
```bash
# 列出所有备份
./scripts/restore.sh -l

# 从压缩包恢复
./scripts/restore.sh backup_YYYYMMDD_HHMMSS.tar.gz

# 从分支恢复
./scripts/restore.sh -b backup/before-stage-X
```

### 方式 3: 使用 Git Reflog
```bash
# 查看操作历史
git reflog

# 回滚到指定操作
git reset --hard HEAD@{n}
```

---

## ✅ 最终验证

所有阶段完成后，运行：

```bash
# 1. 代码检查
pnpm run lint
pnpm run format:check
pnpm run type-check

# 2. 构建验证
pnpm run build

# 3. 开发环境验证
pnpm run dev
```

---

## 📊 进度跟踪

更新 `OPTIMIZATION_PLAN.md` 中的进度表：

```markdown
| 阶段 | 状态 | 开始日期 | 完成日期 | 负责人 |
|------|------|----------|----------|--------|
| 1. 工程化基础建设 | ✅ 已完成 | 2026-01-31 | 2026-01-31 | - |
| 2. 代码规范统一 | ⬜ 进行中 | - | - | - |
| ... |
```

---

## 🆘 常见问题

### Q1: 提交时 Husky 报错
```bash
# 给 Husky 脚本添加执行权限
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Q2: ESLint 和 Prettier 冲突
确保 `.eslintrc.cjs` 中：
```javascript
extends: [
  // ... 其他配置
  'prettier', // 必须放最后
],
```

### Q3: 类型检查太慢
```bash
# 使用增量检查
npx tsc --noEmit --incremental
```

### Q4: 想跳过某个钩子
```bash
# 临时跳过 pre-commit
git commit -m "xxx" --no-verify
```

---

## 📚 相关文档

- [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md) - 项目分析报告
- [OPTIMIZATION_PLAN.md](./OPTIMIZATION_PLAN.md) - 详细优化计划

---

**开始优化吧！💪**
