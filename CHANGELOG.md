# Changelog

本文档记录 DailyReview 项目的主要版本变更。

格式参考 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)，版本号遵循语义化版本思路。

## [v1.0.0] - 2026-07-08

### Added

- 初始化 DailyReview Next.js 项目结构。
- 添加 GitHub Actions `quality-check`，用于 PR 的 lint/build 自动检查。
- 添加 Supabase `reviews` 表、索引、RLS 策略和 seed 数据。
- 添加 Supabase Auth 登录页和用户鉴权辅助函数。
- 添加 `reviews` 数据访问层，支持公开复盘读取、日期详情、热力图数据和管理端写入。
- 添加管理端复盘编辑器，包括日期、标题、内容、心情、标签和公开/私密状态。
- 添加首页热力图、统计卡片、年份切换和日期详情面板。
- 添加公开复盘列表页 `/reviews` 和详情页 `/reviews/[date]`。
- 添加 Markdown 渲染组件和空状态组件。
- 接入首页 DailyReview 仪表盘，整合热力图、统计卡片、详情面板和公开复盘入口。
- 接入管理端 Supabase 真实写入流程，通过 Server Actions 保存复盘数据。
- 添加 CONTRIBUTING 贡献流程说明。

### Changed

- 整理 README，补充项目功能、运行方式、Supabase 配置、Vercel 部署和协作流程说明。
- 补充 Supabase 配置文档，说明环境变量、RLS、seed 数据和管理端写入验证流程。
- 补录早期 PR 与 Issue 的历史关联，完善协作证据链。

### Security

- `.env.local` 和真实密钥保持在 `.gitignore` 中，不进入仓库。
- 文档明确禁止提交 Supabase `service_role` key、数据库密码、Vercel token 和其他真实密钥。
- `reviews` 表启用 RLS：公开复盘可被访客读取，私密复盘仅创建者可管理。

### Verified

- `npm run lint` 通过。
- `npm run build` 通过。
- 主要功能 PR 均通过 GitHub Actions `quality-check`。
- 关键协作流程形成 Issue -> Branch -> PR -> Review/Comment -> CI -> Merge -> Issue Closed 记录。
