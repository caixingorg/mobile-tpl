#!/bin/bash

# 阶段检查脚本 - 验证每个阶段是否完成

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

STAGE=$1

show_help() {
    echo "用法: $0 <阶段号>"
    echo ""
    echo "阶段号:"
    echo "  1 - 工程化基础建设"
    echo "  2 - 代码规范统一"
    echo "  3 - 核心架构简化"
    echo "  4 - 性能与安全"
    echo "  5 - 类型安全完善"
    echo ""
    echo "示例:"
    echo "  $0 1"
}

check_stage_1() {
    echo -e "${BLUE}=======================================${NC}"
    echo -e "${BLUE}     阶段 1: 工程化基础建设检查${NC}"
    echo -e "${BLUE}=======================================${NC}"
    
    local passed=0
    local failed=0
    
    # 检查 Prettier 配置
    if [ -f ".prettierrc" ] || [ -f ".prettierrc.json" ]; then
        echo -e "${GREEN}✅ Prettier 配置存在${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ Prettier 配置缺失${NC}"
        ((failed++))
    fi
    
    # 检查 EditorConfig
    if [ -f ".editorconfig" ]; then
        echo -e "${GREEN}✅ EditorConfig 存在${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ EditorConfig 缺失${NC}"
        ((failed++))
    fi
    
    # 检查 Husky
    if [ -d ".husky" ]; then
        echo -e "${GREEN}✅ Husky 已初始化${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ Husky 未初始化${NC}"
        ((failed++))
    fi
    
    # 检查 commitlint
    if [ -f "commitlint.config.js" ] || [ -f "commitlint.config.cjs" ]; then
        echo -e "${GREEN}✅ Commitlint 配置存在${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ Commitlint 配置缺失${NC}"
        ((failed++))
    fi
    
    # 检查 lint-staged
    if grep -q "lint-staged" package.json; then
        echo -e "${GREEN}✅ lint-staged 已配置${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ lint-staged 未配置${NC}"
        ((failed++))
    fi
    
    # 检查 scripts
    if grep -q '"format"' package.json && grep -q '"type-check"' package.json; then
        echo -e "${GREEN}✅ NPM Scripts 已更新${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ NPM Scripts 未更新${NC}"
        ((failed++))
    fi
    
    echo ""
    echo -e "${BLUE}=======================================${NC}"
    echo -e "检查结果: ${GREEN}通过 ${passed}${NC} | ${RED}失败 ${failed}${NC}"
    echo -e "${BLUE}=======================================${NC}"
    
    return $failed
}

check_stage_2() {
    echo -e "${BLUE}=======================================${NC}"
    echo -e "${BLUE}     阶段 2: 代码规范统一检查${NC}"
    echo -e "${BLUE}=======================================${NC}"
    
    local passed=0
    local failed=0
    
    # 检查 ESLint 配置是否精简
    local eslint_lines=$(wc -l < .eslintrc.cjs)
    if [ "$eslint_lines" -lt 100 ]; then
        echo -e "${GREEN}✅ ESLint 配置已精简 (${eslint_lines} 行)${NC}"
        ((passed++))
    else
        echo -e "${YELLOW}⚠️  ESLint 配置较长 (${eslint_lines} 行)，建议精简${NC}"
    fi
    
    # 检查拼写错误修复
    if ! grep -q "VITE_APP_SERVE_URl" .env.* 2>/dev/null; then
        echo -e "${GREEN}✅ 拼写错误已修复${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ 仍存在拼写错误 (VITE_APP_SERVE_URl)${NC}"
        ((failed++))
    fi
    
    # 尝试运行 lint
    echo -e "${YELLOW}🔄 运行 ESLint 检查...${NC}"
    if pnpm run lint > /dev/null 2>&1; then
        echo -e "${GREEN}✅ ESLint 检查通过${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ ESLint 检查失败${NC}"
        ((failed++))
    fi
    
    # 尝试运行 format:check
    echo -e "${YELLOW}🔄 运行 Prettier 检查...${NC}"
    if pnpm run format:check > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 代码格式检查通过${NC}"
        ((passed++))
    else
        echo -e "${YELLOW}⚠️  代码格式需要修复，运行 pnpm run format${NC}"
    fi
    
    # 检查构建
    echo -e "${YELLOW}🔄 运行构建检查...${NC}"
    if pnpm run build > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 构建成功${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ 构建失败${NC}"
        ((failed++))
    fi
    
    echo ""
    echo -e "${BLUE}=======================================${NC}"
    echo -e "检查结果: ${GREEN}通过 ${passed}${NC} | ${RED}失败 ${failed}${NC}"
    echo -e "${BLUE}=======================================${NC}"
    
    return $failed
}

check_stage_3() {
    echo -e "${BLUE}=======================================${NC}"
    echo -e "${BLUE}     阶段 3: 核心架构简化检查${NC}"
    echo -e "${BLUE}=======================================${NC}"
    
    local passed=0
    local failed=0
    
    # 检查 Axios 是否简化
    if grep -q "export const request" src/axios/index.ts; then
        echo -e "${GREEN}✅ Axios 已简化为 request 对象${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ Axios 未简化${NC}"
        ((failed++))
    fi
    
    # 检查 useShallow
    if grep -q "useShallow" src/store/useSelector.ts; then
        echo -e "${GREEN}✅ useSelector 已更新为 useShallow${NC}"
        ((passed++))
    else
        echo -e "${YELLOW}⚠️  useSelector 未更新为 useShallow${NC}"
    fi
    
    # 检查构建
    echo -e "${YELLOW}🔄 运行构建检查...${NC}"
    if pnpm run build > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 构建成功${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ 构建失败${NC}"
        ((failed++))
    fi
    
    echo ""
    echo -e "${BLUE}=======================================${NC}"
    echo -e "检查结果: ${GREEN}通过 ${passed}${NC} | ${RED}失败 ${failed}${NC}"
    echo -e "${BLUE}=======================================${NC}"
    
    return $failed
}

check_stage_4() {
    echo -e "${BLUE}=======================================${NC}"
    echo -e "${BLUE}     阶段 4: 性能与安全检查${NC}"
    echo -e "${BLUE}=======================================${NC}"
    
    local passed=0
    local failed=0
    
    # 检查 toast 工具
    if [ -f "src/utils/toast.ts" ]; then
        echo -e "${GREEN}✅ Toast 工具已添加${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ Toast 工具缺失${NC}"
        ((failed++))
    fi
    
    # 检查 loading store
    if [ -f "src/store/modules/loading.ts" ]; then
        echo -e "${GREEN}✅ Loading Store 已添加${NC}"
        ((passed++))
    else
        echo -e "${YELLOW}⚠️  Loading Store 未添加${NC}"
    fi
    
    # 检查安全头部
    if grep -q "X-Frame-Options" vite.config.ts; then
        echo -e "${GREEN}✅ 安全头部已配置${NC}"
        ((passed++))
    else
        echo -e "${YELLOW}⚠️  安全头部未配置${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}=======================================${NC}"
    echo -e "检查结果: ${GREEN}通过 ${passed}${NC} | ${RED}失败 ${failed}${NC}"
    echo -e "${BLUE}=======================================${NC}"
    
    return $failed
}

check_stage_5() {
    echo -e "${BLUE}=======================================${NC}"
    echo -e "${BLUE}     阶段 5: 类型安全完善检查${NC}"
    echo -e "${BLUE}=======================================${NC}"
    
    local passed=0
    local failed=0
    
    # 检查 types 目录
    if [ -d "src/types" ]; then
        echo -e "${GREEN}✅ Types 目录已创建${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ Types 目录缺失${NC}"
        ((failed++))
    fi
    
    # 检查 API 类型
    if [ -f "src/types/api/common.ts" ]; then
        echo -e "${GREEN}✅ API 通用类型已定义${NC}"
        ((passed++))
    else
        echo -e "${YELLOW}⚠️  API 通用类型未定义${NC}"
    fi
    
    # 检查类型检查
    echo -e "${YELLOW}🔄 运行类型检查...${NC}"
    if pnpm run type-check > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 类型检查通过${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ 类型检查失败${NC}"
        ((failed++))
    fi
    
    # 统计 any 使用情况
    echo -e "${YELLOW}📊 any 使用情况统计:${NC}"
    local any_count=$(grep -r "any" src --include="*.ts" --include="*.tsx" | wc -l)
    echo -e "  发现 ${YELLOW}${any_count}${NC} 处 any"
    if [ "$any_count" -lt 10 ]; then
        echo -e "  ${GREEN}✅ any 使用较少${NC}"
        ((passed++))
    else
        echo -e "  ${YELLOW}⚠️  建议继续减少 any 使用${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}=======================================${NC}"
    echo -e "检查结果: ${GREEN}通过 ${passed}${NC} | ${RED}失败 ${failed}${NC}"
    echo -e "${BLUE}=======================================${NC}"
    
    return $failed
}

# 主逻辑
if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

case $STAGE in
    1)
        check_stage_1
        ;;
    2)
        check_stage_2
        ;;
    3)
        check_stage_3
        ;;
    4)
        check_stage_4
        ;;
    5)
        check_stage_5
        ;;
    *)
        echo -e "${RED}❌ 无效的阶段号: $STAGE${NC}"
        show_help
        exit 1
        ;;
esac

exit_code=$?

if [ $exit_code -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 所有检查通过！可以继续下一阶段。${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠️  有检查项未通过，请修复后再继续。${NC}"
fi

exit $exit_code
