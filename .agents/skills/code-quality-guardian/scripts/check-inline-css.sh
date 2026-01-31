#!/bin/bash

# 检查内联 CSS 脚本

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}     内联 CSS 检查${NC}"
echo -e "${BLUE}=======================================${NC}"

INLINE_CSS_COUNT=0
WARNINGS=""

# 检查 JSX/TSX 文件中的 style 属性
echo -e "${YELLOW}🔍 检查 style 属性...${NC}"

# 查找 style={{ 或 style={ 模式（排除注释和允许的情况）
STYLE_PATTERN='style=\{\{[^}]+\}\}|style=\{[^{}]+
'

while IFS= read -r file; do
  if [ -f "$file" ]; then
    # 跳过 node_modules 和 dist
    if [[ "$file" == *"node_modules"* ]] || [[ "$file" == *"dist"* ]]; then
      continue
    fi
    
    # 查找内联样式（排除允许的注释标记）
    matches=$(grep -n 'style={{[^}]*}}' "$file" 2>/dev/null | grep -v '//\s*ALLOW-INLINE' | grep -v '{/\*\s*ALLOW-INLINE' || true)
    
    if [ -n "$matches" ]; then
      echo -e "${RED}❌ 发现内联样式: $file${NC}"
      echo "$matches" | head -5
      echo ""
      ((INLINE_CSS_COUNT++))
    fi
  fi
done < <(find . -type f \( -name "*.tsx" -o -name "*.jsx" -o -name "*.ts" -o -name "*.js" \) 2>/dev/null)

# 检查 HTML 文件中的 style 属性
echo -e "${YELLOW}🔍 检查 HTML style 属性...${NC}"

while IFS= read -r file; do
  if [ -f "$file" ]; then
    # 跳过 node_modules
    if [[ "$file" == *"node_modules"* ]]; then
      continue
    fi
    
    matches=$(grep -n 'style="' "$file" 2>/dev/null | grep -v '<!--\s*ALLOW-INLINE' || true)
    
    if [ -n "$matches" ]; then
      echo -e "${RED}❌ 发现内联样式: $file${NC}"
      echo "$matches" | head -5
      echo ""
      ((INLINE_CSS_COUNT++))
    fi
  fi
done < <(find . -type f -name "*.html" 2>/dev/null | grep -v node_modules)

# 检查 CSS-in-JS 的 css 属性（styled-components/emotion 等）
echo -e "${YELLOW}🔍 检查 CSS-in-JS...${NC}"

while IFS= read -r file; do
  if [ -f "$file" ]; then
    # 检查 css={{ 模式
    matches=$(grep -n 'css={{[^}]*}}' "$file" 2>/dev/null | grep -v '//\s*ALLOW-INLINE' | grep -v '{/\*\s*ALLOW-INLINE' || true)
    
    if [ -n "$matches" ]; then
      echo -e "${YELLOW}⚠️  发现 CSS-in-JS (建议改为 CSS Modules/Tailwind): $file${NC}"
      echo "$matches" | head -3
      echo ""
    fi
  fi
done < <(find . -type f \( -name "*.tsx" -o -name "*.jsx" \) 2>/dev/null)

echo ""
echo -e "${BLUE}=======================================${NC}"

if [ $INLINE_CSS_COUNT -eq 0 ]; then
  echo -e "${GREEN}✅ 未发现内联 CSS！${NC}"
  echo -e "${GREEN}=======================================${NC}"
  exit 0
else
  echo -e "${RED}❌ 发现 $INLINE_CSS_COUNT 个文件含有内联 CSS${NC}"
  echo -e "${YELLOW}请使用 CSS Modules、Tailwind 或 CSS 文件替代${NC}"
  echo -e "${BLUE}=======================================${NC}"
  exit 1
fi
