# DailyReview v1.0.0 发布检查清单

本文档记录 DailyReview `v1.0.0` 发布前需要确认的内容。正式发布应在主线 PR 合并、CI 通过后进行。

## 发布范围

`v1.0.0` 包含以下内容：

- 首页 DailyReview 仪表盘。
- 年度复盘热力图和统计组件。
- 公开复盘列表页和详情页。
- 管理端复盘编辑器。
- Supabase Auth、Database、RLS 和真实写入流程。
- README、CONTRIBUTING、CHANGELOG 等项目文档。
- GitHub Actions 自动化质量检查。

## 发布前检查

- [ ] `main` 分支包含所有计划进入 `v1.0.0` 的 PR。
- [ ] 所有关联 Issue 已关闭，或在报告中有明确说明。
- [ ] `npm run lint` 通过。
- [ ] `npm run build` 通过。
- [ ] GitHub Actions `quality-check` 通过。
- [ ] README 已说明本地启动、Supabase 配置和 Vercel 部署方式。
- [ ] CHANGELOG 已记录 `v1.0.0` 变更。
- [ ] 仓库没有提交 `.env.local`、真实 Supabase key、Vercel token 或其他私密信息。

## Tag 与 Release

正式发布时建议创建：

- Tag：`v1.0.0`
- GitHub Release：`v1.0.0`
- Release Notes：概述本版本功能、协作流程、CI 验证和部署要求。

## 运行说明

项目可通过以下命令在本地启动：

```bash
npm install
npm run dev
```

完整登录、读取和写入功能需要配置 Supabase 环境变量，并在 Supabase 中执行 `schema.sql`。

## Release Notes 草案

```markdown
## DailyReview v1.0.0

本版本完成 DailyReview 课程项目的核心可运行版本。

### Features
- 首页仪表盘：年度热力图、统计卡片、年份切换和日期详情。
- 公开复盘：公开复盘列表页和按日期访问的详情页。
- 管理端编辑：登录用户可创建和保存每日复盘。
- Supabase 接入：Auth、reviews 表、RLS 策略、seed 数据和真实写入流程。

### Documentation
- README：项目说明、本地启动、Supabase/Vercel 配置和协作流程。
- CONTRIBUTING：Issue、Branch、Commit、PR、Review、CI、Merge 流程。
- CHANGELOG：记录 v1.0.0 阶段主要变更。
- Evidence chain：整理课程报告可引用的协作证据。

### Verification
- GitHub Actions `quality-check` 通过。
- 本地 `npm run lint` 通过。
- 本地 `npm run build` 通过。

### Notes
- 完整功能需要配置 Supabase 项目和环境变量。
- 仓库不包含 `.env.local`、真实 Supabase key 或 Vercel token。
```
