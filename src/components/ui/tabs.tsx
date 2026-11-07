// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "@/lib/primitives";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { tabsRecipe } from "@/lib/ink/recipes/tabs-ink";
import { cn } from "@/lib/utils";
const TabsContext = createContext<{
  orientation: "horizontal" | "vertical";
  variant: "default" | "line";
}>({
  orientation: "horizontal" as const,
  variant: "default" as const
});
const WIPE_WHEN_ACTIVE = "data-[state=active]:[&>svg_[data-part=swipe]]:animate-[ll-wipe_var(--ll-dur-sheet)_var(--ll-ease-out)_both]";
const Tabs = defineUi<UI.ComponentProps<typeof TabsPrimitive.Root>>("Tabs", ["class", "orientation"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const orientation = computed(() => _props["orientation"] === undefined ? "horizontal" as const : _props["orientation"]);
  const props = computed(() => omitProps(_props, ["class", "orientation"]));
  const ctx = useContext(TabsContext);
  const value = computed(() => ({
    ...ctx.value,
    orientation: orientation.value
  }));
  return () => {
    return <TabsContext.Provider value={value.value}>
      <TabsPrimitive.Root data-slot="tabs" data-orientation={orientation.value} orientation={orientation.value} class={cn("group/tabs flex gap-3 data-[orientation=horizontal]:flex-col", className.value)} {...domProps(props.value)}>{_slots.default?.()}</TabsPrimitive.Root>
    </TabsContext.Provider>;
  };
});
const tabsListVariants = cva("group/tabs-list inline-flex w-fit items-end justify-center text-muted-foreground aria-[orientation=horizontal]:h-10 aria-[orientation=vertical]:h-fit aria-[orientation=vertical]:flex-col aria-[orientation=vertical]:items-stretch", {
  variants: {
    variant: {
      default: "gap-1" as const,
      line: "gap-1" as const
    }
  },
  defaultVariants: {
    variant: "default" as const
  }
});
const TabsList = defineUi<UI.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>>("TabsList", ["class", "variant"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"] === undefined ? "default" as const : _props["variant"]);
  const props = computed(() => omitProps(_props, ["class", "variant"]));
  const ctx = useContext(TabsContext);
  const value = computed(() => ({
    ...ctx.value,
    variant: variant.value ?? "default"
  }));
  return () => {
    return <TabsContext.Provider value={value.value}>
      <TabsPrimitive.List data-slot="tabs-list" data-variant={variant.value} class={cn(tabsListVariants({
        variant: variant.value
      }), className.value)} {...domProps(props.value)}>{_slots.default?.()}</TabsPrimitive.List>
    </TabsContext.Provider>;
  };
});
const TabsTrigger = defineUi<UI.ComponentProps<typeof TabsPrimitive.Trigger> & {
  seed?: string | number;
}>("TabsTrigger", ["class", "seed", "disabled"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const disabled = computed(() => _props["disabled"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "seed", "disabled", "ref", "children"]));
  const _context6 = useContext(TabsContext);
  const orientation = computed(() => _context6.value.orientation);
  const variant = computed(() => _context6.value.variant);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: tabsRecipe,
    params: {
      variant: variant.value,
      orientation: orientation.value,
      disabled: !!disabled.value
    },
    kind: "tab" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <TabsPrimitive.Trigger data-slot="tabs-trigger" data-orientation={orientation.value} ref={useMergedRef<HTMLButtonElement>(hostRef, ref.value)} {...domProps(hostProps.value)} disabled={disabled.value} class={cn("relative isolate inline-flex h-9 flex-1 items-center justify-center gap-1.5 px-4 font-hand text-[15px] font-bold whitespace-nowrap text-muted-foreground transition-[translate,color] duration-(--ll-dur-hover) ease-settle hover:text-foreground data-[state=active]:text-foreground disabled:pointer-events-none disabled:text-pencil-text compact:h-8 calm:h-7 calm:text-sm", "data-[orientation=horizontal]:pt-1 data-[orientation=vertical]:pt-0.5 data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start", variant.value === "default" && "data-[orientation=horizontal]:data-[state=active]:-translate-y-0.5 data-[orientation=vertical]:data-[state=active]:translate-x-0.5 data-[orientation=vertical]:rtl:data-[state=active]:-translate-x-0.5", "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not(.absolute):not([class*='size-'])]:size-4", WIPE_WHEN_ACTIVE, className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </TabsPrimitive.Trigger>;
  };
});
const TabsContent = defineUi<UI.ComponentProps<typeof TabsPrimitive.Content>>("TabsContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <TabsPrimitive.Content data-slot="tabs-content" class={cn("flex-1 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-(--ll-dur-fade)", className.value)} {...domProps(props.value)}>{_slots.default?.()}</TabsPrimitive.Content>;
  };
});
export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
