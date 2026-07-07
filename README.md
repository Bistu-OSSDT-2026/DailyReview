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

## 环境变量

复制 `.env.example` 为 `.env.local`，并填入 Supabase 项目配置：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

## 当前结构

```text
app/                 Next.js App Router 页面、登录页和管理端 actions
lib/                 Supabase client、鉴权和 reviews 数据访问层
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
