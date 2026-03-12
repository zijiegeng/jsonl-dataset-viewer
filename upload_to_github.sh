#!/bin/bash

# GitHub 上传脚本
# 使用前请确保已登录 GitHub CLI: gh auth login

echo "正在创建 GitHub 仓库..."

# 创建公开仓库
gh repo create jsonl-dataset-viewer \
  --public \
  --source=. \
  --description="A lightweight browser-based tool to inspect and visualize LLM training datasets stored as JSONL files" \
  --push

echo ""
echo "✅ 仓库创建成功！"
echo ""
echo "仓库地址: https://github.com/$(gh api user -q .login)/jsonl-dataset-viewer"
echo ""
echo "你可以访问上面的链接查看你的项目。"
