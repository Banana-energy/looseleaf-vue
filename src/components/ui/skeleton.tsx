// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { useInkSeed } from "@/lib/ink/vue";
import { hashSeed } from "@/lib/ink/rng";
import { SKELETON_FRAMES, skeletonCss } from "@/lib/ink/recipes/skeleton-ink";
import { cn } from "@/lib/utils";
const Skeleton = defineUi<UI.ComponentProps<"div"> & {
  seed?: string | number;
}>("Skeleton", ["class", "style", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const seed = computed(() => _props["seed"]);
  const props = computed(() => omitProps(_props, ["class", "style", "seed"]));
  const id = useInkSeed(() => seed.value);
  const phase = computed(() => hashSeed(id.value) % SKELETON_FRAMES);
  return () => {
    return <>
      <style>
        {skeletonCss()}
      </style>
      <div data-slot="skeleton" style={cssStyle({
        "--ll-sk-phase": phase.value,
        ...style.value
      } as UI.CSSProperties)} class={cn("block", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>
    </>;
  };
});
export { Skeleton };
