// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cn } from "@/lib/utils";
import { useEnsureInkDefs } from "@/lib/ink/vue";
import { doodles, type DoodleName } from "@/lib/ink/art/doodles";
import { drawSkeleton, memo } from "@/lib/ink/art-draw";
import type { ArtAccent, ArtDef } from "@/lib/ink/art/types";
const Doodle = defineUi<Omit<UI.ComponentProps<"svg">, "name" | "children" | "viewBox"> & {
  name: DoodleName | string & {};
  size?: number;
  accent?: ArtAccent;
  seed?: string | number;
  label?: string;
  rotate?: number;
  flip?: boolean;
}>("Doodle", ["name", "size", "accent", "seed", "label", "rotate", "flip", "class", "style"], (_props, {
  slots: _slots
}) => {
  const name = computed(() => _props["name"]);
  const size = computed(() => _props["size"] === undefined ? 96 : _props["size"]);
  const accent = computed(() => _props["accent"]);
  const seed = computed(() => _props["seed"]);
  const label = computed(() => _props["label"]);
  const rotate = computed(() => _props["rotate"]);
  const flip = computed(() => _props["flip"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["name", "size", "accent", "seed", "label", "rotate", "flip", "class", "style"]));
  useEnsureInkDefs();
  const def = computed(() => (doodles as Record<string, ArtDef>)[name.value]);
  return () => {
    if (!def.value) return null;
    const px = Math.max(24, Math.round(size.value));
    const res = memo(`doodle|${name.value}|${px}|${accent.value ?? ""}|${seed.value ?? ""}`, () => drawSkeleton(def.value, px, seed.value ?? name.value, {
      tone: "doodle" as const,
      accent: accent.value,
      kind: "doodle" as const
    }));
    return <svg data-slot="doodle" data-ink="doodle" data-doodle={name.value} aria-hidden={label.value ? undefined : true} role={label.value ? "img" as const : undefined} aria-label={label.value} focusable="false" viewBox={`0 0 ${res.w} ${res.h}`} width={px} height={px} style={cssStyle(rotate.value ? {
      rotate: `${rotate.value}deg`,
      ...style.value
    } : style.value)} class={cn("pointer-events-none shrink-0 overflow-visible", flip.value && "-scale-x-100", className.value)} innerHTML={res.svg} {...domProps(props.value)} />;
  };
});
export { Doodle };
export type { DoodleName };
