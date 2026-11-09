import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-[#1b1405] hover:bg-[#f6c34a] shadow-[0_10px_30px_-14px_rgba(240,180,41,0.8)]",
        secondary:
          "bg-surface-2 text-fg border border-line hover:border-line-strong hover:bg-surface-3",
        ghost: "text-muted hover:text-fg hover:bg-surface-2",
        outline:
          "border border-line-strong text-fg hover:bg-surface-2 hover:border-muted/40",
        danger:
          "bg-down/10 text-down border border-down/25 hover:bg-down/15",
      },
      size: {
        sm: "h-9 px-3 text-[13px]",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-5 text-[15px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
