import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fusionne intelligemment des classes Tailwind conditionnelles.
 * - clsx : permet de passer des conditions (ex: isActive && "bg-black")
 * - twMerge : résout les conflits entre classes Tailwind
 *   (ex: cn("p-2", "p-4") renvoie bien "p-4", pas les deux)
 *
 * Utilisé dans absolument tous les composants pour composer les styles
 * proprement sans jamais avoir de classes qui se marchent dessus.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}