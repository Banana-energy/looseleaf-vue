// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cva } from "class-variance-authority";
import { NavigationMenu as NavigationMenuPrimitive, Slot as SlotPrimitive } from "@/lib/primitives";
import { Icon } from "@/components/ui/icon";
import { Paper } from "@/components/ui/paper";
import { PropSvg } from "@/lib/ink/paper/prop-svg";
import { stockOf, TOOTH_TILES } from "@/lib/ink/paper/stocks";
import type { PaperTileName } from "@/lib/ink/textures";
import { InkTiles, useDensity, useInk, useInkSeed, useInkTier, useMergedRef } from "@/lib/ink/vue";
import { navBaselineRecipe, navTabRecipe, underlineMark } from "@/lib/ink/recipes/navigation-menu-ink";
import { cn } from "@/lib/utils";
const InPanel = createContext(false);
const NavigationMenu = defineUi<UI.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}>("NavigationMenu", ["class", "viewport"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const viewport = computed(() => _props["viewport"] === undefined ? true : _props["viewport"]);
  const props = computed(() => omitProps(_props, ["class", "children", "viewport"]));
  const tiles = computed(() => TOOTH_TILES[stockOf("slip").tooth].map(([t]) => t) as PaperTileName[]);
  return () => {
    return <NavigationMenuPrimitive.Root data-slot="navigation-menu" data-viewport={viewport.value} class={cn("group/navigation-menu relative flex max-w-max flex-1 items-center justify-center", className.value)} {...domProps(props.value)}>
      {viewport.value ? null : <InkTiles tiles={tiles.value} />}
      {readSlot(_slots.default)}
      {viewport.value && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>;
  };
});
const NavigationMenuList = defineUi<UI.ComponentProps<typeof NavigationMenuPrimitive.List>>("NavigationMenuList", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: navBaselineRecipe,
    params: {},
    kind: "rule" as const,
    still: true
  }));
  return () => {
    return <NavigationMenuPrimitive.List data-slot="navigation-menu-list" ref={useMergedRef<HTMLUListElement>(hostRef, ref.value)} {...domProps(node.value ? hostProps.value : {})} class={cn("group relative isolate flex flex-1 list-none items-end justify-center gap-1", className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </NavigationMenuPrimitive.List>;
  };
});
const NavigationMenuItem = defineUi<UI.ComponentProps<typeof NavigationMenuPrimitive.Item>>("NavigationMenuItem", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <NavigationMenuPrimitive.Item data-slot="navigation-menu-item" class={cn("relative", className.value)} {...domProps(props.value)}>{_slots.default?.()}</NavigationMenuPrimitive.Item>;
  };
});
const navigationMenuTriggerStyle = cva("group relative isolate inline-flex h-9 w-max items-center justify-center gap-1 px-4 py-2 font-hand text-[15px] font-bold whitespace-nowrap text-foreground transition-[translate,color] duration-(--ll-dur-hover) ease-settle disabled:pointer-events-none disabled:text-pencil-text data-[state=open]:-translate-y-0.5 data-[selected]:-translate-y-0.5 compact:h-8 calm:h-7 calm:text-sm");
const NavigationMenuTrigger = defineUi<UI.ComponentProps<typeof NavigationMenuPrimitive.Trigger> & {
  seed?: string | number;
}>("NavigationMenuTrigger", ["class", "seed", "disabled"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const seed = computed(() => _props["seed"]);
  const disabled = computed(() => _props["disabled"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "children", "seed", "disabled", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: navTabRecipe,
    params: {
      role: "trigger" as const,
      disabled: !!disabled.value
    },
    kind: "tab" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <NavigationMenuPrimitive.Trigger data-slot="navigation-menu-trigger" ref={useMergedRef<HTMLButtonElement>(hostRef, ref.value)} {...domProps(hostProps.value)} disabled={disabled.value} class={cn(navigationMenuTriggerStyle(), "group", className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
      <Icon name="chevron-down" size={16} aria-hidden="true" class="relative top-px transition-transform duration-(--ll-dur-sheet) ease-settle group-data-[state=open]:rotate-180" />
    </NavigationMenuPrimitive.Trigger>;
  };
});
const NavigationMenuContent = defineUi<UI.ComponentProps<typeof NavigationMenuPrimitive.Content>>("NavigationMenuContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  return () => {
    return <NavigationMenuPrimitive.Content data-slot="navigation-menu-content" class={cn("start-0 top-0 w-full p-2 pe-2.5 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 rtl:data-[motion=from-end]:slide-in-from-left-52 rtl:data-[motion=from-start]:slide-in-from-right-52 rtl:data-[motion=to-end]:slide-out-to-left-52 rtl:data-[motion=to-start]:slide-out-to-right-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out md:absolute md:w-auto", "group-data-[viewport=false]/navigation-menu:ll-paper group-data-[viewport=false]/navigation-menu:ll-stock-slip group-data-[viewport=false]/navigation-menu:ll-tooth-fine group-data-[viewport=false]/navigation-menu:ll-sheet-slip group-data-[viewport=false]/navigation-menu:[--ll-sheet-shadow:var(--ll-shadow-lift)] group-data-[viewport=false]/navigation-menu:calm:[--ll-sheet-shadow:var(--ll-shadow-hair)] group-data-[viewport=false]/navigation-menu:absolute! group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-2 group-data-[viewport=false]/navigation-menu:z-(--ll-z-popover) group-data-[viewport=false]/navigation-menu:duration-(--ll-dur-pop) group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95", className.value)} {...domProps(props.value)}>
      <InPanel.Provider value>{readSlot(_slots.default)}</InPanel.Provider>
    </NavigationMenuPrimitive.Content>;
  };
});
const NavigationMenuViewport = defineUi<UI.ComponentProps<typeof NavigationMenuPrimitive.Viewport>>("NavigationMenuViewport", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <Paper data-slot="navigation-menu-viewport-frame" stock="slip" tilt={0.3} rules="none" class={cn("absolute start-0 top-full mt-2 isolate z-(--ll-z-popover) flex justify-center empty:hidden", "data-[side]:[--ll-sheet-shadow:var(--ll-shadow-lift)] [--ll-sheet-shadow:var(--ll-shadow-lift)] calm:[--ll-sheet-shadow:var(--ll-shadow-hair)]", "duration-(--ll-dur-pop) has-[[data-state=closed]]:animate-out has-[[data-state=closed]]:fade-out-0 has-[[data-state=open]]:animate-in has-[[data-state=open]]:fade-in-0 has-[[data-state=open]]:slide-in-from-top-2")}>
      <NavigationMenuPrimitive.Viewport data-slot="navigation-menu-viewport" class={cn("origin-top relative h-(--reka-navigation-menu-viewport-height) w-full overflow-hidden transition-[width,height] duration-(--ll-dur-sheet) ease-out data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:zoom-in-90 md:w-(--reka-navigation-menu-viewport-width)", className.value)} {...domProps(props.value)}>{_slots.default?.()}</NavigationMenuPrimitive.Viewport>
    </Paper>;
  };
});
const NavigationMenuLink = defineUi<UI.ComponentProps<typeof NavigationMenuPrimitive.Link> & {
  seed?: string | number;
}>("NavigationMenuLink", ["class", "active", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const active = computed(() => _props["active"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "active", "seed", "ref", "children"]));
  const inPanel = useContext(InPanel);
  return () => {
    if (inPanel.value) {
      return <NavigationMenuPrimitive.Link data-slot="navigation-menu-link" ref={ref.value} active={active.value} class={cn("flex flex-col gap-1 p-2 font-hand text-base transition-all hover:ll-swipe focus-visible:ll-swipe data-[active]:ll-swipe [&_svg:not(.absolute):not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-ink-soft", className.value)} {...domProps(props.value)}>
        {readSlot(_slots.default)}
      </NavigationMenuPrimitive.Link>;
    }
    return <TabLink active={active.value} seed={seed.value} class={className.value} refProp={ref.value} {...domProps(props.value)}>
      {readSlot(_slots.default)}
    </TabLink>;
  };
});
const TabLink = defineUi<UI.ComponentProps<typeof NavigationMenuPrimitive.Link> & {
  seed?: string | number;
  refProp?: UI.Ref<HTMLAnchorElement>;
}>("TabLink", ["class", "active", "seed", "refProp", "asChild"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const active = computed(() => _props["active"]);
  const seed = computed(() => _props["seed"]);
  const refProp = computed(() => _props["refProp"]);
  const asChild = computed(() => _props["asChild"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "active", "seed", "refProp", "asChild", "children"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: navTabRecipe,
    params: {
      role: "link" as const
    },
    kind: "tab" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <NavigationMenuPrimitive.Link data-slot="navigation-menu-link" data-selected={active.value ? "" as const : undefined} ref={useMergedRef<HTMLAnchorElement>(hostRef, refProp.value)} active={active.value} asChild={asChild.value} {...domProps(hostProps.value)} class={cn(navigationMenuTriggerStyle(), className.value)} {...domProps(props.value)}>
      {node.value}
      {asChild.value ? <SlotPrimitive.Slottable>{readSlot(_slots.default)}</SlotPrimitive.Slottable> : readSlot(_slots.default)}
    </NavigationMenuPrimitive.Link>;
  };
});
const NavigationMenuIndicator = defineUi<UI.ComponentProps<typeof NavigationMenuPrimitive.Indicator>>("NavigationMenuIndicator", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const seed = useInkSeed();
  const tier = useInkTier();
  const _nestedHook0 = useDensity();
  const calm = computed(() => _nestedHook0.value === "calm");
  const res = computed(() => underlineMark(`${seed.value}|underline`, {
    tier: tier.value,
    calm: calm.value
  }));
  return () => {
    return <NavigationMenuPrimitive.Indicator data-slot="navigation-menu-indicator" class={cn("top-full z-[1] block h-2 transition-[transform,width] duration-(--ll-dur-sheet) ease-settle data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in", className.value)} {...domProps(props.value)}>
      <PropSvg res={res.value} kind="prop" preserveAspectRatio="none" width="100%" height={res.value.h} class="pointer-events-none block" />
    </NavigationMenuPrimitive.Indicator>;
  };
});
export { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport, navigationMenuTriggerStyle };
