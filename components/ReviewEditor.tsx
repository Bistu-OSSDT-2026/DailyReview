"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  createReviewAction,
  deleteReviewAction,
  getMyReviewByDateAction,
  updateReviewAction,
} from "@/app/admin/actions";
import type { Review } from "@/lib/reviews";
import type { SaveStatus } from "@/types/review";
import MoodSelector from "./MoodSelector";
import TagInput from "./TagInput";

type ReviewFormState = {
  date: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  is_public: boolean;
};

type ReviewEditorProps = {
  initialDate?: string;
  initialReview?: Review | null;
};

function getTodayDateString() {
  const now = new Date();
  const localTime = now.getTime() - now.getTimezoneOffset() * 60_000;
  return new Date(localTime).toISOString().split("T")[0];
}

function createBlankFormState(date = getTodayDateString()): ReviewFormState {
  return {
    date,
    title: "",
    content: "",
    mood: "",
    tags: [],
    is_public: false,
  };
}

function reviewToFormState(review: Review): ReviewFormState {
  return {
    date: review.date,
    title: review.title,
    content: review.content,
    mood: review.mood ?? "",
    tags: Array.isArray(review.tags) ? review.tags : [],
    is_public: review.is_public,
  };
}

function buildReviewFormData(input: ReviewFormState) {
  const data = new FormData();

  data.set("date", input.date);
  data.set("title", input.title);
  data.set("content", input.content);
  data.set("mood", input.mood);
  data.set("tags", input.tags.join(","));

  if (input.is_public) {
    data.set("is_public", "on");
  }

  return data;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export default function ReviewEditor({
  initialDate,
  initialReview,
}: ReviewEditorProps) {
  const firstDate = initialReview?.date ?? initialDate ?? getTodayDateString();
  const [formData, setFormData] = useState<ReviewFormState>(() =>
    initialReview ? reviewToFormState(initialReview) : createBlankFormState(firstDate),
  );
  const [reviewId, setReviewId] = useState<string | null>(
    initialReview?.id ?? null,
  );
  const [loadedDate, setLoadedDate] = useState(firstDate);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errors, setErrors] = useState<{ date?: string; title?: string }>({});

  useEffect(() => {
    const date = formData.date;

    if (!date || date === loadedDate) {
      return;
    }

    let isCurrent = true;

    getMyReviewByDateAction(date)
      .then((review) => {
        if (!isCurrent) return;

        if (review) {
          setReviewId(review.id);
          setFormData(reviewToFormState(review));
          setStatusMessage("已加载当天复盘，可以直接修改。");
        } else {
          setReviewId(null);
          setFormData(createBlankFormState(date));
          setStatusMessage("");
        }

        setLoadedDate(date);
      })
      .catch((error) => {
        if (!isCurrent) return;

        setReviewId(null);
        setSaveStatus("error");
        setStatusMessage(
          getErrorMessage(error, "加载复盘失败，请稍后重试。"),
        );
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoadingExisting(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [formData.date, loadedDate]);

  const updateField = <K extends keyof ReviewFormState>(
    field: K,
    value: ReviewFormState[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setStatusMessage("");

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDateChange = (date: string) => {
    const shouldLoad = Boolean(date) && date !== loadedDate;

    setReviewId(null);
    setFormData(createBlankFormState(date));
    setIsLoadingExisting(shouldLoad);
    setSaveStatus("idle");
    setStatusMessage(shouldLoad ? "正在加载这一天的复盘..." : "");

    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: undefined }));
    }
  };

  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!formData.date.trim()) {
      nextErrors.date = "请选择日期";
    }

    if (!formData.title.trim()) {
      nextErrors.title = "请输入标题";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    setSaveStatus("saving");
    setStatusMessage(reviewId ? "正在更新复盘..." : "正在保存复盘...");

    try {
      const savedReview = reviewId
        ? await updateReviewAction(reviewId, buildReviewFormData(formData))
        : await createReviewAction(buildReviewFormData(formData));

      setReviewId(savedReview.id);
      setLoadedDate(savedReview.date);
      setFormData(reviewToFormState(savedReview));
      setSaveStatus("success");
      setStatusMessage(reviewId ? "复盘已更新。" : "复盘已保存。");

      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch (error) {
      setSaveStatus("error");
      setStatusMessage(
        getErrorMessage(error, "保存失败，请确认登录状态和 Supabase 配置。"),
      );
    }
  };

  const handleDelete = async () => {
    if (!reviewId || isDeleting) return;

    const confirmed = window.confirm("确定要删除这一天的复盘吗？删除后可以重新填写。");
    if (!confirmed) return;

    setIsDeleting(true);
    setSaveStatus("saving");
    setStatusMessage("正在删除复盘...");

    try {
      const deletedReview = await deleteReviewAction(reviewId);
      const nextDate = deletedReview.date || formData.date;

      setReviewId(null);
      setLoadedDate(nextDate);
      setFormData(createBlankFormState(nextDate));
      setSaveStatus("success");
      setStatusMessage("复盘已删除，可以重新填写这一天的内容。");

      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch (error) {
      setSaveStatus("error");
      setStatusMessage(
        getErrorMessage(error, "删除失败，请稍后重试。"),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const isBusy = saveStatus === "saving" || isLoadingExisting || isDeleting;
  const messageClass =
    saveStatus === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : saveStatus === "success"
        ? "border-green-200 bg-green-50 text-green-700"
        : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">写复盘</h1>
          <p className="mt-1 text-sm text-gray-500">
            {reviewId ? `正在编辑 ${formData.date}` : `新建 ${formData.date}`}
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="date"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          日期 <span className="text-red-500">*</span>
        </label>
        <input
          id="date"
          type="date"
          value={formData.date}
          onChange={(event) => handleDateChange(event.target.value)}
          disabled={isBusy}
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.date ? "border-red-500" : "border-gray-300"
          } ${isBusy ? "bg-gray-100 text-gray-500" : "bg-white"}`}
        />
        {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
      </div>

      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          标题 <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="今天做了什么？学到了什么？"
          maxLength={100}
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      <MoodSelector
        value={formData.mood || undefined}
        onChange={(mood) => updateField("mood", mood)}
      />

      <TagInput
        tags={formData.tags}
        onChange={(tags) => updateField("tags", tags)}
      />

      <div>
        <label
          htmlFor="content"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          内容 <span className="text-gray-400">（支持 Markdown）</span>
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(event) => updateField("content", event.target.value)}
          placeholder={`## 今天做了什么
- 完成了...
- 学习了...

## 收获与反思
今天最大的收获是...

## 明日计划
- [ ] 要完成...`}
          rows={12}
          className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
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
          aria-label="切换公开状态"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              formData.is_public ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isBusy}
          className={`rounded-lg px-6 py-2 font-medium text-white transition-all duration-200 ${
            isBusy
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95"
          }`}
        >
          {saveStatus === "saving"
            ? "处理中..."
            : reviewId
              ? "更新复盘"
              : "保存复盘"}
        </button>

        {reviewId && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isBusy}
            className={`rounded-lg border px-5 py-2 font-medium transition-all duration-200 ${
              isBusy
                ? "cursor-not-allowed border-gray-200 text-gray-400"
                : "border-red-200 text-red-600 hover:bg-red-50"
            }`}
          >
            删除复盘
          </button>
        )}
      </div>

      {statusMessage && (
        <p className={`rounded-md border px-3 py-2 text-sm ${messageClass}`}>
          {statusMessage}
        </p>
      )}
    </form>
  );
}
