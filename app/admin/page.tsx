// ============================================================
// app/admin/page.tsx —— 管理端页面
// 访问地址：/admin
//
// 说明：
//   调用 requireUser() 确保只有登录用户可以访问此页面。
//   未登录用户会被重定向到 /login。
//   登录后渲染 ReviewEditor 复盘编辑器。
//   编辑器已接入 app/admin/actions.ts 的 createReviewAction。
// ============================================================

import { requireUser } from "@/lib/auth";
import ReviewEditor from "@/components/ReviewEditor";

export default async function AdminPage() {
  // 确保用户已登录，未登录则自动重定向到 /login
  await requireUser();

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <ReviewEditor />
    </main>
  );
}
