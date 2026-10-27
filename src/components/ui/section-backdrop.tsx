/**
 * Formes floues colorées en arrière-plan de section.
 * Purement décoratif — toujours en `-z-10`, `pointer-events-none`,
 * et à très faible opacité pour rester discret ("page blanche" → vivant,
 * sans jamais distraire du contenu).
 *
 * `shapes` définit la position/couleur/taille de chaque forme, pour que
 * chaque section ait une composition différente (pas de motif répétitif).
 */

interface Shape {
  color: string;
  size: number; // en px
  top: string; // ex: "10%", "-10%"
  left?: string;
  right?: string;
  opacity?: number; // 0 à 1, défaut 0.12
}

export function SectionBackdrop({ shapes }: { shapes: Shape[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {shapes.map((shape, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top,
            left: shape.left,
            right: shape.right,
            backgroundColor: shape.color,
            opacity: shape.opacity ?? 0.12,
          }}
        />
      ))}
    </div>
  );
}