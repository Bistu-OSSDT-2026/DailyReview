import ReviewEditor from "@/components/ReviewEditor";
import { requireUser } from "@/lib/auth";
import { getMyReviewByDate } from "@/lib/reviews";

function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

export default async function AdminPage() {
  await requireUser();

  const initialDate = getTodayDateString();
  const initialReview = await getMyReviewByDate(initialDate);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <ReviewEditor initialDate={initialDate} initialReview={initialReview} />
    </main>
  );
}
