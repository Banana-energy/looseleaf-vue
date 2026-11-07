// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { cn } from "@/lib/utils";
import { useEnsureInkDefs } from "@/lib/ink/vue";
import { stickers, type StickerName } from "@/lib/ink/art/stickers";
import { memo, renderSticker } from "@/lib/ink/art-draw";
import { hashSeed } from "@/lib/ink/rng";
import type { StickerDef } from "@/lib/ink/art/types";
const autoTilt = (seed: string): number => (hashSeed(seed) % 640 - 320) / 100;
const Sticker = defineUi<Omit<UI.ComponentProps<"svg">, "name" | "children" | "viewBox"> & {
  name: StickerName | string & {};
  size?: number;
  peel?: boolean | number;
  rotate?: number | "auto";
  border?: number;
  shadow?: boolean;
  seed?: string | number;
  label?: string;
}>("Sticker", ["name", "size", "peel", "rotate", "border", "shadow", "seed", "label", "class", "style"], (_props, {
  slots: _slots
}) => {
  const name = computed(() => _props["name"]);
  const size = computed(() => _props["size"] === undefined ? 96 : _props["size"]);
  const peel = computed(() => _props["peel"] === undefined ? false : _props["peel"]);
  const rotate = computed(() => _props["rotate"] === undefined ? "auto" as const : _props["rotate"]);
  const border = computed(() => _props["border"]);
  const shadow = computed(() => _props["shadow"] === undefined ? true : _props["shadow"]);
  const seed = computed(() => _props["seed"]);
  const label = computed(() => _props["label"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["name", "size", "peel", "rotate", "border", "shadow", "seed", "label", "class", "style"]));
  useEnsureInkDefs();
  const def = computed(() => (stickers as Record<string, StickerDef>)[name.value]);
  const _nestedHook0 = useId();
  const uid = computed(() => _nestedHook0.replace(/[^a-zA-Z0-9]/g, ""));
  return () => {
    if (!def.value) return null;
    const px = Math.max(32, Math.round(size.value));
    const s = `${seed.value ?? name.value}`;
    const res = memo(`sticker|${name.value}|${px}|${peel.value}|${border.value ?? ""}|${s}|${uid.value}`, () => renderSticker(def.value, px, s, {
      peel: peel.value === false ? undefined : peel.value,
      border: border.value,
      idPrefix: `ll-${uid.value}`
    }), 120);
    const tilt = rotate.value === "auto" ? autoTilt(s) : rotate.value;
    return <svg data-slot="sticker" data-ink="sticker" data-sticker={name.value} aria-hidden={label.value ? undefined : true} role={label.value ? "img" as const : undefined} aria-label={label.value} focusable="false" viewBox={`0 0 ${res.w} ${res.h}`} width={res.w} height={res.h} style={cssStyle(rotate.value === "auto" ? {
      "--ll-tilt": `${tilt}deg`,
      ...style.value
    } as UI.CSSProperties : tilt ? {
      rotate: `${tilt}deg`,
      ...style.value
    } : style.value)} class={cn("pointer-events-none shrink-0 overflow-visible", shadow.value && "ll-drop-sticker", rotate.value === "auto" && "ll-tilt-layer", className.value)} innerHTML={res.svg} {...domProps(props.value)} />;
  };
});
export { Sticker };
export type { StickerName };
