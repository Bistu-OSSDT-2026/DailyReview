const roadmap = [
  "项目骨架",
  "Supabase 数据层",
  "管理端编辑",
  "首页热力图",
  "公开复盘页",
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-8 sm:px-10 lg:px-16">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 py-12 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            DailyReview
          </p>
          <h1 className="mt-4 text-4xl font-bold text-slate-950 sm:text-5xl">
            日常复盘与任务追踪系统
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">
            用 Next.js、TypeScript、Tailwind CSS 和 Supabase 搭建的团队协作项目。
            当前已完成项目初始化、CI、Supabase 数据库基础模块以及登录鉴权与数据访问层。
            下一步进入管理端编辑模块。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {roadmap.map((item, index) => (
            <div
              className="rounded-lg border border-slate-200 bg-white/80 p-4 shadow-sm"
              key={item}
            >
              <div className="text-sm font-semibold text-emerald-700">
                Step {index}
              </div>
              <div className="mt-3 text-base font-semibold text-slate-950">
                {item}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white/80 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">技术栈</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Next.js App Router、React、TypeScript、Tailwind CSS、Supabase。
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white/80 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">当前结构</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              app、lib、supabase、docs、.github/workflows 和 schema.sql 已建立。
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white/80 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">下一步</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              开始管理端编辑模块，接入复盘编辑页面并复用已完成的 Server Actions 和 reviews 数据访问层。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
