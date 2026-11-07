// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cn } from "@/lib/utils";
import { useEnsureInkDefs, useIconSize } from "@/lib/ink/vue";
import { icons, resolveIconName, type IconName } from "@/lib/ink/art/icons";
import { drawSkeleton, memo } from "@/lib/ink/art-draw";
import type { ArtAccent, ArtDef } from "@/lib/ink/art/types";
function sizeFromClass(className?: string): number | undefined {
  if (!className) return undefined;
  const m = /(?:^|\s)size-(?:(\d+(?:\.\d+)?)|\[(\d+(?:\.\d+)?)px\])(?=\s|$)/.exec(className);
  if (!m) return undefined;
  return m[2] ? Number(m[2]) : Number(m[1]) * 4;
}
const MISSING: ArtDef = {
  grid: 24,
  kind: "icon" as const,
  parts: [["s", "M4.6 4.8 L19.3 4.5 L19.5 19.2 L4.4 19.5 Z", 0.9], ["s", "M9.4 9.6 Q9.6 7.4 12.1 7.4 Q14.7 7.5 14.6 9.7 Q14.5 11.4 12.3 12.3 L12.1 14", 1.1], ["d", 12, 16.8, 1.1]]
};
const UI_WEIGHT = 1.12;
const UI_WEIGHT_MAX_PX = 20;
const iconNib = (def: ArtDef, px: number): number => Math.min(3.4, Math.max(1.45, px * (def.nibK ?? 0.068)));
const Icon = defineUi<Omit<UI.ComponentProps<"svg">, "name" | "children" | "viewBox"> & {
  name: IconName | string & {};
  size?: number;
  tone?: "ui" | "doodle";
  accent?: ArtAccent;
  seed?: string | number;
  label?: string;
  flip?: boolean | "x" | "y";
  weight?: number;
}>("Icon", ["name", "size", "tone", "accent", "seed", "label", "flip", "weight", "class", "style"], (_props, {
  slots: _slots
}) => {
  const name = computed(() => _props["name"]);
  const size = computed(() => _props["size"]);
  const tone = computed(() => _props["tone"] === undefined ? "ui" as const : _props["tone"]);
  const accent = computed(() => _props["accent"]);
  const seed = computed(() => _props["seed"]);
  const label = computed(() => _props["label"]);
  const flip = computed(() => _props["flip"]);
  const weight = computed(() => _props["weight"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["name", "size", "tone", "accent", "seed", "label", "flip", "weight", "class", "style"]));
  useEnsureInkDefs();
  const contextSize = useIconSize();
  const id = computed(() => resolveIconName(name.value));
  const known = computed(() => (icons as Record<string, ArtDef>)[id.value]);
  const def = computed(() => known.value ?? MISSING);
  const explicit = computed(() => size.value ?? sizeFromClass(className.value) ?? contextSize.value);
  const px = computed(() => Math.max(8, Math.round(explicit.value ?? 16)));
  const k = computed(() => weight.value ?? (tone.value === "ui" && px.value <= UI_WEIGHT_MAX_PX ? UI_WEIGHT : 1));
  const res = computed(() => memo(`icon|${id.value}|${px.value}|${tone.value}|${accent.value ?? ""}|${seed.value ?? ""}|${k.value}`, () => drawSkeleton(def.value, px.value, seed.value ?? id.value, {
    tone: tone.value,
    accent: accent.value,
    kind: "icon" as const,
    ...(k.value === 1 ? {} : {
      nib: iconNib(def.value, px.value) * k.value
    })
  })));
  const axis = computed(() => flip.value === true ? "x" as const : flip.value);
  return () => {
    return <svg data-slot="icon" data-ink="icon" data-icon={id.value} data-missing={known.value ? undefined : "" as const} aria-hidden={label.value ? undefined : true} role={label.value ? "img" as const : undefined} aria-label={label.value} focusable="false" viewBox={`0 0 ${res.value.w} ${res.value.h}`} width={size.value || contextSize.value ? px.value : "1em" as const} height={size.value || contextSize.value ? px.value : "1em" as const} style={cssStyle(size.value || contextSize.value ? {
      width: px.value,
      height: px.value,
      ...style.value
    } : style.value)} class={cn("pointer-events-none shrink-0 overflow-visible", def.value.rtl === "flip" && "rtl:-scale-x-100", def.value.mirror && axis.value === "x" && "-scale-x-100", def.value.mirror && axis.value === "y" && "-scale-y-100", className.value)} innerHTML={res.value.svg} {...domProps(props.value)} />;
  };
});
export { Icon };
export type { IconName };
