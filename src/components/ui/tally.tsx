// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { BlockSvg, MARK_WIPE, useMarkPhase } from "@/hooks/use-mark-ink";
import { useInkContext, useInkCore, useMergedRef } from "@/lib/ink/vue";
import type { MarkPen, MarkWeight } from "@/lib/ink/recipes/text-marks-ink";
import { tallyBox, tallyRecipe } from "@/lib/ink/recipes/tally-ink";
import { cn } from "@/lib/utils";
const SIZES = {
  sm: 14,
  md: 22,
  lg: 34
} as const;
const Tally = defineUi<Omit<UI.ComponentProps<"span">, "children"> & {
  count: number;
  size?: keyof typeof SIZES | number;
  tone?: MarkPen;
  weight?: MarkWeight;
  label?: string;
  animate?: boolean;
  show?: boolean;
  delay?: number;
  seed?: string | number;
}>("Tally", ["count", "size", "tone", "weight", "label", "animate", "show", "delay", "seed", "class", "style"], (_props, {
  slots: _slots
}) => {
  const count = computed(() => _props["count"]);
  const size = computed(() => _props["size"] === undefined ? "md" as const : _props["size"]);
  const tone = computed(() => _props["tone"] === undefined ? "ink" as const : _props["tone"]);
  const weight = computed(() => _props["weight"] === undefined ? "regular" as const : _props["weight"]);
  const label = computed(() => _props["label"]);
  const animate = computed(() => _props["animate"] === undefined ? false : _props["animate"]);
  const show = computed(() => _props["show"] === undefined ? true : _props["show"]);
  const delay = computed(() => _props["delay"]);
  const seed = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["count", "size", "tone", "weight", "label", "animate", "show", "delay", "seed", "class", "style", "ref"]));
  const n = computed(() => Math.max(0, Math.min(99, Math.floor(Number.isFinite(count.value) ? count.value : 0))));
  const gh = computed(() => typeof size.value === "number" ? size.value : SIZES[size.value]);
  const box = computed(() => tallyBox(n.value, gh.value));
  const _inkContext16 = useInkContext();
  const dir = computed(() => _inkContext16.value.dir);
  const {
    hostRef,
    hostProps,
    frame
  } = useInkCore(() => ({
    recipe: tallyRecipe,
    params: {
      count: n.value,
      gh: gh.value,
      tone: tone.value,
      weight: weight.value,
      rtl: dir.value === "rtl"
    },
    size: [Math.max(4, box.value.w), box.value.h],
    seed: seed.value
  }));
  const _hook19 = useMarkPhase(() => ({
    animate: animate.value,
    show: show.value
  }));
  const phaseRef = computed(() => _hook19.value.phaseRef);
  const phaseProps = computed(() => _hook19.value.phaseProps);
  return () => {
    return <span data-slot="tally" data-count={n.value} role="img" aria-label={label.value ?? String(n.value)} ref={useMergedRef<HTMLElement>(hostRef, phaseRef.value, ref.value as UI.Ref<HTMLElement> | undefined)} {...domProps(show.value ? hostProps.value : {})} {...domProps(phaseProps.value)} style={cssStyle({
      width: box.value.w,
      height: box.value.h,
      ...(animate.value ? {
        "--ll-draw-delay": `${delay.value ?? 0}ms`
      } as UI.CSSProperties : undefined),
      ...style.value
    })} class={cn("relative isolate inline-block shrink-0 align-middle outline-none", animate.value && MARK_WIPE, className.value)} {...domProps(props.value)}>
      {show.value && frame.value ? <BlockSvg kind="tally" frame={frame.value} keep /> : null}
    </span>;
  };
});
export { Tally };
