// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Tooltip as TooltipPrimitive } from "@/lib/primitives";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { PropSvg } from "@/lib/ink/paper/prop-svg";
import { useDensity, useInkScope, useInkSeed, useInkTier } from "@/lib/ink/vue";
import { pointerMark } from "@/lib/ink/recipes/overlay-ink";
import { cn } from "@/lib/utils";
const TooltipProvider = defineUi<UI.ComponentProps<typeof TooltipPrimitive.Provider>>("TooltipProvider", ["delayDuration"], (_props, {
  slots: _slots
}) => {
  const delayDuration = computed(() => _props["delayDuration"] === undefined ? 0 : _props["delayDuration"]);
  const props = computed(() => omitProps(_props, ["delayDuration"]));
  return () => {
    return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration.value} {...domProps(props.value)}>{_slots.default?.()}</TooltipPrimitive.Provider>;
  };
});
const Tooltip = defineUi<UI.ComponentProps<typeof TooltipPrimitive.Root>>("Tooltip", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <TooltipPrimitive.Root data-slot="tooltip" {...domProps(props.value)}>{_slots.default?.()}</TooltipPrimitive.Root>;
  };
});
const TooltipTrigger = defineUi<UI.ComponentProps<typeof TooltipPrimitive.Trigger>>("TooltipTrigger", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...domProps(props.value)}>{_slots.default?.()}</TooltipPrimitive.Trigger>;
  };
});
const TooltipPointer = defineUi<{
  seed: string;
}>("TooltipPointer", ["seed"], (_props, {
  slots: _slots
}) => {
  const seed = computed(() => _props["seed"]);
  const tier = useInkTier();
  const _nestedHook0 = useDensity();
  const calm = computed(() => _nestedHook0.value === "calm");
  const res = computed(() => pointerMark(`${seed.value}|pointer`, {
    tier: tier.value,
    calm: calm.value,
    w: 18,
    h: 16
  }));
  return () => {
    return <TooltipPrimitive.Arrow asChild>
      <PropSvg res={res.value} kind="prop" data-slot="tooltip-arrow" width={res.value.w} height={res.value.h} viewBox={`0 0 ${res.value.w} ${res.value.h}`} preserveAspectRatio="xMidYMid meet" class="pointer-events-none" />
    </TooltipPrimitive.Arrow>;
  };
});
const TooltipContent = defineUi<UI.ComponentProps<typeof TooltipPrimitive.Content> & Pick<PaperProps, "stock" | "tilt" | "seed"> & {
  arrow?: boolean;
}>("TooltipContent", ["class", "sideOffset", "collisionPadding", "stock", "tilt", "arrow", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const sideOffset = computed(() => _props["sideOffset"] === undefined ? 1 : _props["sideOffset"]);
  const collisionPadding = computed(() => _props["collisionPadding"] === undefined ? 8 : _props["collisionPadding"]);
  const stock = computed(() => _props["stock"] === undefined ? "sticky-yellow" as const : _props["stock"]);
  const tilt = computed(() => _props["tilt"] === undefined ? true : _props["tilt"]);
  const arrow = computed(() => _props["arrow"] === undefined ? true : _props["arrow"]);
  const seedProp = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "sideOffset", "collisionPadding", "stock", "tilt", "arrow", "seed", "children"]));
  const scope = useInkScope();
  const seed = useInkSeed(() => seedProp.value);
  return () => {
    return <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content asChild sideOffset={sideOffset.value} collisionPadding={collisionPadding.value} {...domProps(props.value)}>
        <Paper data-slot="tooltip-content" stock={stock.value} tilt={tilt.value} rules="none" seed={seed.value} {...domProps(scope.value)} class={cn("z-(--ll-z-popover) w-fit max-w-[min(22rem,calc(100vw-1rem))] origin-(--reka-tooltip-content-transform-origin) px-2.5 py-1.5 text-sm/snug break-words text-balance text-foreground", "duration-(--ll-dur-pop) animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", className.value)}>
          {readSlot(_slots.default)}
          {arrow.value && <TooltipPointer seed={seed.value} />}
        </Paper>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>;
  };
});
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
