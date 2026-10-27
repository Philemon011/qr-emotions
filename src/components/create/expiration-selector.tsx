"use client";

import { Clock } from "iconsax-react";
import { EXPIRATION_OPTIONS, type ExpirationDays } from "@/lib/validation";

interface ExpirationSelectorProps {
  value: ExpirationDays;
  onChange: (value: ExpirationDays) => void;
  accentColor: string;
}

export function ExpirationSelector({ value, onChange, accentColor }: ExpirationSelectorProps) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-ink-950">
        <Clock size={16} variant="Bold" color="var(--color-ink-500)" />
        Durée de vie du message
        <span className="font-normal text-ink-300">(optionnel)</span>
      </label>
      <p className="mt-1 text-xs text-ink-500">
        Par défaut, votre message reste disponible pour toujours.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {EXPIRATION_OPTIONS.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onChange(option.value)}
              className="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
              style={{
                borderColor: isActive ? accentColor : "var(--color-ink-100)",
                backgroundColor: isActive ? accentColor : "transparent",
                color: isActive ? "#ffffff" : "var(--color-ink-500)",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}