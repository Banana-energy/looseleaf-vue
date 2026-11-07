// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Slot } from "@/lib/primitives";
import { MARK_REVEAL, useMarkInk } from "@/hooks/use-mark-ink";
import { useMergedRef } from "@/lib/ink/vue";
import { circledRecipe, type CircledShape } from "@/lib/ink/recipes/circled-ink";
import type { MarkPen, MarkWeight } from "@/lib/ink/recipes/text-marks-ink";
import { cn } from "@/lib/utils";
const Circled = defineUi<UI.ComponentProps<"span"> & {
  shape?: CircledShape;
  tone?: MarkPen;
  weight?: MarkWeight;
  bleed?: number;
  animate?: boolean;
  show?: boolean;
  delay?: number;
  seed?: string | number;
  asChild?: boolean;
}>("Circled", ["shape", "tone", "weight", "bleed", "animate", "show", "delay", "seed", "asChild", "class"], (_props, {
  slots: _slots
}) => {
  const shape = computed(() => _props["shape"] === undefined ? "circle" as const : _props["shape"]);
  const tone = computed(() => _props["tone"] === undefined ? "ink" as const : _props["tone"]);
  const weight = computed(() => _props["weight"] === undefined ? "regular" as const : _props["weight"]);
  const bleed = computed(() => _props["bleed"]);
  const animate = computed(() => _props["animate"] === undefined ? false : _props["animate"]);
  const show = computed(() => _props["show"] === undefined ? true : _props["show"]);
  const delay = computed(() => _props["delay"]);
  const seed = computed(() => _props["seed"]);
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["shape", "tone", "weight", "bleed", "animate", "show", "delay", "seed", "asChild", "class", "children", "ref"]));
  const _hook13 = useMarkInk(() => ({
    recipe: circledRecipe,
    params: {
      shape: shape.value,
      tone: tone.value,
      weight: weight.value,
      bleed: bleed.value
    },
    kind: "circled" as const,
    seed: seed.value,
    mode: "box" as const,
    over: true,
    animate: animate.value,
    show: show.value,
    delay: delay.value
  }));
  const hostRef = computed(() => _hook13.value.hostRef);
  const hostProps = computed(() => _hook13.value.hostProps);
  const nodes = () => _hook13.value.nodes();
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "span" as const));
  return () => {
    return <Comp.value data-slot="circled" data-shape={shape.value} ref={useMergedRef<HTMLElement>(hostRef.value, ref.value as UI.Ref<HTMLElement> | undefined)} {...domProps(hostProps.value)} class={cn("relative isolate outline-1 outline-offset-2 outline-pencil-mark data-[ink-ready]:not-focus-visible:outline-none data-[mark=off]:outline-none", animate.value && "outline-none noscript:outline-1", animate.value && MARK_REVEAL, className.value)} {...domProps(props.value)}>
      <Slot.Slottable>{readSlot(_slots.default)}</Slot.Slottable>
      {nodes()}
    </Comp.value>;
  };
});
export { Circled };
