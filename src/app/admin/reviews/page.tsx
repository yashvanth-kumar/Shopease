"use client";

import { useEffect, useState } from "react";
import { Check, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StarRating from "@/components/ui/StarRating";
import { getAllReviewsForAdmin, moderateReview, deleteReview } from "@/lib/firebase/reviews";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  async function load() {
    setLoading(true);
    try {
      setReviews(await getAllReviewsForAdmin());
    } catch {
      toast.error("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  async function handleModerate(review: Review, decision: "approved" | "rejected") {
    try {
      await moderateReview(review.id, review.productId, decision);
      toast.success(`Review ${decision}`);
      load();
    } catch {
      toast.error("Failed to moderate review.");
    }
  }

  async function handleDelete(review: Review) {
    try {
      await deleteReview(review.id);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
    } catch {
      toast.error("Failed to delete review.");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Review Moderation"
        subtitle={`${reviews.filter((r) => r.status === "pending").length} reviews awaiting moderation`}
      />

      <div className="mb-4 flex gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize ${
              filter === f ? "bg-brand-600 text-white" : "bg-white text-ink-600 hover:bg-ink-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading && <p className="text-sm text-ink-500">Loading reviews...</p>}
        {!loading && filtered.length === 0 && <p className="text-sm text-ink-500">No reviews in this filter.</p>}
        {filtered.map((review) => (
          <div key={review.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-ink-900">{review.userName}</p>
                  <StarRating rating={review.rating} showCount={false} size={13} />
                </div>
                <p className="mt-1 text-sm font-medium text-ink-900">{review.title}</p>
                <p className="mt-1 text-sm text-ink-600">{review.comment}</p>
                <p className="mt-2 text-xs text-ink-400">{formatDate(review.createdAt)} · Product ID: {review.productId}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                review.status === "approved" ? "bg-brand-50 text-brand-700" :
                review.status === "rejected" ? "bg-red-50 text-red-600" : "bg-accent-50 text-accent-700"
              }`}>
                {review.status}
              </span>
            </div>
            <div className="mt-3 flex gap-2 border-t border-ink-100 pt-3">
              {review.status !== "approved" && (
                <button onClick={() => handleModerate(review, "approved")} className="btn-outline !py-1.5 text-xs text-brand-700 hover:bg-brand-50">
                  <Check size={13} /> Approve
                </button>
              )}
              {review.status !== "rejected" && (
                <button onClick={() => handleModerate(review, "rejected")} className="btn-outline !py-1.5 text-xs text-accent-700 hover:bg-accent-50">
                  <X size={13} /> Reject
                </button>
              )}
              <button onClick={() => handleDelete(review)} className="btn-outline !py-1.5 text-xs text-red-600 hover:bg-red-50">
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
