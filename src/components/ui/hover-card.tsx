// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { HoverCard as HoverCardPrimitive } from "@/lib/primitives";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { useInk, useInkScope, useInkSeed, useMergedRef } from "@/lib/ink/vue";
import { hoverCardMediaRecipe } from "@/lib/ink/recipes/hover-card-ink";
import { cn } from "@/lib/utils";
const HoverCard = defineUi<UI.ComponentProps<typeof HoverCardPrimitive.Root>>("HoverCard", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <HoverCardPrimitive.Root data-slot="hover-card" {...domProps(props.value)}>{_slots.default?.()}</HoverCardPrimitive.Root>;
  };
});
const HoverCardTrigger = defineUi<UI.ComponentProps<typeof HoverCardPrimitive.Trigger>>("HoverCardTrigger", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...domProps(props.value)}>{_slots.default?.()}</HoverCardPrimitive.Trigger>;
  };
});
const HoverCardContent = defineUi<UI.ComponentProps<typeof HoverCardPrimitive.Content> & Pick<PaperProps, "stock" | "edge" | "tilt" | "tape" | "seed">>("HoverCardContent", ["class", "align", "sideOffset", "collisionPadding", "stock", "edge", "tilt", "tape", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const align = computed(() => _props["align"] === undefined ? "center" as const : _props["align"]);
  const sideOffset = computed(() => _props["sideOffset"] === undefined ? 8 : _props["sideOffset"]);
  const collisionPadding = computed(() => _props["collisionPadding"] === undefined ? 8 : _props["collisionPadding"]);
  const stock = computed(() => _props["stock"] === undefined ? "photo" as const : _props["stock"]);
  const edge = computed(() => _props["edge"]);
  const tilt = computed(() => _props["tilt"] === undefined ? true : _props["tilt"]);
  const tape = computed(() => _props["tape"] === undefined ? false : _props["tape"]);
  const seedProp = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "align", "sideOffset", "collisionPadding", "stock", "edge", "tilt", "tape", "seed", "children"]));
  const scope = useInkScope();
  const seed = useInkSeed(() => seedProp.value);
  return () => {
    return <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content asChild align={align.value} sideOffset={sideOffset.value} collisionPadding={collisionPadding.value} {...domProps(props.value)}>
        <Paper data-slot="hover-card-content" stock={stock.value} edge={edge.value} tilt={tilt.value} tape={tape.value} rules="none" seed={seed.value} {...domProps(scope.value)} class={cn("z-(--ll-z-popover) w-64 max-w-[calc(100vw-1rem)] origin-(--reka-hover-card-content-transform-origin) p-2.5 pb-4 text-popover-foreground outline-hidden compact:p-2 calm:p-2", "duration-(--ll-dur-pop) data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", className.value)}>
          {readSlot(_slots.default)}
        </Paper>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>;
  };
});
const HoverCardMedia = defineUi<UI.ComponentProps<"div"> & {
  seed?: string | number;
}>("HoverCardMedia", ["class", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const seedProp = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "seed", "children", "ref"]));
  const seed = useInkSeed(() => seedProp.value);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: hoverCardMediaRecipe,
    params: {},
    kind: "frame" as const,
    seed: seed.value
  }));
  return () => {
    return <div data-slot="hover-card-media" ref={useMergedRef<HTMLElement>(hostRef, ref.value as UI.Ref<HTMLElement> | undefined)} {...domProps(hostProps.value)} class={cn("relative isolate grid h-28 place-items-center bg-paper-shade/60 p-2 *:[img]:size-full *:[img]:object-cover", className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </div>;
  };
});
const HoverCardCaption = defineUi<UI.ComponentProps<"div">>("HoverCardCaption", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="hover-card-caption" class={cn("mt-2.5 px-1 font-script text-[1.4rem] leading-tight text-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
export { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardMedia, HoverCardCaption };
