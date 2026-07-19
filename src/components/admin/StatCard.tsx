import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendPositive = true,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-500">{label}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-ink-900">{value}</p>
      {trend && (
        <p className={cn("mt-1 text-xs font-medium", trendPositive ? "text-brand-600" : "text-red-600")}>
          {trend}
        </p>
      )}
    </div>
  );
}
