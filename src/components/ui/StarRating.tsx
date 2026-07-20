import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({
  rating,
  reviewCount,
  size = 14,
  showCount = true,
}: {
  rating: number;
  reviewCount?: number;
  size?: number;
  showCount?: boolean;
}) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Rated ${rating} out of 5 stars`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={cn(
              i <= Math.round(rating) ? "fill-accent-400 text-accent-400" : "fill-ink-100 text-ink-200"
            )}
          />
        ))}
      </div>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-ink-500">({reviewCount})</span>
      )}
    </div>
  );
}
