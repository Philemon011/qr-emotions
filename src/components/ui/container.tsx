import type { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

/**
 * Wrapper de largeur/padding utilisé par TOUTES les sections du site.
 * Garantit que les marges gauche/droite et la largeur max sont
 * identiques partout — essentiel pour un rendu "pixel perfect"
 * où rien ne semble décalé d'une section à l'autre.
 */

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Permet de rendre le container comme <section>, <header>, <div>... */
  as?: ElementType;
}

export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[1200px]",
        "px-5 sm:px-8 lg:px-10",
        className
      )}
    >
      {children}
    </Tag>
  );
}