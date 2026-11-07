// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Drawer as DrawerPrimitive } from "@/lib/drawer-primitive";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { Tape, type TapeProps } from "@/components/ui/tape";
import { useInkScope, useInkSeed } from "@/lib/ink/vue";
import { cn } from "@/lib/utils";
type Direction = "top" | "bottom" | "left" | "right";
const DrawerContext = createContext<{
  direction: Direction;
  modal: boolean;
}>({
  direction: "bottom" as const,
  modal: true
});
const Drawer = defineUi<UI.ComponentProps<typeof DrawerPrimitive.Root>>("Drawer", ["direction", "modal"], (_props, {
  slots: _slots
}) => {
  const direction = computed(() => _props["direction"] === undefined ? "bottom" as const : _props["direction"]);
  const modal = computed(() => _props["modal"] === undefined ? true : _props["modal"]);
  const props = computed(() => omitProps(_props, ["direction", "modal"]));
  const value = computed(() => ({
    direction: direction.value as Direction,
    modal: modal.value
  }));
  return () => {
    return <DrawerContext.Provider value={value.value}>
      <DrawerPrimitive.Root data-slot="drawer" direction={direction.value} modal={modal.value} {...domProps(props.value)}>{_slots.default?.()}</DrawerPrimitive.Root>
    </DrawerContext.Provider>;
  };
});
const DrawerTrigger = defineUi<UI.ComponentProps<typeof DrawerPrimitive.Trigger>>("DrawerTrigger", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...domProps(props.value)}>{_slots.default?.()}</DrawerPrimitive.Trigger>;
  };
});
const DrawerPortal = defineUi<UI.ComponentProps<typeof DrawerPrimitive.Portal>>("DrawerPortal", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <DrawerPrimitive.Portal data-slot="drawer-portal" {...domProps(props.value)}>{_slots.default?.()}</DrawerPrimitive.Portal>;
  };
});
const DrawerClose = defineUi<UI.ComponentProps<typeof DrawerPrimitive.Close>>("DrawerClose", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <DrawerPrimitive.Close data-slot="drawer-close" {...domProps(props.value)}>{_slots.default?.()}</DrawerPrimitive.Close>;
  };
});
const DrawerOverlay = defineUi<UI.ComponentProps<typeof DrawerPrimitive.Overlay>>("DrawerOverlay", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const scope = useInkScope();
  return () => {
    return <DrawerPrimitive.Overlay data-slot="drawer-overlay" {...domProps(scope.value)} class={cn("fixed inset-0 z-(--ll-z-overlay) [background:var(--ll-overlay-dim)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0", className.value)} {...domProps(props.value)}>{_slots.default?.()}</DrawerPrimitive.Overlay>;
  };
});
const DrawerContent = defineUi<UI.ComponentProps<typeof DrawerPrimitive.Content> & Pick<PaperProps, "stock" | "edge" | "seed"> & {
  tapeKind?: TapeProps["kind"];
  tapeColor?: TapeProps["color"];
}>("DrawerContent", ["class", "stock", "edge", "tapeKind", "tapeColor", "seed", "onOpenAutoFocus", "onPointerDownOutside"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const stock = computed(() => _props["stock"] === undefined ? "slip" as const : _props["stock"]);
  const edge = computed(() => _props["edge"]);
  const tapeKind = computed(() => _props["tapeKind"] === undefined ? "kraft" as const : _props["tapeKind"]);
  const tapeColor = computed(() => _props["tapeColor"]);
  const seedProp = computed(() => _props["seed"]);
  const onOpenAutoFocus = computed(() => _props["onOpenAutoFocus"]);
  const onPointerDownOutside = computed(() => _props["onPointerDownOutside"]);
  const props = computed(() => omitProps(_props, ["class", "children", "stock", "edge", "tapeKind", "tapeColor", "seed", "onOpenAutoFocus", "onPointerDownOutside"]));
  const scope = useInkScope();
  const _context11 = useContext(DrawerContext);
  const direction = computed(() => _context11.value.direction);
  const modal = computed(() => _context11.value.modal);
  const seed = useInkSeed(() => seedProp.value);
  return () => {
    return <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content asChild {...domProps(props.value)} onOpenAutoFocus={e => {
        onOpenAutoFocus.value?.(e);
        if (modal.value && !e.defaultPrevented) (e.target as HTMLElement | null)?.focus?.({
          preventScroll: true
        });
      }} onPointerDownOutside={e => {
        onPointerDownOutside.value?.(e);
        if ((e.target as Element | null)?.closest?.("[data-sonner-toaster]")) e.preventDefault();
      }}>
        <Paper data-slot="drawer-content" stock={stock.value} edge={edge.value ?? (direction.value === "bottom" ? {
          top: "torn" as const
        } : "cut" as const)} tilt={false} rules="none" seed={seed.value} {...domProps(scope.value)} class={cn("group/drawer-content fixed z-(--ll-z-overlay) flex h-auto flex-col text-foreground outline-hidden", "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh]", "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:pb-[env(safe-area-inset-bottom)]", "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-sm", "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-sm", className.value)}>
          <Tape kind={tapeKind.value} color={tapeColor.value} length={92} height={22} angle={-1.5} seed={`${seed.value}:grab`} class="absolute -top-3 left-1/2 hidden -translate-x-1/2 group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
          {readSlot(_slots.default)}
        </Paper>
      </DrawerPrimitive.Content>
    </DrawerPortal>;
  };
});
const DrawerHeader = defineUi<UI.ComponentProps<"div">>("DrawerHeader", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="drawer-header" class={cn("flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:pt-6 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-start", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const DrawerFooter = defineUi<UI.ComponentProps<"div">>("DrawerFooter", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="drawer-footer" class={cn("mt-auto flex flex-col gap-2 p-4", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const DrawerTitle = defineUi<UI.ComponentProps<typeof DrawerPrimitive.Title>>("DrawerTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <DrawerPrimitive.Title data-slot="drawer-title" class={cn("font-script text-[1.7rem] leading-none font-semibold text-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</DrawerPrimitive.Title>;
  };
});
const DrawerDescription = defineUi<UI.ComponentProps<typeof DrawerPrimitive.Description>>("DrawerDescription", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <DrawerPrimitive.Description data-slot="drawer-description" class={cn("text-sm text-muted-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</DrawerPrimitive.Description>;
  };
});
export { Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription };
