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
import { strikeRecipe, type StrikeKind } from "@/lib/ink/recipes/strike-ink";
import type { MarkPen, MarkWeight } from "@/lib/ink/recipes/text-marks-ink";
import { cn } from "@/lib/utils";
const FALLBACK: Record<MarkPen, string> = {
  ink: "decoration-ink" as const,
  blue: "decoration-ink-you" as const,
  red: "decoration-red" as const,
  green: "decoration-green" as const,
  pencil: "decoration-pencil-mark" as const,
  marker: "decoration-marker" as const,
  orange: "decoration-tangerine" as const
};
const Strike = defineUi<UI.ComponentProps<"s"> & {
  kind?: StrikeKind;
  tone?: MarkPen;
  weight?: MarkWeight;
  animate?: boolean;
  show?: boolean;
  delay?: number;
  seed?: string | number;
  asChild?: boolean;
}>("Strike", ["kind", "tone", "weight", "animate", "show", "delay", "seed", "asChild", "class"], (_props, {
  slots: _slots
}) => {
  const kind = computed(() => _props["kind"] === undefined ? "single" as const : _props["kind"]);
  const tone = computed(() => _props["tone"] === undefined ? "red" as const : _props["tone"]);
  const weight = computed(() => _props["weight"] === undefined ? "regular" as const : _props["weight"]);
  const animate = computed(() => _props["animate"] === undefined ? false : _props["animate"]);
  const show = computed(() => _props["show"] === undefined ? true : _props["show"]);
  const delay = computed(() => _props["delay"]);
  const seed = computed(() => _props["seed"]);
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["kind", "tone", "weight", "animate", "show", "delay", "seed", "asChild", "class", "children", "ref"]));
  const _hook12 = useMarkInk(() => ({
    recipe: strikeRecipe,
    params: {
      kind: kind.value,
      tone: tone.value,
      weight: weight.value
    },
    kind: "strike" as const,
    seed: seed.value,
    mode: kind.value === "cross" ? "box" as const : "lines" as const,
    over: true,
    animate: animate.value,
    show: show.value,
    delay: delay.value
  }));
  const hostRef = computed(() => _hook12.value.hostRef);
  const hostProps = computed(() => _hook12.value.hostProps);
  const nodes = () => _hook12.value.nodes();
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "s" as const));
  return () => {
    return <Comp.value data-slot="strike" data-kind={kind.value} ref={useMergedRef<HTMLElement>(hostRef.value, ref.value as UI.Ref<HTMLElement> | undefined)} {...domProps(hostProps.value)} class={cn("relative isolate decoration-1 data-[ink-ready]:no-underline data-[mark=off]:no-underline forced-colors:not-data-[mark=off]:line-through! not-focus-visible:outline-none forced-colors:not-focus-visible:outline-none!", FALLBACK[tone.value], animate.value && "no-underline noscript:line-through", animate.value && MARK_WIPE, className.value)} {...domProps(props.value)}>
      <Slot.Slottable>{readSlot(_slots.default)}</Slot.Slottable>
      {nodes()}
    </Comp.value>;
  };
});
export { Strike };
