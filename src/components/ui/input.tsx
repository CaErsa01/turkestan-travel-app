import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-turquoise/20 bg-white px-4 text-sm text-navy outline-none transition focus:border-turquoise focus:ring-2 focus:ring-turquoise/20 dark:border-white/10 dark:bg-navy dark:text-surface",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
