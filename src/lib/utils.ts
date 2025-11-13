import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const POSITIVE_STATUS_KEYWORDS = [
  "healthy",
  "passed",
  "success",
  "ready",
  "deployed",
  "available",
  "active",
  "completed",
  "ok",
  "running",
  "up",
]

const NEGATIVE_STATUS_KEYWORDS = [
  "failed",
  "unhealthy",
  "down",
  "degraded",
  "error",
  "inactive",
  "blocked",
  "critical",
  "stopped",
  "cancelled",
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusToneClass(status?: string | null) {
  if (!status) {
    return ""
  }

  const normalized = status.trim().toLowerCase()

  if (POSITIVE_STATUS_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
  }

  if (NEGATIVE_STATUS_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return "border border-red-500/30 bg-red-500/15 text-red-300"
  }

  return ""
}
