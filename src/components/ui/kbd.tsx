// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { IconSizeProvider, useInk, useMergedRef } from "@/lib/ink/vue";
import { kbdRecipe } from "@/lib/ink/recipes/kbd-ink";
import { cn } from "@/lib/utils";
const Kbd = defineUi<UI.ComponentProps<"kbd"> & {
  seed?: string | number;
}>("Kbd", ["class", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "seed", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: kbdRecipe,
    params: {},
    kind: "keycap" as const,
    seed: seed.value,
    still: true
  }));
  const children = renderValue(() => readSlot(_slots.default));
  const rest = computed(() => omitProps(props.value, ["children"]));
  return () => {
    return <IconSizeProvider value={14}>
      <kbd data-slot="kbd" data-ink-sink="self" ref={useMergedRef<HTMLElement>(hostRef, ref.value)} {...domProps(hostProps.value)} class={cn("relative isolate inline-flex h-6 w-fit min-w-6 items-center justify-center gap-1 pr-[6.4px] pl-1 pb-[2.4px] font-hand text-sm leading-none font-normal whitespace-nowrap text-muted-foreground select-none", "transition-[translate] duration-(--ll-dur-press) ease-out active:translate-y-[1.6px] [&[data-pressed]:not([data-pressed=false])]:translate-y-[1.6px]", "[&_svg]:pointer-events-none [&_svg:not(.absolute):not([class*='size-'])]:size-3.5", "calm:h-5 calm:pr-1 calm:pb-0", "[[data-slot=tooltip-content]_&]:text-inherit", className.value)} {...domProps(rest.value)}>
        {node.value}
        {readSlot(_slots.default)}
      </kbd>
    </IconSizeProvider>;
  };
});
const KbdGroup = defineUi<UI.ComponentProps<"kbd">>("KbdGroup", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <kbd data-slot="kbd-group" class={cn("inline-flex items-center gap-1", className.value)} {...domProps(props.value)}>{_slots.default?.()}</kbd>;
  };
});
export { Kbd, KbdGroup };
