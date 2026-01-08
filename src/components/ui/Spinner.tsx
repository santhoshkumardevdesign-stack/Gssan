"use client";

import { cn } from "@/lib/utils";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-maroon/20 border-t-maroon",
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
}

export function LoadingOverlay({
  isLoading,
  text = "Loading...",
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <Spinner size="lg" />
      <p className="mt-4 text-charcoal-600 font-medium">{text}</p>
    </div>
  );
}

export interface InlineLoaderProps {
  text?: string;
  className?: string;
}

export function InlineLoader({
  text = "Loading...",
  className,
}: InlineLoaderProps) {
  return (
    <div className={cn("flex items-center gap-2 text-charcoal-500", className)}>
      <Spinner size="sm" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
