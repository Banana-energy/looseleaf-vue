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
import { highlightRecipe } from "@/lib/ink/recipes/highlight-ink";
import type { HighlightTone } from "@/lib/ink/recipes/text-marks-ink";
import { cn } from "@/lib/utils";
const FAT = {
  light: 0.82,
  regular: 1,
  heavy: 1.22
} as const;
const Highlight = defineUi<UI.ComponentProps<"mark"> & {
  tone?: HighlightTone;
  weight?: keyof typeof FAT;
  cover?: "full" | "under";
  animate?: boolean;
  show?: boolean;
  delay?: number;
  seed?: string | number;
  asChild?: boolean;
}>("Highlight", ["tone", "weight", "cover", "animate", "show", "delay", "seed", "asChild", "class"], (_props, {
  slots: _slots
}) => {
  const tone = computed(() => _props["tone"] === undefined ? "yellow" as const : _props["tone"]);
  const weight = computed(() => _props["weight"] === undefined ? "regular" as const : _props["weight"]);
  const cover = computed(() => _props["cover"] === undefined ? "full" as const : _props["cover"]);
  const animate = computed(() => _props["animate"] === undefined ? false : _props["animate"]);
  const show = computed(() => _props["show"] === undefined ? true : _props["show"]);
  const delay = computed(() => _props["delay"]);
  const seed = computed(() => _props["seed"]);
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["tone", "weight", "cover", "animate", "show", "delay", "seed", "asChild", "class", "children", "ref"]));
  const _hook12 = useMarkInk(() => ({
    recipe: highlightRecipe,
    params: {
      tone: tone.value,
      fat: FAT[weight.value],
      cover: cover.value
    },
    kind: "highlight" as const,
    seed: seed.value,
    animate: animate.value,
    show: show.value,
    delay: delay.value
  }));
  const hostRef = computed(() => _hook12.value.hostRef);
  const hostProps = computed(() => _hook12.value.hostProps);
  const nodes = () => _hook12.value.nodes();
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "mark" as const));
  return () => {
    return <Comp.value data-slot="highlight" data-tone={tone.value} data-cover={cover.value} ref={useMergedRef<HTMLElement>(hostRef.value, ref.value as UI.Ref<HTMLElement> | undefined)} {...domProps(hostProps.value)} class={cn("relative isolate text-inherit data-[ink-ready]:bg-transparent data-[mark=off]:bg-transparent not-focus-visible:outline-none forced-colors:not-focus-visible:outline-none!", animate.value && "bg-transparent noscript:bg-hi-select", animate.value && MARK_WIPE, className.value)} {...domProps(props.value)}>
      <Slot.Slottable>{readSlot(_slots.default)}</Slot.Slottable>
      {nodes()}
    </Comp.value>;
  };
});
export { Highlight };
