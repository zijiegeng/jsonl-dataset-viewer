# 上传到 GitHub 指南

## 准备工作

你的项目已经准备好上传到 GitHub 了！我已经完成了以下工作：

✅ 创建了专业的 README.md（包含功能介绍、使用说明、示例等）
✅ 添加了 MIT 开源协议
✅ 更新了 .gitignore（排除了隐私文件和开发文件）
✅ 初始化了 git 仓库并创建了首次提交
✅ 移除了所有个人路径信息

## 上传步骤

### 方法 1: 使用 GitHub CLI（推荐）

1. 首先登录 GitHub CLI：
```bash
gh auth login
```
按照提示选择：
- GitHub.com
- HTTPS
- Yes (authenticate with your GitHub credentials)
- Login with a web browser

2. 运行上传脚本：
```bash
./upload_to_github.sh
```

完成！仓库会自动创建并推送。

### 方法 2: 手动创建仓库

1. 访问 https://github.com/new
2. 创建新仓库：
   - Repository name: `jsonl-dataset-viewer`
   - Description: `A lightweight browser-based tool to inspect and visualize LLM training datasets`
   - 选择 Public
   - **不要**勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

3. 在本地项目目录运行：
```bash
git remote add origin https://github.com/YOUR_USERNAME/jsonl-dataset-viewer.git
git branch -M main
git push -u origin main
```

## 已排除的文件

以下文件不会上传到 GitHub（已在 .gitignore 中）：

- `.claude/` - Claude 工作目录
- `IMPLEMENTATION.md` - 实现细节文档
- `PROJECT_STATUS.md` - 项目状态文档
- `QUICKSTART.md` - 快速开始文档
- `SPEC.md` - 规格说明文档
- `start.sh` - 旧的启动脚本
- `frontend/` - React 版本（未使用）
- `__pycache__/` - Python 缓存
- `.DS_Store` - macOS 系统文件

## 上传的文件

✅ `backend/` - 后端代码
✅ `test_dataset.jsonl` - 示例数据集
✅ `run.sh` - 启动脚本
✅ `README.md` - 项目说明
✅ `LICENSE` - MIT 开源协议
✅ `.gitignore` - Git 忽略规则

## 隐私检查

✅ 已移除所有个人路径（如 `/Users/gengzijie/...`）
✅ 测试数据集只包含示例数据，无真实信息
✅ 没有包含任何密钥、密码或敏感配置

## 后续步骤

上传成功后，你可以：

1. 在 GitHub 仓库页面添加 Topics（标签）：
   - `llm`
   - `dataset-viewer`
   - `jsonl`
   - `fastapi`
   - `python`
   - `data-visualization`

2. 添加仓库描述和网站链接

3. 考虑添加 GitHub Actions 进行自动化测试

4. 如果需要，可以创建 GitHub Pages 展示项目

## 需要帮助？

如果遇到问题，可以：
- 检查 GitHub CLI 是否已登录：`gh auth status`
- 查看 git 状态：`git status`
- 查看远程仓库：`git remote -v`
