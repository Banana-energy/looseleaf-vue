// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, proxyRefs } from "vue";
import { Progress as ProgressPrimitive } from "@/lib/primitives";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { progressFillRecipe, progressRecipe, type ProgressTone } from "@/lib/ink/recipes/progress-ink";
import { cn } from "@/lib/utils";
const css = "@keyframes ll-progress-slide{from{clip-path:inset(-12px 100% -12px -40%)}to{clip-path:inset(-12px -40% -12px 100%)}}" + "@keyframes ll-progress-slide-rtl{from{clip-path:inset(-12px -40% -12px 100%)}to{clip-path:inset(-12px 100% -12px -40%)}}";
const sizes = {
  sm: "h-3" as const,
  default: "h-4" as const,
  lg: "h-5" as const
} as const;
const Progress = defineUi<UI.ComponentProps<typeof ProgressPrimitive.Root> & {
  size?: keyof typeof sizes;
  tone?: ProgressTone;
  seed?: string | number;
}>("Progress", ["class", "value", "max", "size", "tone", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const value = computed(() => _props["value"]);
  const max = computed(() => _props["max"] === undefined ? 100 : _props["max"]);
  const size = computed(() => _props["size"] === undefined ? "default" as const : _props["size"]);
  const tone = computed(() => _props["tone"] === undefined ? "marker" as const : _props["tone"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "value", "max", "size", "tone", "seed", "ref"]));
  const safeMax = computed(() => Number.isFinite(max.value) && max.value > 0 ? max.value : 100);
  const indeterminate = computed(() => typeof value.value !== "number" || Number.isNaN(value.value));
  const clamped = computed(() => indeterminate.value ? null : Math.min(safeMax.value, Math.max(0, value.value)));
  const pct = computed(() => clamped.value === null ? 0 : clamped.value / safeMax.value * 100);
  const _rootCore = useInk(() => ({
    recipe: progressRecipe,
    params: {},
    kind: "progress" as const,
    seed: seed.value,
    still: true
  }));
  const root = computed(() => proxyRefs(_rootCore));
  const _fillCore = useInk(() => ({
    recipe: progressFillRecipe,
    params: {
      tone: tone.value,
      indeterminate: indeterminate.value
    },
    kind: "progress" as const,
    seed: root.value.seed ? `${root.value.seed}:fill` : undefined,
    still: true
  }));
  const fill = computed(() => proxyRefs(_fillCore));
  return () => {
    return <>
      <style>
        {css}
      </style>
      <ProgressPrimitive.Root data-slot="progress" ref={useMergedRef<HTMLDivElement>(root.value.hostRef, ref.value)} {...domProps(root.value.hostProps)} value={clamped.value} max={safeMax.value} class={cn("relative isolate w-full bg-paper-shade outline-hidden data-ink-ready:bg-transparent forced-colors:border forced-colors:border-[ButtonText]", sizes[size.value], className.value)} {...domProps(props.value)}>
        {root.value.node}
        <ProgressPrimitive.Indicator data-slot="progress-indicator" ref={fill.value.hostRef} {...domProps(fill.value.hostProps)} style={cssStyle(indeterminate.value ? undefined : {
          "--ll-progress": pct.value
        } as UI.CSSProperties)} class={cn("absolute inset-0 isolate bg-marker/70 outline-hidden data-ink-ready:bg-transparent forced-colors:bg-[Highlight]", "[clip-path:inset(-12px_calc(100%_-_var(--ll-progress,100)_*_1%)_-12px_0)] rtl:[clip-path:inset(-12px_0_-12px_calc(100%_-_var(--ll-progress,100)_*_1%))]", "transition-[clip-path] duration-(--ll-dur-sheet) ease-out", "data-[state=indeterminate]:animate-[ll-progress-slide_1.6s_linear_infinite] rtl:data-[state=indeterminate]:animate-[ll-progress-slide-rtl_1.6s_linear_infinite]", "motion-reduce:data-[state=indeterminate]:animate-none motion-reduce:data-[state=indeterminate]:[clip-path:inset(-12px_30%_-12px_30%)]", "[[data-motion=reduced]_&]:data-[state=indeterminate]:animate-none [[data-motion=reduced]_&]:data-[state=indeterminate]:[clip-path:inset(-12px_30%_-12px_30%)]")}>
          {fill.value.node}
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
    </>;
  };
});
export { Progress };
