"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { getApprovedReviewsForProduct, submitReview } from "@/lib/firebase/reviews";
import { sanitizeInput } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types";
import StarRating from "@/components/ui/StarRating";

export default function ProductReviews({ productId }: { productId: string }) {
  const { firebaseUser, profile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getApprovedReviewsForProduct(productId)
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firebaseUser || !profile) {
      toast.error("Please sign in to write a review");
      return;
    }
    if (!title.trim() || !comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      await submitReview({
        productId,
        userId: firebaseUser.uid,
        userName: profile.displayName,
        userPhotoURL: profile.photoURL,
        rating,
        title: sanitizeInput(title),
        comment: sanitizeInput(comment),
        verified: true,
      });
      toast.success("Review submitted! It will appear after moderation.");
      setShowForm(false);
      setTitle("");
      setComment("");
      setRating(5);
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-ink-900">
          Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>
        <button onClick={() => setShowForm((v) => !v)} className="btn-outline text-sm">
          Write a Review
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-xl2 border border-ink-100 bg-ink-50 p-4">
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink-900">Your Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button key={i} type="button" onClick={() => setRating(i)} aria-label={`Rate ${i} stars`}>
                  <Star
                    size={22}
                    className={i <= rating ? "fill-accent-400 text-accent-400" : "fill-ink-200 text-ink-200"}
                  />
                </button>
              ))}
            </div>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Review title"
            className="input-field"
            maxLength={100}
            required
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="input-field min-h-[100px]"
            maxLength={1000}
            required
          />
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-5">
        {loading && <p className="text-sm text-ink-500">Loading reviews...</p>}
        {!loading && reviews.length === 0 && (
          <p className="text-sm text-ink-500">No reviews yet. Be the first to review this product!</p>
        )}
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-ink-100 pb-5 last:border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink-900">{review.userName}</p>
                <StarRating rating={review.rating} showCount={false} size={13} />
              </div>
              <span className="text-xs text-ink-400">{formatDate(review.createdAt)}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-ink-900">{review.title}</p>
            <p className="mt-1 text-sm text-ink-600">{review.comment}</p>
            {review.verified && (
              <span className="mt-2 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                Verified Purchase
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
