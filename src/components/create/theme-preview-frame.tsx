"use client";

import type { ComponentType } from "react";
import type { ThemeProps } from "@/types/message";

/**
 * Cadre "téléphone" qui affiche le VRAI composant de thème (avec ses
 * animations, particules, etc.), redimensionné pour tenir dans l'aperçu
 * de l'éditeur. Le composant est rendu à sa taille réelle (390×844,
 * gabarit mobile standard) puis mis à l'échelle via CSS `transform: scale`,
 * avec `overflow: hidden` sur le cadre pour rogner proprement les bords.
 */

const NATIVE_WIDTH = 390;
const NATIVE_HEIGHT = 844;

interface ThemePreviewFrameProps {
  ThemeComponent: ComponentType<ThemeProps>;
  content: ThemeProps["content"];
  frameWidth?: number;
}

export function ThemePreviewFrame({
  ThemeComponent,
  content,
  frameWidth = 300,
}: ThemePreviewFrameProps) {
  const scale = frameWidth / NATIVE_WIDTH;
  const frameHeight = NATIVE_HEIGHT * scale;

  return (
    <div
      className="overflow-hidden rounded-[2.25rem] border-[6px] border-ink-950 shadow-float"
      style={{ width: frameWidth, height: frameHeight }}
    >
      <div
        style={{
          width: NATIVE_WIDTH,
          height: NATIVE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <ThemeComponent content={content} />
      </div>
    </div>
  );
}