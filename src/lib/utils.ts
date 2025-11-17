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

/**
 * Format a date consistently for display (avoids hydration mismatches)
 * Returns format: "MM/DD/YYYY"
 */
export function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

/**
 * Format a time consistently for display (avoids hydration mismatches)
 * Returns format: "HH:MM" or "HH:MM:SS" if includeSeconds is true
 */
export function formatTime(date: Date, includeSeconds = false): string {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  if (includeSeconds) {
    const seconds = String(date.getSeconds()).padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }
  return `${hours}:${minutes}`
}

/**
 * Format a date and time together consistently
 * Returns format: "MM/DD/YYYY HH:MM" or "MM/DD/YYYY HH:MM:SS" if includeSeconds is true
 */
export function formatDateTime(date: Date, includeSeconds = false): string {
  return `${formatDate(date)} ${formatTime(date, includeSeconds)}`
}
