"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-charcoal mb-1.5"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full px-4 py-3 border rounded-lg bg-white text-charcoal",
            "placeholder:text-charcoal-400",
            "focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon",
            "transition-colors duration-200",
            "disabled:bg-charcoal-50 disabled:cursor-not-allowed",
            "resize-y min-h-[100px]",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-charcoal-200",
            className
          )}
          {...props}
        />

        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-charcoal-400">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
