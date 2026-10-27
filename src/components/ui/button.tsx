"use client";

import { forwardRef, cloneElement, isValidElement } from "react";
import { m, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Bouton de base du design system.
 * Supporte `asChild` : quand true, applique le style du bouton à l'élément
 * enfant (ex: un <a>) au lieu de rendre un <button> — utile pour les CTA
 * qui sont en réalité des liens (navigation), sans imbriquer un bouton
 * dans un lien (invalide en HTML).
 */

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-ink-950 text-paper-50 hover:bg-ink-900 shadow-soft",
  secondary: "bg-paper-50 text-ink-950 border border-ink-100 hover:bg-paper-100",
  ghost: "bg-transparent text-ink-950 hover:bg-ink-100/60",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, children, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2",
      "rounded-full font-medium tracking-tight",
      "transition-colors duration-200",
      "disabled:opacity-40 disabled:pointer-events-none",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    // Si asChild et qu'on a bien un seul élément enfant valide (ex: <a>),
    // on lui applique directement les classes du bouton, sans wrapper.
    if (asChild && isValidElement(children)) {
      return cloneElement(
        children as React.ReactElement<{ className?: string }>,
        {
          className: cn(classes, (children as React.ReactElement<{ className?: string }>).props.className),
        }
      );
    }

    return (
      <m.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={classes}
        {...props}
      >
        {children}
      </m.button>
    );
  }
);

Button.displayName = "Button";