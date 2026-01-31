#!/bin/bash

# 代码质量验证脚本

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}     代码质量验证${NC}"
echo -e "${BLUE}=======================================${NC}"

PASSED=0
FAILED=0

# 检查 1: ESLint
echo -e "${YELLOW}🔄 运行 ESLint 检查...${NC}"
if pnpm run lint > /dev/null 2>&1 || npm run lint > /dev/null 2>&1; then
  echo -e "${GREEN}✅ ESLint 检查通过${NC}"
  ((PASSED++))
else
  echo -e "${RED}❌ ESLint 检查失败${NC}"
  ((FAILED++))
fi

# 检查 2: Prettier
echo -e "${YELLOW}🔄 运行 Prettier 检查...${NC}"
if pnpm run format:check > /dev/null 2>&1 || npm run format:check > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Prettier 检查通过${NC}"
  ((PASSED++))
else
  echo -e "${RED}❌ Prettier 检查失败${NC}"
  ((FAILED++))
fi

# 检查 3: TypeScript
echo -e "${YELLOW}🔄 运行 TypeScript 类型检查...${NC}"
if pnpm run type-check > /dev/null 2>&1 || npm run type-check > /dev/null 2>&1 || npx tsc --noEmit > /dev/null 2>&1; then
  echo -e "${GREEN}✅ TypeScript 类型检查通过${NC}"
  ((PASSED++))
else
  echo -e "${RED}❌ TypeScript 类型检查失败${NC}"
  ((FAILED++))
fi

# 检查 4: 构建
echo -e "${YELLOW}🔄 运行构建检查...${NC}"
if pnpm run build > /dev/null 2>&1 || npm run build > /dev/null 2>&1; then
  echo -e "${GREEN}✅ 构建检查通过${NC}"
  ((PASSED++))
else
  echo -e "${RED}❌ 构建检查失败${NC}"
  ((FAILED++))
fi

# 检查 5: 内联 CSS
echo -e "${YELLOW}🔄 检查内联 CSS...${NC}"
INLINE_COUNT=$(grep -r 'style={{[^}]*}}' src --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null | grep -v 'ALLOW-INLINE' | wc -l)
if [ "$INLINE_COUNT" -eq 0 ]; then
  echo -e "${GREEN}✅ 未发现内联 CSS${NC}"
  ((PASSED++))
else
  echo -e "${RED}❌ 发现 ${INLINE_COUNT} 处内联 CSS${NC}"
  echo -e "${YELLOW}   请使用 CSS Modules、Tailwind 或 CSS 文件替代${NC}"
  ((FAILED++))
fi

# 统计 any 使用
echo -e "${YELLOW}📊 统计 any 使用情况...${NC}"
ANY_COUNT=$(grep -r "any" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
echo -e "  发现 ${YELLOW}${ANY_COUNT}${NC} 处 any"
if [ "$ANY_COUNT" -lt 10 ]; then
  echo -e "  ${GREEN}✅ any 使用较少${NC}"
  ((PASSED++))
else
  echo -e "  ${YELLOW}⚠️  any 使用较多，建议减少${NC}"
fi

echo ""
echo -e "${BLUE}=======================================${NC}"
echo -e "检查结果: ${GREEN}通过 ${PASSED}${NC} | ${RED}失败 ${FAILED}${NC}"
echo -e "${BLUE}=======================================${NC}"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 所有检查通过！代码质量良好。${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  有检查项未通过，请修复后再提交。${NC}"
  exit 1
fi
