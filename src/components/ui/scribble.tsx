// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Slot } from "@/lib/primitives";
import { MARK_WIPE, useMarkInk } from "@/hooks/use-mark-ink";
import { useMergedRef } from "@/lib/ink/vue";
import { scribbleRecipe } from "@/lib/ink/recipes/scribble-ink";
import type { MarkPen, MarkWeight } from "@/lib/ink/recipes/text-marks-ink";
import { cn } from "@/lib/utils";
const Scribble = defineUi<UI.ComponentProps<"span"> & {
  tone?: MarkPen;
  weight?: MarkWeight;
  animate?: boolean;
  show?: boolean;
  delay?: number;
  seed?: string | number;
  asChild?: boolean;
}>("Scribble", ["tone", "weight", "animate", "show", "delay", "seed", "asChild", "class"], (_props, {
  slots: _slots
}) => {
  const tone = computed(() => _props["tone"] === undefined ? "ink" as const : _props["tone"]);
  const weight = computed(() => _props["weight"] === undefined ? "regular" as const : _props["weight"]);
  const animate = computed(() => _props["animate"] === undefined ? false : _props["animate"]);
  const show = computed(() => _props["show"] === undefined ? true : _props["show"]);
  const delay = computed(() => _props["delay"]);
  const seed = computed(() => _props["seed"]);
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["tone", "weight", "animate", "show", "delay", "seed", "asChild", "class", "children", "ref"]));
  const _hook11 = useMarkInk(() => ({
    recipe: scribbleRecipe,
    params: {
      tone: tone.value,
      weight: weight.value
    },
    kind: "scribble" as const,
    seed: seed.value,
    over: true,
    animate: animate.value,
    show: show.value,
    delay: delay.value
  }));
  const hostRef = computed(() => _hook11.value.hostRef);
  const hostProps = computed(() => _hook11.value.hostProps);
  const nodes = () => _hook11.value.nodes();
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "span" as const));
  return () => {
    return <Comp.value data-slot="scribble" ref={useMergedRef<HTMLElement>(hostRef.value, ref.value as UI.Ref<HTMLElement> | undefined)} {...domProps(hostProps.value)} class={cn("relative isolate line-through decoration-2 decoration-ink data-[ink-ready]:no-underline data-[mark=off]:no-underline forced-colors:not-data-[mark=off]:line-through! not-focus-visible:outline-none forced-colors:not-focus-visible:outline-none!", animate.value && "no-underline noscript:line-through", animate.value && MARK_WIPE, className.value)} {...domProps(props.value)}>
      <Slot.Slottable>{readSlot(_slots.default)}</Slot.Slottable>
      {nodes()}
    </Comp.value>;
  };
});
export { Scribble };
