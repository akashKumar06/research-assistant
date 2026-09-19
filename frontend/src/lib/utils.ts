import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  const detail = (err as any)?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  const message = (err as any)?.message;
  if (typeof message === "string" && message) return message;
  return fallback;
}
