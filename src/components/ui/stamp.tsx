// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cn } from "@/lib/utils";
import { useEnsureInkDefs } from "@/lib/ink/vue";
import { stickers } from "@/lib/ink/art/stickers";
import { memo, stamp } from "@/lib/ink/art-draw";
import type { StampGen, StickerDef } from "@/lib/ink/art/types";
const Stamp = defineUi<Omit<UI.ComponentProps<"svg">, "name" | "children" | "viewBox"> & {
  name?: string;
  text?: string;
  shape?: StampGen["shape"];
  ink?: StampGen["ink"];
  sub?: string;
  ring?: string;
  w?: number;
  h?: number;
  size?: number;
  tilt?: number;
  ghost?: boolean;
  dashed?: boolean;
  seed?: string | number;
  label?: string;
}>("Stamp", ["name", "text", "shape", "ink", "sub", "ring", "w", "h", "size", "tilt", "ghost", "dashed", "seed", "label", "class", "style"], (_props, {
  slots: _slots
}) => {
  const name = computed(() => _props["name"]);
  const text = computed(() => _props["text"]);
  const shape = computed(() => _props["shape"]);
  const ink = computed(() => _props["ink"]);
  const sub = computed(() => _props["sub"]);
  const ring = computed(() => _props["ring"]);
  const w = computed(() => _props["w"]);
  const h = computed(() => _props["h"]);
  const size = computed(() => _props["size"]);
  const tilt = computed(() => _props["tilt"]);
  const ghost = computed(() => _props["ghost"]);
  const dashed = computed(() => _props["dashed"]);
  const seed = computed(() => _props["seed"]);
  const label = computed(() => _props["label"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["name", "text", "shape", "ink", "sub", "ring", "w", "h", "size", "tilt", "ghost", "dashed", "seed", "label", "class", "style"]));
  useEnsureInkDefs();
  const preset = computed(() => name.value ? (stickers as Record<string, StickerDef>)[name.value] as StampGen | undefined : undefined);
  const p = computed(() => preset.value && "gen" in preset.value && preset.value.gen === "stamp" ? preset.value : undefined);
  const t = computed(() => text.value ?? p.value?.text);
  return () => {
    if (!t.value) return null;
    const sh = shape.value ?? p.value?.shape ?? "rect";
    const opts = {
      ink: ink.value ?? p.value?.ink,
      sub: sub.value ?? p.value?.sub,
      ring: ring.value ?? p.value?.ring,
      w: size.value ?? w.value ?? p.value?.w,
      h: size.value ?? h.value ?? p.value?.h,
      tilt: tilt.value ?? p.value?.tilt,
      ghost: ghost.value ?? p.value?.ghost,
      dashed: dashed.value ?? p.value?.dashed,
      stars: p.value?.stars,
      wear: p.value?.wear,
      seed: seed.value ?? name.value ?? t.value
    };
    const res = memo(`stamp|${t.value}|${sh}|${JSON.stringify(opts)}`, () => stamp(t.value, sh, opts));
    return <svg data-slot="stamp" data-ink="stamp" data-stamp={name.value ?? t.value} role="img" aria-label={label.value ?? t.value} focusable="false" viewBox={`0 0 ${res.w} ${res.h}`} width={res.w} height={res.h} style={cssStyle(style.value)} class={cn("pointer-events-none shrink-0 overflow-visible", className.value)} innerHTML={res.svg} {...domProps(props.value)} />;
  };
});
export { Stamp };
