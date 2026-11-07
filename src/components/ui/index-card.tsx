// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { usePaperDecor } from "@/hooks/use-paper-object";
import type { Accent } from "@/lib/ink/paper/props";
import { indexCardRecipe } from "@/lib/ink/recipes/index-card-ink";
import { cn } from "@/lib/utils";
type IndexCardProps = Omit<PaperProps, "stock" | "rules"> & {
  hole?: boolean;
  flag?: Accent | false;
  stack?: 0 | 1 | 2 | 3;
};
const IndexCard = defineUi<IndexCardProps>("IndexCard", ["class", "hole", "flag", "stack", "as", "seed", "tilt", "size", "style"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const hole = computed(() => _props["hole"] === undefined ? false : _props["hole"]);
  const flag = computed(() => _props["flag"] === undefined ? false : _props["flag"]);
  const stack = computed(() => _props["stack"] === undefined ? 0 : _props["stack"]);
  const as = computed(() => _props["as"] === undefined ? "div" as const : _props["as"]);
  const seed = computed(() => _props["seed"]);
  const tilt = computed(() => _props["tilt"]);
  const size = computed(() => _props["size"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "hole", "flag", "stack", "as", "seed", "tilt", "size", "style"]));
  const o = usePaperDecor(() => ({
    recipe: indexCardRecipe,
    params: {
      hole: hole.value,
      flag: flag.value || "none",
      stack: stack.value
    },
    kind: "index-card" as const,
    ref: ref.value,
    seed: seed.value,
    tilt: tilt.value,
    tiltMax: 0.5 * 0.45,
    size: size.value,
    enabled: hole.value || !!flag.value || stack.value > 0
  }));
  return () => {
    return <Paper data-slot="index-card" as={as.value} stock="index-card" rules="index" size={size.value} {...domProps(o.value.paper)} {...domProps(props.value)} class={cn(o.value.paper.className, "flex min-h-56 w-full max-w-md flex-col px-5 pb-[25px] text-[17px] leading-[30px] rtl:[&>[data-slot=paper-rules]]:-scale-x-100", className.value)} style={cssStyle({
      ...o.value.paper.style,
      ...style.value
    })}>
      {o.value.decor}
      {readSlot(_slots.default)}
    </Paper>;
  };
});
const IndexCardHeader = defineUi<UI.ComponentProps<"div">>("IndexCardHeader", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="index-card-header" class={cn("flex h-[49px] shrink-0 items-end justify-between gap-3 pb-1.5", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const IndexCardTitle = defineUi<UI.ComponentProps<"div">>("IndexCardTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="index-card-title" class={cn("min-w-0 truncate pe-[0.2em] -me-[0.2em] pb-[0.2em] -mb-[0.2em] font-script text-[1.65rem] leading-none font-bold", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const IndexCardContent = defineUi<UI.ComponentProps<"div">>("IndexCardContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="index-card-content" class={cn("flex-1", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const IndexCardFooter = defineUi<UI.ComponentProps<"div">>("IndexCardFooter", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="index-card-footer" class={cn("mt-auto flex items-center justify-between gap-3 text-sm leading-[30px] text-muted-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
export { IndexCard, IndexCardHeader, IndexCardTitle, IndexCardContent, IndexCardFooter };
export type { IndexCardProps };
