-- ============================================================
-- DailyReview - Supabase Schema
-- 负责：成员 B
-- 分支：feature/supabase-schema
-- 说明：创建 reviews 表、启用 RLS、配置权限策略
-- ============================================================

-- ------------------------------------------------------------
-- 1. reviews 表
-- ------------------------------------------------------------

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  date        date not null,
  title       text not null,
  content     text not null,
  mood        text,
  tags        text[] default '{}',
  is_public   boolean default false,
  user_id     uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ------------------------------------------------------------
-- 2. 索引
-- ------------------------------------------------------------

-- 热力图按年查询：where date >= '2025-01-01' and date < '2026-01-01'
create index if not exists idx_reviews_date on public.reviews (date);

-- 用户查询自己的复盘
create index if not exists idx_reviews_user_id on public.reviews (user_id);

-- 公开复盘列表查询
create index if not exists idx_reviews_public_date
  on public.reviews (date desc) where is_public = true;

-- 同一用户同一天只允许一条复盘（可选，按需启用）
-- create unique index if not exists idx_reviews_user_date
--   on public.reviews (user_id, date);

-- ------------------------------------------------------------
-- 3. updated_at 自动更新触发器
-- ------------------------------------------------------------

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_reviews_updated_at on public.reviews;
create trigger trg_reviews_updated_at
  before update on public.reviews
  for each row
  execute function public.handle_updated_at();

-- ------------------------------------------------------------
-- 4. 启用 Row Level Security (RLS)
-- ------------------------------------------------------------

alter table public.reviews enable row level security;

-- ------------------------------------------------------------
-- 5. 表级权限 grant
--    RLS 只管"哪些行可见"，不等于表一定能被角色访问，需要显式 grant
-- ------------------------------------------------------------

-- anon（未登录访客）：只能读取（公开复盘由 RLS 策略过滤）
grant select on public.reviews to anon;

-- authenticated（登录用户）：可以对自己的复盘做增删改查
grant select, insert, update, delete on public.reviews to authenticated;

-- ------------------------------------------------------------
-- 6. RLS 权限策略
-- ------------------------------------------------------------

-- 5.1 公开读取：所有人（包括未登录访客）可以读取 is_public = true 的复盘
drop policy if exists "reviews_public_select" on public.reviews;
create policy "reviews_public_select"
  on public.reviews
  for select
  to anon, authenticated
  using (is_public = true);

-- 5.2 登录用户查看自己的全部复盘（包括私密）
drop policy if exists "reviews_owner_select" on public.reviews;
create policy "reviews_owner_select"
  on public.reviews
  for select
  to authenticated
  using (auth.uid() = user_id);

-- 5.3 登录用户可以新增自己的复盘
drop policy if exists "reviews_owner_insert" on public.reviews;
create policy "reviews_owner_insert"
  on public.reviews
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- 5.4 登录用户只能更新自己的复盘
drop policy if exists "reviews_owner_update" on public.reviews;
create policy "reviews_owner_update"
  on public.reviews
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5.5 登录用户只能删除自己的复盘
drop policy if exists "reviews_owner_delete" on public.reviews;
create policy "reviews_owner_delete"
  on public.reviews
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- Schema 结束
-- ============================================================
