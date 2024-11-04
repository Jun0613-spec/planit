import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { TaskStatus } from "@/types";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground dark:border-neutral-600",
        [TaskStatus.BACKLOG]:
          "border-transparent bg-neutral-600 text-white hover:bg-ghost-500/80 dark:bg-neutral-700 dark:hover:bg-neutral-600",
        [TaskStatus.TODO]:
          "border-transparent bg-orange-500 text-white hover:bg-orange-400/80 dark:bg-orange-600 dark:hover:bg-orange-500",
        [TaskStatus.IN_PROGRESS]:
          "border-transparent bg-emerald-500 text-white hover:bg-emerald-400/80 dark:bg-emerald-600 dark:hover:bg-emerald-500",
        [TaskStatus.IN_REVIEW]:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-400/80 dark:bg-yellow-600 dark:hover:bg-yellow-500",
        [TaskStatus.DONE]:
          "border-transparent bg-blue-500 text-white hover:bg-blue-400/80 dark:bg-blue-600 dark:hover:bg-blue-500"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };