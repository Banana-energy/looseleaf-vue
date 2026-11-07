// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { mascotProps } from "@/lib/ink/art/mascots";
import { drawMascot } from "@/lib/ink/art/mascot-draw";
import { memo } from "@/lib/ink/art-draw";
import { useDensity, useEnsureInkDefs, useInkSeed, useInkTier } from "@/lib/ink/vue";
import { spinnerMark, type SpinnerVariant } from "@/lib/ink/recipes/spinner-ink";
import { cn } from "@/lib/utils";
function sizeFromClass(className?: string): number | undefined {
  if (!className) return undefined;
  const m = /(?:^|\s)size-(?:(\d+(?:\.\d+)?)|\[(\d+(?:\.\d+)?)px\])(?=\s|$)/.exec(className);
  if (!m) return undefined;
  return m[2] ? Number(m[2]) : Number(m[1]) * 4;
}
const scribble = "[&_[data-part=reveal]]:[stroke-dasharray:.42_.58] [&_[data-part=reveal]]:animate-[ll-draw_calc(var(--ll-dur-draw)*2)_linear_infinite] " + "motion-reduce:[&_[data-part=reveal]]:animate-none motion-reduce:[&_[data-part=reveal]]:[stroke-dasharray:none] " + "[[data-motion=reduced]_&]:[&_[data-part=reveal]]:animate-none [[data-motion=reduced]_&]:[&_[data-part=reveal]]:[stroke-dasharray:none]";
const FLIP = "@keyframes ll-write-1{0%,33.2%{opacity:1}33.3%,100%{opacity:0}}" + "@keyframes ll-write-2{0%,33.2%{opacity:0}33.3%,66.5%{opacity:1}66.6%,100%{opacity:0}}" + "@keyframes ll-write-3{0%,66.5%{opacity:0}66.6%,100%{opacity:1}}" + "[data-slot=spinner][data-variant=write] [data-frame]{opacity:0}[data-slot=spinner][data-variant=write] [data-frame='3']{opacity:1}" + "[data-slot=spinner][data-variant=write] [data-frame='1']{animation:ll-write-1 var(--ll-write-lap) linear infinite}" + "[data-slot=spinner][data-variant=write] [data-frame='2']{animation:ll-write-2 var(--ll-write-lap) linear infinite}" + "[data-slot=spinner][data-variant=write] [data-frame='3']{animation:ll-write-3 var(--ll-write-lap) linear infinite}" + "@media (prefers-reduced-motion:reduce){[data-slot=spinner][data-variant=write] [data-frame]{animation:none!important}}" + "[data-motion=reduced] [data-slot=spinner][data-variant=write] [data-frame]{animation:none!important}" + "[data-motion=reduced] [data-slot=spinner][data-variant=write] [data-frame='1'],[data-motion=reduced] [data-slot=spinner][data-variant=write] [data-frame='2']{opacity:0}";
const WRITE_FRAMES = ["write-1", "write-2", "write-3"] as const;
const StubbyFrames = defineUi<{
  px: number;
  seed: string;
}>("StubbyFrames", ["px", "seed"], (_props, {
  slots: _slots
}) => {
  const px = computed(() => _props["px"]);
  const seed = computed(() => _props["seed"]);
  const _nestedHook0 = useId();
  const uid = computed(() => _nestedHook0.replace(/[^a-zA-Z0-9]/g, ""));
  const frames = computed(() => WRITE_FRAMES.map(id => memo(`spinner|${id}|${px.value}|${seed.value}|${uid.value}`, () => drawMascot(mascotProps.frames[id], px.value, seed.value, {
    idPrefix: `ll-${uid.value}${id.replace("-", "")}`
  }))));
  const w = computed(() => frames.value[0].w);
  const h = computed(() => frames.value[0].h);
  return () => {
    return <span class="relative block" style={cssStyle({
      width: w.value,
      height: h.value
    })}>
      {frames.value.map((f, i) => <svg key={WRITE_FRAMES[i]} data-ink="mascot" data-frame={i + 1} aria-hidden="true" focusable="false" viewBox={`0 0 ${f.w} ${f.h}`} width={f.w} height={f.h} class="ll-drop-sticker pointer-events-none absolute inset-0 overflow-visible" innerHTML={f.svg} />)}
    </span>;
  };
});
const Spinner = defineUi<Omit<UI.ComponentProps<"span">, "children"> & {
  variant?: SpinnerVariant;
  size?: number;
  seed?: string | number;
  children?: never;
}>("Spinner", ["class", "variant", "size", "seed", "style"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"] === undefined ? "scribble" as const : _props["variant"]);
  const size = computed(() => _props["size"]);
  const seed = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["class", "variant", "size", "seed", "children", "style"]));
  useEnsureInkDefs();
  const tier = useInkTier();
  const _nestedHook0 = useDensity();
  const calm = computed(() => _nestedHook0.value === "calm");
  const id = useInkSeed(() => seed.value);
  const asked = computed(() => size.value ?? sizeFromClass(className.value));
  const px = computed(() => Math.max(8, Math.round(asked.value !== undefined && Number.isFinite(asked.value) ? asked.value : variant.value === "write" ? 64 : 16)));
  const mark = computed(() => variant.value === "write" ? null : variant.value === "loops" ? spinnerMark(id.value, px.value, {
    shape: "loops" as const,
    w: px.value * 4,
    h: px.value,
    tier: tier.value,
    calm: calm.value
  }) : spinnerMark(id.value, px.value, {
    tier: tier.value,
    calm: calm.value
  }));
  return () => {
    return <span role="status" aria-label="Loading" data-slot="spinner" data-variant={variant.value} style={cssStyle({
      "--ll-write-lap": "calc(var(--ll-dur-boil) * 2.25)" as const,
      ...style.value
    } as UI.CSSProperties)} class={cn(variant.value === "scribble" ? "inline-flex size-4 shrink-0 items-center justify-center" as const : "inline-flex shrink-0 items-center justify-center" as const, scribble, className.value)} {...domProps(props.value)}>
      {variant.value === "write" ? <>
          <style>
            {FLIP}
          </style>
          <StubbyFrames px={px.value} seed={id.value} />
        </> : mark.value ? <svg data-ink="doodle" aria-hidden="true" focusable="false" viewBox={`${-mark.value.pad} ${-mark.value.pad} ${mark.value.w + 2 * mark.value.pad} ${mark.value.h + 2 * mark.value.pad}`} width={variant.value === "loops" ? mark.value.w + 2 * mark.value.pad : undefined} height={variant.value === "loops" ? mark.value.h + 2 * mark.value.pad : undefined} class={cn("pointer-events-none overflow-visible", variant.value === "scribble" ? "size-full" as const : "shrink-0" as const)} innerHTML={mark.value.svg} /> : null}
    </span>;
  };
});
export { Spinner };
