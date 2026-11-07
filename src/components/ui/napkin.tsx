// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { usePaperDecor } from "@/hooks/use-paper-object";
import { napkinRecipe, type NapkinFold } from "@/lib/ink/recipes/napkin-ink";
import { cn } from "@/lib/utils";
type NapkinProps = Omit<PaperProps, "stock" | "rules"> & {
  fold?: NapkinFold;
  stain?: boolean;
};
const Napkin = defineUi<NapkinProps>("Napkin", ["class", "fold", "stain", "seed", "tilt", "size", "style"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const fold = computed(() => _props["fold"] === undefined ? "quarter" as const : _props["fold"]);
  const stain = computed(() => _props["stain"] === undefined ? false : _props["stain"]);
  const seed = computed(() => _props["seed"]);
  const tilt = computed(() => _props["tilt"]);
  const size = computed(() => _props["size"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "fold", "stain", "seed", "tilt", "size", "style"]));
  const o = usePaperDecor(() => ({
    recipe: napkinRecipe,
    params: {
      fold: fold.value,
      stain: stain.value
    },
    kind: "napkin" as const,
    ref: ref.value,
    seed: seed.value,
    tilt: tilt.value,
    tiltMax: 1.2,
    size: size.value,
    enabled: fold.value !== "none" || stain.value
  }));
  return () => {
    return <Paper data-slot="napkin" data-fold={fold.value} stock="napkin" rules="none" size={size.value} {...domProps(o.value.paper)} {...domProps(props.value)} class={cn(o.value.paper.className, "flex min-h-56 w-72 flex-col gap-2 p-9 text-ink", className.value)} style={cssStyle({
      ...o.value.paper.style,
      ...style.value
    })}>
      {o.value.decor}
      {readSlot(_slots.default)}
    </Paper>;
  };
});
const NapkinContent = defineUi<UI.ComponentProps<"div">>("NapkinContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="napkin-content" class={cn("flex-1 font-script text-[1.5rem] leading-[1.15]", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const NapkinTitle = defineUi<UI.ComponentProps<"div">>("NapkinTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="napkin-title" class={cn("font-script text-[2rem] leading-none font-bold", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const NapkinFooter = defineUi<UI.ComponentProps<"div">>("NapkinFooter", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="napkin-footer" class={cn("mt-auto text-sm text-ink-soft", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
export { Napkin, NapkinTitle, NapkinContent, NapkinFooter };
export type { NapkinProps };
