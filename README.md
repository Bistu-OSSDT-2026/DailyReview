# DailyReview

DailyReview 是一个日常复盘与任务追踪系统，用于记录每日计划、完成情况、问题复盘和阶段总结。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase

## 本地启动

```bash
npm install
npm run dev
```

启动后访问 http://localhost:3000。

完整登录、读取和写入功能需要先配置 Supabase。没有 Supabase 环境变量时，项目仍可构建，但真实数据功能无法完整使用。

## 环境变量

复制 `.env.example` 为 `.env.local`，并填入 Supabase 项目配置：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

真实值只放在本地 `.env.local` 或 Vercel Environment Variables 中，不要提交到 GitHub。

## 管理端 Supabase 写入

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

## 当前结构

```text
app/                 Next.js App Router 页面、首页仪表盘、登录页、管理端页面、公开复盘页面和 Server Actions
components/          可复用 React 组件（HomeDashboard、ReviewEditor、TagInput、MoodSelector、ReviewHeatmap、StatsCards、ReviewCard、MarkdownRenderer、EmptyState）
lib/                 Supabase client、鉴权和 reviews 数据访问层
types/               管理端编辑器和首页展示类型定义
supabase/            Supabase seed 数据
docs/                项目文档和 PR 流程记录
.github/workflows/   GitHub Actions CI
schema.sql           Supabase reviews 表和 RLS 策略
```

## 常用命令

```bash
npm run dev      # 启动开发服务
npm run build    # 生产构建
npm run start    # 启动生产服务
npm run lint     # 运行 ESLint
```
