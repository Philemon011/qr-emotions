"use client";

import Link from "next/link";
import { m } from "framer-motion";
import type { Occasion } from "@/types/message";

export function OccasionCard({ occasion, index }: { occasion: Occasion; index: number }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={`/creer/${occasion.slug}`}
        className="flex flex-col items-center gap-3 rounded-2xl border border-ink-100 bg-paper-50 px-4 py-8 text-center shadow-soft transition-shadow hover:shadow-card"
      >
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
          style={{ backgroundColor: `${occasion.color}1A` }}
        >
          {occasion.emoji}
        </span>
        <span className="text-base font-semibold text-ink-950">{occasion.label}</span>
        <span className="text-xs text-ink-300">
          {occasion.themes.length} {occasion.themes.length > 1 ? "thèmes disponibles" : "thème disponible"}
        </span>
      </Link>
    </m.div>
  );
}