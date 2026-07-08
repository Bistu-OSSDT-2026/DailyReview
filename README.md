# DailyReview

DailyReview 是一个面向团队日常复盘的 Web 应用，用于记录每日计划、完成情况、问题复盘和阶段总结。项目采用 GitHub Issue、分支、Pull Request、Review、CI 和 Merge 的协作流程进行开发。

仓库地址：https://github.com/Bistu-OSSDT-2026/DailyReview

## 功能模块

- 首页仪表盘：展示年度复盘热力图、统计卡片、年份切换和日期详情。
- 登录鉴权：基于 Supabase Auth 的邮箱密码登录。
- 管理端编辑器：登录用户可在 `/admin` 编写复盘，并通过 Server Actions 写入 Supabase。
- 公开复盘列表：`/reviews` 展示公开复盘记录。
- 公开复盘详情：`/reviews/[date]` 展示单日公开复盘内容。
- Markdown 渲染：公开详情页支持 Markdown 内容展示。
- 数据权限：`reviews` 表启用 RLS，公开内容可读，私密内容仅创建者可管理。

## 技术栈

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase Auth / Database / RLS
- GitHub Actions CI

## 本地启动

```bash
npm install
npm run dev
```

启动后访问：

```text
http://localhost:3000
```

没有配置 Supabase 时，项目仍可执行 lint/build，但登录、读取和写入真实数据功能无法完整使用。

## 环境变量

复制 `.env.example` 为 `.env.local`，并填入 Supabase 项目配置：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

真实值只放在本地 `.env.local` 或 Vercel Environment Variables 中，不要提交到 GitHub。

严禁提交：

```text
.env.local
Supabase service_role key
数据库密码
Vercel token
任何真实密钥
```

## Supabase 配置

完整功能需要先在 Supabase 中执行数据库配置：

1. 创建 Supabase 项目。
2. 在 SQL Editor 中执行 `schema.sql`。
3. 如需测试数据，执行 `supabase/seed.sql`。
4. 在 Supabase Auth 中创建测试用户。
5. 在 `.env.local` 中配置 Supabase URL 和 publishable/anon public key。

详细说明见 [docs/supabase-setup.md](docs/supabase-setup.md)。

## 管理端写入流程

管理端 `/admin` 已通过 Server Actions 接入 Supabase 数据层。登录用户填写复盘表单后，会调用 `createReviewAction`，并通过 `lib/reviews.ts` 中的 `createReview` 写入 `public.reviews` 表。

写入字段包括：

- `date`
- `title`
- `content`
- `mood`
- `tags`
- `is_public`
- `user_id`

数据库权限由 `schema.sql` 中的 RLS 策略控制：登录用户只能新增、修改和删除自己的复盘；未登录访客只能读取公开复盘。

## Vercel 部署

线上部署建议使用 Vercel：

1. 将 GitHub 仓库导入 Vercel。
2. 在 Vercel Project Settings -> Environment Variables 中配置 Supabase 环境变量。
3. 确认 Supabase 已执行 `schema.sql`。
4. 部署后访问生产域名验证首页、登录页、管理端和公开复盘页。

## 常用命令

```bash
npm run dev      # 启动开发服务
npm run build    # 生产构建
npm run start    # 启动生产服务
npm run lint     # 运行 ESLint
```

## 协作流程

本项目采用以下协作链条：

```text
Issue -> Branch -> Commit -> Pull Request -> Review -> CI -> Merge
```

提交 PR 前请确认：

- PR 正文通过 `Closes #Issue编号` 关联 Issue。
- 已运行 `npm run lint` 和 `npm run build`。
- 没有提交 `.env.local` 或真实密钥。
- CI `quality-check` 通过后再合并。

贡献流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。历史 PR 流程补录说明见 [docs/pr-flow.md](docs/pr-flow.md)。

## 当前结构

```text
app/                 Next.js App Router 页面、首页仪表盘、登录页、管理端页面、公开复盘页面和 Server Actions
components/          可复用 React 组件（HomeDashboard、ReviewEditor、TagInput、MoodSelector、ReviewHeatmap、StatsCards、ReviewCard、MarkdownRenderer、EmptyState）
lib/                 Supabase client、鉴权和 reviews 数据访问层
types/               管理端编辑器和首页展示类型定义
supabase/            Supabase seed 数据
docs/                项目文档、Supabase 配置和 PR 流程记录
.github/workflows/   GitHub Actions CI
schema.sql           Supabase reviews 表和 RLS 策略
CONTRIBUTING.md      团队贡献流程说明
CHANGELOG.md         版本变更记录
```

## 许可证

本项目使用 MIT License，详见 [LICENSE](LICENSE)。
