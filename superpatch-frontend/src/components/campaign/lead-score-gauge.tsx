"use client";

import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface LeadScoreGaugeProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LeadScoreGauge({
  score,
  showLabel = true,
  size = "md",
  className,
}: LeadScoreGaugeProps) {
  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score));
  
  // Determine color based on score
  const getScoreColor = (s: number) => {
    if (s >= 70) return { bg: "bg-purple-500", text: "text-purple-700 dark:text-purple-300", label: "Hot" };
    if (s >= 40) return { bg: "bg-blue-500", text: "text-blue-700 dark:text-blue-300", label: "Warm" };
    if (s > 0) return { bg: "bg-gray-400", text: "text-gray-700 dark:text-gray-300", label: "Cool" };
    return { bg: "bg-gray-300", text: "text-gray-500", label: "None" };
  };

  const colorInfo = getScoreColor(clampedScore);

  const sizeClasses = {
    sm: { container: "h-1.5", width: "w-16", text: "text-[10px]" },
    md: { container: "h-2", width: "w-24", text: "text-xs" },
    lg: { container: "h-3", width: "w-32", text: "text-sm" },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showLabel && (
        <div className={cn("flex items-center gap-1", colorInfo.text, sizes.text)}>
          <TrendingUp className="w-3 h-3" />
          <span className="font-semibold">{clampedScore}</span>
        </div>
      )}
      <div className={cn("rounded-full bg-muted overflow-hidden", sizes.container, sizes.width)}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", colorInfo.bg)}
          style={{ width: `${clampedScore}%` }}
        />
      </div>
      {showLabel && size !== "sm" && (
        <span className={cn(sizes.text, "text-muted-foreground")}>{colorInfo.label}</span>
      )}
    </div>
  );
}
