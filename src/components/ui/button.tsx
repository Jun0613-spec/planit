import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-neutral-100 disabled:from-neutral-100 disabled:to-neutral-100 disabled:text-neutral-300 border border-neutral-200 dark:border-neutral-700 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-gradient-to-b from-rose-600 to-rose-700 text-primary-foreground dark:text-foreground hover:from-rose-700 hover:to-rose-800 dark:from-rose-700 dark:to-rose-800 dark:hover:from-rose-800 dark:hover:to-rose-900 disabled:bg-rose-100 disabled:from-rose-100 disabled:to-rose-100 disabled:text-rose-300 dark:disabled:bg-rose-100 dark:disabled:from-rose-100 dark:disabled:to-rose-100 dark:disabled:text-rose-300",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:bg-neutral-100 disabled:text-neutral-300 dark:disabled:bg-neutral-600 dark:disabled:text-neutral-500",
        primary:
          "bg-gradient-to-b from-sky-600 to-sky-700 text-primary-foreground dark:from-sky-700 dark:to-sky-800 dark:text-foreground hover:from-sky-700 hover:to-sky-700 dark:hover:from-sky-800 dark:hover:to-sky-900 disabled:bg-sky-100 disabled:from-sky-100 disabled:to-sky-100 disabled:text-sky-300 dark:disabled:bg-sky-100 dark:disabled:from-sky-100 dark:disabled:to-sky-100 dark:disabled:text-sky-300",
        secondary:
          "bg-transparent dark:bg-neutral-900 text-black dark:text-white hover:opacity-60 ",
        teritary:
          "bg-sky-100 text-sky-600 dark:bg-sky-800 dark:text-sky-100 border-transparent hover:bg-sky-200 shadow-none disabled:bg-sky-100 disabled:from-sky-100 disabled:to-sky-100 disabled:text-sky-300 dark:disabled:bg-sky-100 dark:disabled:from-sky-100 dark:disabled:to-sky-100 dark:disabled:text-sky-300",
        ghost:
          "border-none shadow-none hover:bg-transparent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        muted:
          "bg-neutral-200 text-neutral-600  hover:opacity-75 dark:bg-neutral-700 dark:text-neutral-300"
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 rounded-md px-2 text-xs",
        sm: "h-8 rounded-md px-3",
        lg: "h-12 rounded-md px-8",
        icon: "h-8 w-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
