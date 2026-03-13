"use client";

import { ThemeEditor } from "@/components/ThemeEditor";
import { AssetManager } from "@/components/AssetManager";
import { CarouselBuilder } from "@/components/CarouselBuilder";
import { RenderCanvas } from "@/components/RenderCanvas";
import { LLMBridge } from "@/components/LLMBridge";
import { useGoogleFonts } from "@/hooks/useGoogleFonts";
import { useJsonvasStore } from "@/store/useJsonvasStore";
import { useEffect } from "react";
import styles from "@/styles/workspace.module.css";

export function Workspace() {
  useGoogleFonts();

  // Ctrl+Z / Ctrl+Shift+Z undo/redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Skip when typing in inputs/textareas
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        useJsonvasStore.getState().undo();
      } else if (
        (e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey ||
        (e.ctrlKey || e.metaKey) && e.key === "y"
      ) {
        e.preventDefault();
        useJsonvasStore.getState().redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <span className={styles.headerTitle}>Jsonvas</span>
        <div className={styles.headerActions}>
          <LLMBridge />
        </div>
      </header>

      {/* Left panel: theme + assets */}
      <aside className={styles.leftPanel}>
        <ThemeEditor />
        <AssetManager />
      </aside>

      {/* Center: render canvas */}
      <main className={styles.canvas}>
        <RenderCanvas />
      </main>

      {/* Right panel: carousel builder */}
      <aside className={styles.rightPanel}>
        <CarouselBuilder />
      </aside>
    </div>
  );
}
