// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export const DENSITIES = ["comfortable", "compact", "calm"] as const;
export const TIERS = ["lo", "hi"] as const;
export const TILTS = ["flat", "natural", "lively"] as const;
export type PlaygroundDensity = typeof DENSITIES[number];
export type PlaygroundTier = typeof TIERS[number];
export type PlaygroundTilt = typeof TILTS[number];
export interface PlaygroundState {
  density: PlaygroundDensity;
  tier: PlaygroundTier;
  reduced: boolean;
  tilt: PlaygroundTilt;
  take: number;
}
export const DEFAULT_STATE: PlaygroundState = {
  density: "comfortable" as const,
  tier: "lo" as const,
  reduced: false,
  tilt: "natural" as const,
  take: 1
};
export const seedOf = (state: Pick<PlaygroundState, "take">) => `take-${state.take}`;
export const TILT_MAX = {
  flat: "0deg" as const,
  natural: "2deg" as const,
  lively: "4deg" as const
} as const;
export const LIVELY_DEGREES = [2.8, -2.2, 1.6] as const;
export const isDefault = (s: PlaygroundState) => s.density === DEFAULT_STATE.density && s.tier === DEFAULT_STATE.tier && s.reduced === DEFAULT_STATE.reduced && s.tilt === DEFAULT_STATE.tilt;
export interface Snippets {
  provider: string;
  component: string | null;
  css: string | null;
  attributes: string | null;
}
export function snippets(state: PlaygroundState): Snippets {
  const props: string[] = [];
  if (state.tier !== DEFAULT_STATE.tier) props.push(`tier="${state.tier}"`);
  if (state.density !== DEFAULT_STATE.density) props.push(`density="${state.density}"`);
  if (state.reduced) props.push(`motion="reduced"`);
  const open = props.length ? `<InkProvider ${props.join(" ")}>` : "<InkProvider>" as const;
  const provider = `import { InkProvider } from "@/lib/ink/vue"

export function Providers({ children }: { children: Vue.VueNode }) {
  return (
    ${open}
      {children}
    </InkProvider>
  )
}`;
  const seed = seedOf(state);
  const tiltProp = state.tilt === "flat" ? " tilt={false}" as const : state.tilt === "lively" ? ` tilt={${LIVELY_DEGREES[0]}}` : "" as const;
  const component = state.take !== DEFAULT_STATE.take || state.tilt !== "natural" ? `<Card seed="${seed}"${tiltProp}>...</Card>   // the same seed always draws the same sheet` : null;
  const css = state.tilt === "lively" ? `:root {\n  --ll-tilt-max: ${TILT_MAX.lively}; /* how far any sheet may turn (Notebook: ${TILT_MAX.natural}) */\n}` : null;
  const attrs: string[] = [];
  if (state.density !== DEFAULT_STATE.density) attrs.push(`data-density="${state.density}"`);
  if (state.reduced) attrs.push(`data-motion="reduced"`);
  const attributes = attrs.length ? `<html lang="en" ${attrs.join(" ")}>` : null;
  return {
    provider,
    component,
    css,
    attributes
  };
}
