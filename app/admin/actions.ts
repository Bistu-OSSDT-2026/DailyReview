"use server";

import { revalidatePath } from "next/cache";
import {
  createReview,
  deleteReview,
  getMyReviewByDate,
  type ReviewInput,
  updateReview,
} from "@/lib/reviews";

function parseTags(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseReviewInput(formData: FormData): ReviewInput {
  return {
    date: String(formData.get("date") ?? ""),
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    mood: String(formData.get("mood") ?? "") || undefined,
    tags: parseTags(formData.get("tags")),
    is_public: formData.get("is_public") === "on",
  };
}

function revalidateReviewPaths(date?: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/reviews");

  if (date) {
    revalidatePath(`/reviews/${date}`);
  }
}

export async function getMyReviewByDateAction(date: string) {
  if (!date.trim()) {
    return null;
  }

  return getMyReviewByDate(date);
}

export async function createReviewAction(formData: FormData) {
  const review = await createReview(parseReviewInput(formData));
  revalidateReviewPaths(review.date);

  return review;
}

export async function updateReviewAction(id: string, formData: FormData) {
  const review = await updateReview(id, parseReviewInput(formData));
  revalidateReviewPaths(review.date);

  return review;
}

export async function deleteReviewAction(id: string) {
  const review = await deleteReview(id);
  revalidateReviewPaths(review.date);

  return review;
}
