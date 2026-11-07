// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, shallowRef } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@/lib/primitives";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Fastener, Paper, type PaperProps } from "@/components/ui/paper";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { InkTiles, useInk, useInkSeed, useMergedRef } from "@/lib/ink/vue";
import { sidebarMarkRecipe, sidebarRuleRecipe } from "@/lib/ink/recipes/sidebar-ink";
import { hashSeed } from "@/lib/ink/rng";
import { cn } from "@/lib/utils";
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const INSET_TILES = ["fibre", "relief", "cloud"] as const;
type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};
const SidebarContext = createContext<SidebarContextProps | null>(null);
function useSidebar() {
  const context = useContext(SidebarContext);
  return computed(() => {
    if (!context.value) {
      console.error("useSidebar must be used within a SidebarProvider.");
    }
    return context.value;
  });
}
const SidebarProvider = defineUi<UI.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}>("SidebarProvider", ["defaultOpen", "open", "onOpenChange", "class", "style"], (_props, {
  slots: _slots
}) => {
  const defaultOpen = computed(() => _props["defaultOpen"] === undefined ? true : _props["defaultOpen"]);
  const openProp = computed(() => _props["open"]);
  const setOpenProp = computed(() => _props["onOpenChange"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["defaultOpen", "open", "onOpenChange", "class", "style", "children"]));
  const isMobile = useIsMobile();
  const openMobile = shallowRef(initialState(false));
  const setOpenMobile = stateSetter(openMobile);
  const _open = shallowRef(initialState(defaultOpen.value));
  const _setOpen = stateSetter(_open);
  const open = computed(() => openProp.value ?? _open.value);
  const setOpen = (value: boolean | ((value: boolean) => boolean)) => {
    const openState = typeof value === "function" ? value(open.value) : value;
    if (setOpenProp.value) {
      setOpenProp.value(openState);
    } else {
      _setOpen(openState);
    }
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  };
  const toggleSidebar = () => {
    return isMobile.value ? setOpenMobile(open => !open) : setOpen(open => !open);
  };
  watchDependencies(() => {
    if (!isMobile.value) setOpenMobile(false);
  }, () => [isMobile.value], false);
  watchDependencies(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey) && !event.defaultPrevented) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, () => [toggleSidebar], false);
  const state = computed(() => open.value ? "expanded" as const : "collapsed" as const);
  const contextValue = computed<SidebarContextProps>(() => ({
    state: state.value,
    open: open.value,
    setOpen,
    isMobile: isMobile.value,
    openMobile: openMobile.value,
    setOpenMobile,
    toggleSidebar
  }));
  return () => {
    return <SidebarContext.Provider value={contextValue.value}>
      <TooltipProvider delayDuration={0}>
        <div data-slot="sidebar-wrapper" style={cssStyle({
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style.value
        } as UI.CSSProperties)} class={cn("group/sidebar-wrapper flex min-h-svh w-full", className.value)} {...domProps(props.value)}>
          {readSlot(_slots.default)}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>;
  };
});
const DOCKED_SHADOW = "group-data-[variant=sidebar]:group-data-[side=left]:[--ll-sheet-shadow:7px_0_18px_-6px_rgb(var(--ll-shade)/calc(0.34*var(--ll-shadow-k))),1px_0_1.5px_rgb(var(--ll-shade)/calc(0.24*var(--ll-shadow-k)))] " + "group-data-[variant=sidebar]:group-data-[side=right]:[--ll-sheet-shadow:-7px_0_18px_-6px_rgb(var(--ll-shade)/calc(0.34*var(--ll-shadow-k))),-1px_0_1.5px_rgb(var(--ll-shade)/calc(0.24*var(--ll-shadow-k)))]";
const SidebarClip = defineUi<{
  seed: string;
  inside?: boolean;
  className?: string;
}>("SidebarClip", ["seed", "inside", "class"], (_props, {
  slots: _slots
}) => {
  const seed = computed(() => _props["seed"]);
  const inside = computed(() => _props["inside"] === undefined ? false : _props["inside"]);
  const className = computed(() => _props["class"]);
  return () => {
    return <Fastener data-slot="sidebar-clip" kind="binder-clip" size={38} seed={`${seed.value}|clip`} class={cn("absolute start-1/2 -ms-[19px] z-(--ll-z-prop) calm:hidden group-data-[collapsible=icon]:hidden forced-colors:hidden", inside.value ? "top-1" as const : "-top-3.5" as const, className.value)} />;
  };
});
const INSIDE_CLIP_PAD = "pt-11";
type SidebarProps = UI.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
  stock?: PaperProps["stock"];
  clip?: boolean;
  seed?: string | number;
};
const Sidebar = defineUi<SidebarProps>("Sidebar", ["side", "variant", "collapsible", "stock", "clip", "seed", "class"], (_props, {
  slots: _slots
}) => {
  const side = computed(() => _props["side"] === undefined ? "left" as const : _props["side"]);
  const variant = computed(() => _props["variant"] === undefined ? "sidebar" as const : _props["variant"]);
  const collapsible = computed(() => _props["collapsible"] === undefined ? "offcanvas" as const : _props["collapsible"]);
  const stock = computed(() => _props["stock"] === undefined ? "pad" as const : _props["stock"]);
  const clipProp = computed(() => _props["clip"]);
  const seedProp = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["side", "variant", "collapsible", "stock", "clip", "seed", "class", "children"]));
  const _hook9 = useSidebar();
  const isMobile = computed(() => _hook9.value.isMobile);
  const state = computed(() => _hook9.value.state);
  const openMobile = computed(() => _hook9.value.openMobile);
  const setOpenMobile = computed(() => _hook9.value.setOpenMobile);
  const clip = computed(() => clipProp.value ?? collapsible.value !== "none");
  const seed = useInkSeed(() => seedProp.value);
  const opener = shallowRef<HTMLElement | null | null>(null);
  return () => {
    if (collapsible.value === "none") {
      return <Paper data-slot="sidebar" stock={stock.value} tilt={false} rules="none" seed={seed.value} class={cn("group flex h-full w-(--sidebar-width) flex-col text-sidebar-foreground", clip.value && INSIDE_CLIP_PAD, className.value)} {...domProps(props.value as UI.ComponentProps<"div">)}>
        {clip.value && <SidebarClip seed={seed.value} inside />}
        {readSlot(_slots.default)}
      </Paper>;
    }
    if (isMobile.value) {
      return <Sheet open={openMobile.value} onOpenChange={setOpenMobile.value} {...domProps(props.value)}>
        <SheetContent data-sidebar="sidebar" data-slot="sidebar" data-mobile="true" side={side.value} stock={stock.value} binding="none" rules="none" seed={seed.value} showCloseButton={false} onOpenAutoFocus={() => {
          opener.value = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }} onCloseAutoFocus={event => {
          event.preventDefault();
          opener.value?.focus();
        }} class={cn("group w-(--sidebar-width) p-0 text-sidebar-foreground [&>button]:hidden", clip.value ? INSIDE_CLIP_PAD : "pt-2" as const)} style={cssStyle({
          "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON
        } as UI.CSSProperties)}>
          <SheetHeader class="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          {clip.value && <SidebarClip seed={seed.value} inside />}
          <div class="flex h-full w-full flex-col">{readSlot(_slots.default)}</div>
        </SheetContent>
      </Sheet>;
    }
    return <div class="group peer hidden text-sidebar-foreground md:block" data-state={state.value} data-collapsible={state.value === "collapsed" ? collapsible.value : "" as const} data-variant={variant.value} data-side={side.value} data-slot="sidebar">
      {variant.value === "inset" && <InkTiles tiles={INSET_TILES} />}
      <div data-slot="sidebar-gap" class={cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-(--ll-dur-sheet) ease-out", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant.value === "floating" || variant.value === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" as const : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)" as const)} />
      <div data-slot="sidebar-container" class={cn("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) pt-4 transition-[left,right,width] duration-(--ll-dur-sheet) ease-out md:flex", side.value === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" as const : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]" as const, variant.value === "floating" || variant.value === "inset" ? "p-2 pt-4 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" as const : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)" as const, className.value)} {...domProps(props.value)}>
        <Paper data-sidebar="sidebar" data-slot="sidebar-inner" stock={stock.value} tilt={variant.value === "floating"} rules="none" seed={seed.value} class={cn("flex h-full w-full flex-col", clip.value && "pt-6", DOCKED_SHADOW)}>
          {clip.value && <SidebarClip seed={seed.value} />}
          {readSlot(_slots.default)}
        </Paper>
      </div>
    </div>;
  };
});
const SidebarTrigger = defineUi<UI.ComponentProps<typeof Button>>("SidebarTrigger", ["class", "onClick"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const onClick = computed(() => _props["onClick"]);
  const props = computed(() => omitProps(_props, ["class", "onClick"]));
  const _hook3 = useSidebar();
  const toggleSidebar = computed(() => _hook3.value.toggleSidebar);
  return () => {
    return <Button data-sidebar="trigger" data-slot="sidebar-trigger" variant="ghost" size="icon" class={cn("size-7", className.value)} onClick={event => {
      onClick.value?.(event);
      toggleSidebar.value();
    }} {...domProps(props.value)}>
      <Icon name="panel-left" />
      <span class="sr-only">Toggle Sidebar</span>
    </Button>;
  };
});
const SidebarRail = defineUi<UI.ComponentProps<"button">>("SidebarRail", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const _hook2 = useSidebar();
  const toggleSidebar = computed(() => _hook2.value.toggleSidebar);
  return () => {
    return <button data-sidebar="rail" data-slot="sidebar-rail" aria-label="Toggle Sidebar" tabindex={-1} onClick={toggleSidebar.value} title="Toggle Sidebar" class={cn("absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-pencil-mark sm:flex", "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", className.value)} {...domProps(props.value)}>{_slots.default?.()}</button>;
  };
});
const SidebarInset = defineUi<UI.ComponentProps<"main">>("SidebarInset", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <main data-slot="sidebar-inset" class={cn("relative flex w-full flex-1 flex-col ll-paper ll-stock-paper ll-tooth-cold before:hidden md:peer-data-[variant=inset]:before:block", "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-2", className.value)} {...domProps(props.value)}>{_slots.default?.()}</main>;
  };
});
const SidebarInput = defineUi<UI.ComponentProps<typeof Input>>("SidebarInput", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <Input data-slot="sidebar-input" data-sidebar="input" class={cn("h-8 w-full", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Input>;
  };
});
const SidebarHeader = defineUi<UI.ComponentProps<"div">>("SidebarHeader", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="sidebar-header" data-sidebar="header" class={cn("flex flex-col gap-2 p-2", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const SidebarFooter = defineUi<UI.ComponentProps<"div">>("SidebarFooter", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="sidebar-footer" data-sidebar="footer" class={cn("flex flex-col gap-2 p-2", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const SidebarSeparator = defineUi<UI.ComponentProps<typeof Separator>>("SidebarSeparator", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <Separator data-slot="sidebar-separator" data-sidebar="separator" class={cn("mx-2 data-[orientation=horizontal]:w-auto", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Separator>;
  };
});
const SidebarContent = defineUi<UI.ComponentProps<"div">>("SidebarContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="sidebar-content" data-sidebar="content" class={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const SidebarGroup = defineUi<UI.ComponentProps<"div">>("SidebarGroup", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="sidebar-group" data-sidebar="group" class={cn("relative flex w-full min-w-0 flex-col p-2", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const SidebarGroupLabel = defineUi<UI.ComponentProps<"div"> & {
  asChild?: boolean;
}>("SidebarGroupLabel", ["class", "asChild"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const props = computed(() => omitProps(_props, ["class", "asChild"]));
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "div" as const));
  return () => {
    return <Comp.value data-slot="sidebar-group-label" data-sidebar="group-label" class={cn("flex h-8 shrink-0 items-center px-2 font-type text-sm tracking-wide text-ink-muted transition-[margin,opacity] duration-(--ll-dur-sheet) ease-out [&>svg:not(.absolute)]:size-4 [&>svg:not(.absolute)]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Comp.value>;
  };
});
const SidebarGroupAction = defineUi<UI.ComponentProps<"button"> & {
  asChild?: boolean;
}>("SidebarGroupAction", ["class", "asChild"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const props = computed(() => omitProps(_props, ["class", "asChild"]));
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "button" as const));
  return () => {
    return <Comp.value data-slot="sidebar-group-action" data-sidebar="group-action" class={cn("absolute end-3 top-3 flex aspect-square w-6 items-center justify-center p-0 text-sidebar-foreground transition-transform hover:ll-swipe [&>svg:not(.absolute)]:size-4 [&>svg:not(.absolute)]:shrink-0", "after:absolute after:-inset-2 md:after:hidden", "group-data-[collapsible=icon]:hidden", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Comp.value>;
  };
});
const SidebarGroupContent = defineUi<UI.ComponentProps<"div">>("SidebarGroupContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="sidebar-group-content" data-sidebar="group-content" class={cn("w-full text-sm", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const SidebarMenu = defineUi<UI.ComponentProps<"ul">>("SidebarMenu", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <ul data-slot="sidebar-menu" data-sidebar="menu" class={cn("flex w-full min-w-0 flex-col gap-1", className.value)} {...domProps(props.value)}>{_slots.default?.()}</ul>;
  };
});
const SidebarMenuItem = defineUi<UI.ComponentProps<"li">>("SidebarMenuItem", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <li data-slot="sidebar-menu-item" data-sidebar="menu-item" class={cn("group/menu-item relative", className.value)} {...domProps(props.value)}>{_slots.default?.()}</li>;
  };
});
const sidebarMenuButtonVariants = cva("peer/menu-button relative isolate flex w-full items-center gap-2 p-2 text-start font-hand text-base transition-[width,height,padding] after:pointer-events-none after:absolute after:inset-x-1 after:-bottom-0.5 after:h-px after:bg-(--ll-pad-rule) group-odd/menu-item:after:[mask-image:linear-gradient(90deg,var(--ll-ink),color-mix(in_srgb,var(--ll-ink)_78%,transparent)_45%,var(--ll-ink))] group-even/menu-item:after:[mask-image:linear-gradient(90deg,color-mix(in_srgb,var(--ll-ink)_82%,transparent),var(--ll-ink)_55%,color-mix(in_srgb,var(--ll-ink)_86%,transparent))] group-data-[collapsible=icon]:after:hidden calm:after:hidden group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:ll-swipe focus-visible:ll-swipe disabled:pointer-events-none disabled:text-pencil-text aria-disabled:pointer-events-none aria-disabled:text-pencil-text data-[active=true]:font-bold data-[active=true]:ll-swipe data-[active=true]:has-[>[data-ink-ready]]:bg-transparent data-[state=open]:hover:ll-swipe [&>span:last-child]:truncate [&>svg:not(.absolute)]:size-4 [&>svg:not(.absolute)]:shrink-0 [&>svg:not(.absolute)]:text-ink-soft", {
  variants: {
    variant: {
      default: "" as const,
      outline: "" as const
    },
    size: {
      default: "h-8 compact:h-7 calm:h-7 calm:text-[15px]" as const,
      sm: "h-7 text-[15px]" as const,
      lg: "h-12 group-data-[collapsible=icon]:p-0!" as const
    }
  },
  defaultVariants: {
    variant: "default" as const,
    size: "default" as const
  }
});
const MenuButtonMark = defineUi<{
  active: boolean;
  outline: boolean;
}>("MenuButtonMark", ["active", "outline"], (_props, {
  slots: _slots
}) => {
  const active = computed(() => _props["active"]);
  const outline = computed(() => _props["outline"]);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: sidebarMarkRecipe,
    params: {
      active: active.value,
      outline: outline.value
    },
    kind: "mark" as const,
    still: true
  }));
  return () => {
    return <span data-slot="sidebar-menu-button-mark" aria-hidden="true" ref={hostRef} {...domProps(hostProps.value)} class="pointer-events-none absolute inset-0 -z-10 block group-data-[collapsible=icon]:[&_[data-part=bracket]]:hidden">
      {node.value}
    </span>;
  };
});
const SidebarMenuButton = defineUi<UI.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | UI.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>>("SidebarMenuButton", ["asChild", "isActive", "variant", "size", "tooltip", "class"], (_props, {
  slots: _slots
}) => {
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const isActive = computed(() => _props["isActive"] === undefined ? false : _props["isActive"]);
  const variant = computed(() => _props["variant"] === undefined ? "default" as const : _props["variant"]);
  const size = computed(() => _props["size"] === undefined ? "default" as const : _props["size"]);
  const tooltip = computed(() => _props["tooltip"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["asChild", "isActive", "variant", "size", "tooltip", "class", "children"]));
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "button" as const));
  const _hook9 = useSidebar();
  const isMobile = computed(() => _hook9.value.isMobile);
  const state = computed(() => _hook9.value.state);
  const marked = computed(() => isActive.value || variant.value === "outline");
  const mark = renderValue(() => marked.value ? <MenuButtonMark active={isActive.value} outline={variant.value === "outline"} /> : null);
  const shared = computed(() => ({
    "data-slot": "sidebar-menu-button" as const,
    "data-sidebar": "menu-button" as const,
    "data-size": size.value,
    "data-active": isActive.value,
    "aria-current": isActive.value && asChild.value ? "page" as const : undefined,
    class: cn(sidebarMenuButtonVariants({
      variant: variant.value,
      size: size.value
    }), className.value),
    ...props.value
  }));
  const button = renderValue(() => asChild.value ? <Comp.value {...domProps(shared.value)}>
      <Slot.Slottable>{children.value}</Slot.Slottable>
      {mark.value}
    </Comp.value> : <Comp.value {...domProps(shared.value)}>
      {mark.value}
      {children.value}
    </Comp.value>);
  return () => {
    if (!tooltip.value) {
      return button.value;
    }
    if (typeof tooltip.value === "string") {
      tooltip.value = {
        children: tooltip.value
      };
    }
    return <Tooltip>
      <TooltipTrigger asChild>{button.value}</TooltipTrigger>
      <TooltipContent side="right" align="center" hidden={state.value !== "collapsed" || isMobile.value} {...domProps(tooltip.value)} />
    </Tooltip>;
  };
});
const SidebarMenuAction = defineUi<UI.ComponentProps<"button"> & {
  asChild?: boolean;
  showOnHover?: boolean;
}>("SidebarMenuAction", ["class", "asChild", "showOnHover"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const showOnHover = computed(() => _props["showOnHover"] === undefined ? false : _props["showOnHover"]);
  const props = computed(() => omitProps(_props, ["class", "asChild", "showOnHover"]));
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "button" as const));
  return () => {
    return <Comp.value data-slot="sidebar-menu-action" data-sidebar="menu-action" class={cn("absolute end-1 top-1 flex aspect-square w-6 items-center justify-center p-0 text-sidebar-foreground transition-transform hover:ll-swipe [&>svg:not(.absolute)]:size-4 [&>svg:not(.absolute)]:shrink-0", "after:absolute after:-inset-2 md:after:hidden", "peer-data-[size=sm]/menu-button:top-0.5", "peer-data-[size=default]/menu-button:top-1", "peer-data-[size=lg]/menu-button:top-3", "group-data-[collapsible=icon]:hidden", showOnHover.value && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Comp.value>;
  };
});
const SidebarMenuBadge = defineUi<UI.ComponentProps<"div">>("SidebarMenuBadge", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="sidebar-menu-badge" data-sidebar="menu-badge" class={cn("pointer-events-none absolute end-1 flex h-5 min-w-5 items-center justify-center px-1 font-script text-lg leading-none font-semibold text-ink-you tabular-nums select-none", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-3.5", "group-data-[collapsible=icon]:hidden", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const SidebarMenuSkeleton = defineUi<UI.ComponentProps<"div"> & {
  showIcon?: boolean;
  seed?: string | number;
}>("SidebarMenuSkeleton", ["class", "showIcon", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const showIcon = computed(() => _props["showIcon"] === undefined ? false : _props["showIcon"]);
  const seed = computed(() => _props["seed"]);
  const props = computed(() => omitProps(_props, ["class", "showIcon", "seed"]));
  const id = useInkSeed(() => seed.value);
  const width = computed(() => `${50 + hashSeed(id.value) % 41}%`);
  return () => {
    return <div data-slot="sidebar-menu-skeleton" data-sidebar="menu-skeleton" class={cn("flex h-8 items-center gap-2 px-2", className.value)} {...domProps(props.value)}>
      {showIcon.value && <Skeleton class="size-4" data-sidebar="menu-skeleton-icon" />}
      <Skeleton class="h-4 max-w-(--skeleton-width) flex-1" data-sidebar="menu-skeleton-text" style={cssStyle({
        "--skeleton-width": width.value
      } as UI.CSSProperties)} />
    </div>;
  };
});
const SidebarMenuSub = defineUi<UI.ComponentProps<"ul">>("SidebarMenuSub", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "ref", "children"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: sidebarRuleRecipe,
    params: {},
    kind: "rule" as const,
    still: true
  }));
  return () => {
    return <ul data-slot="sidebar-menu-sub" data-sidebar="menu-sub" ref={useMergedRef<HTMLUListElement>(hostRef, ref.value)} {...domProps(hostProps.value)} class={cn("relative isolate mx-3.5 flex min-w-0 flex-col gap-1 px-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </ul>;
  };
});
const SidebarMenuSubItem = defineUi<UI.ComponentProps<"li">>("SidebarMenuSubItem", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <li data-slot="sidebar-menu-sub-item" data-sidebar="menu-sub-item" class={cn("group/menu-sub-item relative", className.value)} {...domProps(props.value)}>{_slots.default?.()}</li>;
  };
});
const SidebarMenuSubButton = defineUi<UI.ComponentProps<"a"> & {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
}>("SidebarMenuSubButton", ["asChild", "size", "isActive", "class"], (_props, {
  slots: _slots
}) => {
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const size = computed(() => _props["size"] === undefined ? "md" as const : _props["size"]);
  const isActive = computed(() => _props["isActive"] === undefined ? false : _props["isActive"]);
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["asChild", "size", "isActive", "class"]));
  const Comp = computed(() => jsxTag(asChild.value ? Slot.Root : "a" as const));
  return () => {
    return <Comp.value data-slot="sidebar-menu-sub-button" data-sidebar="menu-sub-button" data-size={size.value} data-active={isActive.value} aria-current={isActive.value ? "page" as const : undefined} class={cn("flex min-h-7 min-w-0 items-center gap-2 px-2 py-0.5 font-hand text-sidebar-foreground hover:ll-swipe focus-visible:ll-swipe aria-disabled:pointer-events-none aria-disabled:text-pencil-text [&>span:last-child]:truncate [&>svg:not(.absolute)]:size-4 [&>svg:not(.absolute)]:shrink-0 [&>svg:not(.absolute)]:text-ink-soft", "data-[active=true]:font-bold data-[active=true]:ll-swipe", size.value === "sm" && "text-[15px]", size.value === "md" && "text-base", "leading-snug group-data-[collapsible=icon]:hidden", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Comp.value>;
  };
});
export { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar };
