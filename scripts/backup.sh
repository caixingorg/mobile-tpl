#!/bin/bash

# 备份脚本 - 在执行每个阶段前运行

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${TIMESTAMP}"

# 获取当前分支
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

echo -e "${YELLOW}=======================================${NC}"
echo -e "${YELLOW}     开始创建项目备份${NC}"
echo -e "${YELLOW}=======================================${NC}"

# 检查 git 仓库
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ 错误：当前目录不是 Git 仓库${NC}"
    exit 1
fi

# 创建备份目录
mkdir -p ${BACKUP_DIR}

# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  检测到未提交的更改，建议先提交${NC}"
    read -p "是否自动提交当前更改？ (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "backup: auto commit before backup ${TIMESTAMP}"
        echo -e "${GREEN}✅ 已自动提交更改${NC}"
    else
        echo -e "${YELLOW}⚠️  继续备份，但未提交的更改不会包含在备份中${NC}"
    fi
fi

# 创建 Git 归档备份
echo -e "${YELLOW}📦 创建 Git 归档备份...${NC}"
if git archive --format=tar.gz --output=${BACKUP_DIR}/${BACKUP_NAME}.tar.gz HEAD; then
    echo -e "${GREEN}✅ 归档备份成功: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz${NC}"
else
    echo -e "${RED}❌ 归档备份失败${NC}"
    exit 1
fi

# 创建备份分支
BACKUP_BRANCH="backup/before-optimization-${TIMESTAMP}"
echo -e "${YELLOW}🌿 创建备份分支: ${BACKUP_BRANCH}${NC}"
if git branch ${BACKUP_BRANCH}; then
    echo -e "${GREEN}✅ 备份分支创建成功${NC}"
else
    echo -e "${RED}❌ 备份分支创建失败${NC}"
    exit 1
fi

# 生成备份信息文件
echo -e "${YELLOW}📝 生成备份信息...${NC}"
cat > ${BACKUP_DIR}/${BACKUP_NAME}-info.txt << EOF
备份时间: $(date '+%Y-%m-%d %H:%M:%S')
备份分支: ${BACKUP_BRANCH}
当前分支: ${CURRENT_BRANCH}
Git Commit: $(git rev-parse HEAD)
Git Message: $(git log -1 --pretty=%B)
备份文件: ${BACKUP_NAME}.tar.gz
EOF

echo -e "${GREEN}✅ 备份信息已保存${NC}"

# 列出最近备份
echo -e "${YELLOW}=======================================${NC}"
echo -e "${YELLOW}     最近的备份文件${NC}"
echo -e "${YELLOW}=======================================${NC}"
ls -lht ${BACKUP_DIR}/*.tar.gz 2>/dev/null | head -5

echo -e "${GREEN}=======================================${NC}"
echo -e "${GREEN}     ✅ 备份完成！${NC}"
echo -e "${GREEN}=======================================${NC}"
echo -e "备份分支: ${YELLOW}${BACKUP_BRANCH}${NC}"
echo -e "备份文件: ${YELLOW}${BACKUP_DIR}/${BACKUP_NAME}.tar.gz${NC}"
echo -e "如需回滚，请运行: ${YELLOW}./scripts/restore.sh ${BACKUP_NAME}.tar.gz${NC}"
