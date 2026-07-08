"use client";

// ============================================================
// ReviewEditor —— 复盘编辑器
// 功能：
//   1. 日期选择、标题输入、内容输入（Markdown）
//   2. 心情选择（引用 MoodSelector）
//   3. 标签输入（引用 TagInput）
//   4. 公开/私密切换
//   5. 表单校验（日期和标题必填）
//   6. 保存状态显示（保存中/成功/失败）
//   7. 接入已有 app/admin/actions.ts 的 createReviewAction
// ============================================================

import { useState, type FormEvent } from "react";
import { createReviewAction } from "@/app/admin/actions";
import type { SaveStatus } from "@/types/review";
import TagInput from "./TagInput";
import MoodSelector from "./MoodSelector";

// ================================================================
// 表单数据（本地 state 类型，与 actions.ts 的字段对齐）
// ================================================================
type ReviewFormState = {
  date: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  is_public: boolean;
};

function createInitialFormState(): ReviewFormState {
  return {
    date: new Date().toISOString().split("T")[0],
    title: "",
    content: "",
    mood: "",
    tags: [],
    is_public: false,
  };
}

// ================================================================
// 主组件
// ================================================================
export default function ReviewEditor() {
  const [formData, setFormData] = useState<ReviewFormState>(
    createInitialFormState,
  );

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errors, setErrors] = useState<{ date?: string; title?: string }>({});
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // ========== 更新表单字段 ==========
  const updateField = <K extends keyof ReviewFormState>(
    field: K,
    value: ReviewFormState[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveMessage(null);
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ========== 表单校验 ==========
  const validate = (): boolean => {
    setSaveMessage(null);
    const newErrors: typeof errors = {};
    if (!formData.date.trim()) newErrors.date = "请选择日期";
    if (!formData.title.trim()) newErrors.title = "请输入标题";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========== 构建 FormData 并提交 ==========
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setSaveStatus("saving");

    try {
      // 构建 FormData，字段与 app/admin/actions.ts 的 parseReviewInput 对齐
      const data = new FormData();
      data.set("date", formData.date);
      data.set("title", formData.title);
      data.set("content", formData.content);
      if (formData.mood) data.set("mood", formData.mood);
      // 标签以逗号分隔传给 actions（actions 里会 parseTags 拆分）
      data.set("tags", formData.tags.join(","));
      // is_public: checkbox 方式，勾选时传 "on"
      if (formData.is_public) data.set("is_public", "on");

      const savedReview = await createReviewAction(data);

      setFormData(createInitialFormState());
      setSaveStatus("success");
      setSaveMessage(`已保存到 Supabase：${savedReview.title}`);
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(
        error instanceof Error
          ? error.message
          : "保存失败，请确认已登录并正确配置 Supabase 环境变量。",
      );
    }
  };

  // ========== 渲染界面 ==========
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800">📝 写复盘</h1>

      {/* ---- 日期 ---- */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          日期 <span className="text-red-500">*</span>
        </label>
        <input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => updateField("date", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.date ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
      </div>

      {/* ---- 标题 ---- */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          标题 <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="今天做了什么？学到了什么？"
          maxLength={100}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      {/* ---- 心情 ---- */}
      <MoodSelector
        value={formData.mood || undefined}
        onChange={(mood) => updateField("mood", mood)}
      />

      {/* ---- 标签 ---- */}
      <TagInput
        tags={formData.tags}
        onChange={(tags) => updateField("tags", tags)}
      />

      {/* ---- Markdown 内容 ---- */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          内容 <span className="text-gray-400">（支持 Markdown 格式）</span>
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => updateField("content", e.target.value)}
          placeholder={`## 今天做了什么\n- 完成了...\n- 学习了...\n\n## 收获与反思\n今天最大的收获是...\n\n## 明日计划\n- [ ] 要完成...`}
          rows={12}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      {/* ---- 公开/私密切换 ---- */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="font-medium text-gray-700">公开复盘</p>
          <p className="text-xs text-gray-500">
            {formData.is_public
              ? "所有人可以看到这篇复盘"
              : "只有你自己可以看到这篇复盘"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => updateField("is_public", !formData.is_public)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
            formData.is_public ? "bg-blue-500" : "bg-gray-300"
          }`}
          role="switch"
          aria-checked={formData.is_public}
          aria-label="公开/私密切换"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              formData.is_public ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* ---- 保存按钮 & 状态 ---- */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saveStatus === "saving"}
          className={`px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 ${
            saveStatus === "saving"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95"
          }`}
        >
          {saveStatus === "saving" ? "保存中..." : "💾 保存"}
        </button>
        {saveStatus === "success" && (
          <span className="text-green-600 text-sm font-medium">✅ 保存成功！</span>
        )}
        {saveStatus === "error" && (
          <span className="text-red-600 text-sm font-medium">❌ 保存失败，请重试</span>
        )}
      </div>

      {saveMessage && (
        <p
          className={`rounded-md border px-3 py-2 text-sm ${
            saveStatus === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {saveMessage}
        </p>
      )}
    </form>
  );
}
