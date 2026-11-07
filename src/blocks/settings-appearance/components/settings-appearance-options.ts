// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export type Density = "comfortable" | "compact" | "calm";
export type Motion = "system" | "reduced";
export type PaperChoice = "plain" | "ruled" | "graph" | "dots" | "kraft";
export type Direction = "ltr" | "rtl";
export type Appearance = {
  theme: string;
  density: Density;
  motion: Motion;
  fine: boolean;
  paper: PaperChoice;
  dir: Direction;
};
export const DEFAULT_APPEARANCE: Appearance = {
  theme: "notebook" as const,
  density: "comfortable" as const,
  motion: "system" as const,
  fine: false,
  paper: "ruled" as const,
  dir: "ltr" as const
};
export const THEMES = [{
  id: "notebook" as const,
  name: "Notebook" as const,
  help: "Cream paper, felt tip, terracotta marker." as const,
  ready: true
}, {
  id: "forest" as const,
  name: "Forest" as const,
  help: "Sage felt, kraft slips, petrol-teal ink." as const,
  ready: false
}, {
  id: "zine" as const,
  name: "Zine" as const,
  help: "Lilac mat, louder stickers, heavier pens." as const,
  ready: false
}];
export const DENSITIES: {
  id: Density;
  name: string;
  help: string;
}[] = [{
  id: "comfortable" as const,
  name: "Comfortable" as const,
  help: "Roomy controls, the full hand-drawn wobble." as const
}, {
  id: "compact" as const,
  name: "Compact" as const,
  help: "Tighter controls for people who like to see more." as const
}, {
  id: "calm" as const,
  name: "Calm" as const,
  help: "Hairline pencil, no wobble, no tilt. For tables and long forms." as const
}];
export const MOTIONS: {
  id: Motion;
  name: string;
  help: string;
}[] = [{
  id: "system" as const,
  name: "Follow my device" as const,
  help: "Ink is written on, paper settles. Off when your device asks for less motion." as const
}, {
  id: "reduced" as const,
  name: "Keep it still" as const,
  help: "Everything just appears, finished." as const
}];
export const PAPERS: {
  id: PaperChoice;
  name: string;
}[] = [{
  id: "plain" as const,
  name: "Plain" as const
}, {
  id: "ruled" as const,
  name: "Ruled" as const
}, {
  id: "graph" as const,
  name: "Graph" as const
}, {
  id: "dots" as const,
  name: "Dots" as const
}, {
  id: "kraft" as const,
  name: "Kraft" as const
}];
export function providerProps(a: Appearance) {
  return {
    density: a.density,
    motion: a.motion,
    tier: a.fine ? "hi" as const : "lo" as const,
    dir: a.dir,
    theme: a.theme === "notebook" ? undefined : a.theme
  };
}
export function providerSnippet(a: Appearance): string {
  const attrs: string[] = [];
  if (a.theme !== "notebook") attrs.push(`theme="${a.theme}"`);
  if (a.density !== "comfortable") attrs.push(`density="${a.density}"`);
  if (a.motion !== "system") attrs.push(`motion="${a.motion}"`);
  if (a.fine) attrs.push(`tier="hi"`);
  if (a.dir !== "ltr") attrs.push(`dir="${a.dir}"`);
  const open = attrs.length ? `<InkProvider ${attrs.join(" ")}>` : "<InkProvider>" as const;
  return `import { InkProvider } from "@/lib/ink/react"\n\n${open}\n  <App />\n</InkProvider>`;
}
