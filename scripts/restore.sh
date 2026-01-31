#!/bin/bash

# 恢复脚本 - 用于从备份恢复

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

BACKUP_DIR="backups"

show_help() {
    echo "用法: $0 [选项] <备份文件名>"
    echo ""
    echo "选项:"
    echo "  -h, --help      显示帮助"
    echo "  -l, --list      列出所有备份"
    echo "  -b, --branch    使用 Git 分支恢复（而不是压缩包）"
    echo ""
    echo "示例:"
    echo "  $0 backup_20260131_120000.tar.gz"
    echo "  $0 -b backup/before-stage-1"
    echo "  $0 -l"
}

list_backups() {
    echo -e "${YELLOW}=======================================${NC}"
    echo -e "${YELLOW}     可用的备份文件${NC}"
    echo -e "${YELLOW}=======================================${NC}"
    
    if [ -d "${BACKUP_DIR}" ]; then
        echo -e "${GREEN}归档备份:${NC}"
        ls -lht ${BACKUP_DIR}/*.tar.gz 2>/dev/null || echo -e "${RED}  无归档备份${NC}"
        
        echo ""
        echo -e "${GREEN}Git 分支备份:${NC}"
        git branch -a | grep "backup/" || echo -e "${RED}  无分支备份${NC}"
    else
        echo -e "${RED}备份目录不存在${NC}"
    fi
}

restore_from_archive() {
    local backup_file="$1"
    local full_path="${BACKUP_DIR}/${backup_file}"
    
    if [ ! -f "${full_path}" ]; then
        echo -e "${RED}❌ 备份文件不存在: ${full_path}${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}⚠️  警告：这将覆盖当前工作目录的所有文件！${NC}"
    read -p "确定要继续吗？ (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        echo -e "${YELLOW}❌ 恢复已取消${NC}"
        exit 0
    fi
    
    # 创建临时目录
    TEMP_DIR=$(mktemp -d)
    echo -e "${YELLOW}📦 解压备份到临时目录...${NC}"
    tar -xzf "${full_path}" -C "${TEMP_DIR}"
    
    # 保存当前未提交的更改
    if ! git diff-index --quiet HEAD --; then
        echo -e "${YELLOW}💾 保存当前未提交的更改...${NC}"
        git stash push -m "auto-stash-before-restore-$(date +%Y%m%d_%H%M%S)"
    fi
    
    # 清空当前目录（保留 .git 和 backups）
    echo -e "${YELLOW}🧹 清理当前目录...${NC}"
    find . -maxdepth 1 -not -path './.git*' -not -path './backups*' -not -path '.' -exec rm -rf {} \; 2>/dev/null || true
    
    # 复制备份文件
    echo -e "${YELLOW}📋 恢复备份文件...${NC}"
    cp -r "${TEMP_DIR}"/* .
    
    # 清理临时目录
    rm -rf "${TEMP_DIR}"
    
    echo -e "${GREEN}✅ 恢复完成！${NC}"
}

restore_from_branch() {
    local branch="$1"
    
    if ! git rev-parse --verify "${branch}" > /dev/null 2>&1; then
        echo -e "${RED}❌ 分支不存在: ${branch}${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}⚠️  警告：这将重置当前分支到 ${branch}！${NC}"
    read -p "确定要继续吗？ (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        echo -e "${YELLOW}❌ 恢复已取消${NC}"
        exit 0
    fi
    
    # 保存当前未提交的更改
    if ! git diff-index --quiet HEAD --; then
        echo -e "${YELLOW}💾 保存当前未提交的更改...${NC}"
        git stash push -m "auto-stash-before-restore-$(date +%Y%m%d_%H%M%S)"
    fi
    
    # 重置到备份分支
    echo -e "${YELLOW}🔄 重置到备份分支...${NC}"
    git reset --hard "${branch}"
    
    echo -e "${GREEN}✅ 恢复完成！${NC}"
}

# 主逻辑
USE_BRANCH=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -l|--list)
            list_backups
            exit 0
            ;;
        -b|--branch)
            USE_BRANCH=true
            shift
            ;;
        -*)
            echo -e "${RED}❌ 未知选项: $1${NC}"
            show_help
            exit 1
            ;;
        *)
            break
            ;;
    esac
done

if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

if [ "$USE_BRANCH" = true ]; then
    restore_from_branch "$1"
else
    restore_from_archive "$1"
fi

echo -e "${GREEN}=======================================${NC}"
echo -e "${GREEN}     ✅ 恢复完成！${NC}"
echo -e "${GREEN}=======================================${NC}"
echo -e "建议运行以下命令验证："
echo -e "  ${YELLOW}pnpm install${NC}"
echo -e "  ${YELLOW}pnpm run dev${NC}"
