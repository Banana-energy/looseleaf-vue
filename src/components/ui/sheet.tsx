// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Dialog as SheetPrimitive } from "@/lib/primitives";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { useInk, useInkScope, useInkSeed } from "@/lib/ink/vue";
import { closeMarkRecipe } from "@/lib/ink/recipes/overlay-ink";
import { sheetBindingRecipe, type BindingEdge, type BindingKind } from "@/lib/ink/recipes/sheet-ink";
import { cn } from "@/lib/utils";
type Side = "top" | "right" | "bottom" | "left";
type Binding = "spiral" | "holes" | "perf" | "torn" | "none";
const INNER: Record<Side, BindingEdge> = {
  right: "left" as const,
  left: "right" as const,
  top: "bottom" as const,
  bottom: "top" as const
};
const Sheet = defineUi<UI.ComponentProps<typeof SheetPrimitive.Root>>("Sheet", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <SheetPrimitive.Root data-slot="sheet" {...domProps(props.value)}>{_slots.default?.()}</SheetPrimitive.Root>;
  };
});
const SheetTrigger = defineUi<UI.ComponentProps<typeof SheetPrimitive.Trigger>>("SheetTrigger", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...domProps(props.value)}>{_slots.default?.()}</SheetPrimitive.Trigger>;
  };
});
const SheetClose = defineUi<UI.ComponentProps<typeof SheetPrimitive.Close>>("SheetClose", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <SheetPrimitive.Close data-slot="sheet-close" {...domProps(props.value)}>{_slots.default?.()}</SheetPrimitive.Close>;
  };
});
const SheetPortal = defineUi<UI.ComponentProps<typeof SheetPrimitive.Portal>>("SheetPortal", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <SheetPrimitive.Portal data-slot="sheet-portal" {...domProps(props.value)}>{_slots.default?.()}</SheetPrimitive.Portal>;
  };
});
const SheetOverlay = defineUi<UI.ComponentProps<typeof SheetPrimitive.Overlay>>("SheetOverlay", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const scope = useInkScope();
  return () => {
    return <SheetPrimitive.Overlay data-slot="sheet-overlay" {...domProps(scope.value)} class={cn("fixed inset-0 z-(--ll-z-overlay) [background:var(--ll-overlay-dim)] duration-(--ll-dur-sheet) data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0", className.value)} {...domProps(props.value)}>{_slots.default?.()}</SheetPrimitive.Overlay>;
  };
});
const SheetBinding = defineUi<{
  edge: BindingEdge;
  kind: BindingKind;
  seed: string;
}>("SheetBinding", ["edge", "kind", "seed"], (_props, {
  slots: _slots
}) => {
  const edge = computed(() => _props["edge"]);
  const kind = computed(() => _props["kind"]);
  const seed = computed(() => _props["seed"]);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: sheetBindingRecipe,
    params: {
      edge: edge.value,
      kind: kind.value
    },
    kind: "binding" as const,
    seed: seed.value
  }));
  return () => {
    return <span data-slot="sheet-binding" aria-hidden="true" ref={hostRef} {...domProps(hostProps.value)} class={cn("pointer-events-none absolute isolate z-(--ll-z-ink) calm:hidden", edge.value === "left" && "inset-y-0 left-0 w-7", edge.value === "right" && "inset-y-0 right-0 w-7", edge.value === "top" && "inset-x-0 top-0 h-7", edge.value === "bottom" && "inset-x-0 bottom-0 h-7")}>
      {node.value}
    </span>;
  };
});
const SheetCloseMark = defineUi<{
  className?: string;
  seed?: string;
}>("SheetCloseMark", ["class", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: closeMarkRecipe,
    params: {},
    kind: "close" as const,
    size: [32, 32],
    seed: seed.value
  }));
  return () => {
    return <SheetPrimitive.Close data-slot="sheet-close" data-part="x" ref={hostRef} {...domProps(hostProps.value)} class={cn("absolute z-(--ll-z-raised) grid size-8 place-items-center text-ink", className.value)}>
      {node.value}
      <span aria-hidden="true" class="hidden font-hand text-xl leading-none forced-colors:block">
        ×
      </span>
      <span class="sr-only">Close</span>
    </SheetPrimitive.Close>;
  };
});
const SheetContent = defineUi<UI.ComponentProps<typeof SheetPrimitive.Content> & Pick<PaperProps, "stock" | "rules" | "seed"> & {
  side?: Side;
  showCloseButton?: boolean;
  binding?: Binding;
}>("SheetContent", ["class", "side", "showCloseButton", "binding", "stock", "rules", "seed", "onInteractOutside"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const side = computed(() => _props["side"] === undefined ? "right" as const : _props["side"]);
  const showCloseButton = computed(() => _props["showCloseButton"] === undefined ? true : _props["showCloseButton"]);
  const binding = computed(() => _props["binding"] === undefined ? "spiral" as const : _props["binding"]);
  const stock = computed(() => _props["stock"] === undefined ? "paper" as const : _props["stock"]);
  const rules = computed(() => _props["rules"]);
  const seedProp = computed(() => _props["seed"]);
  const onInteractOutside = computed(() => _props["onInteractOutside"]);
  const props = computed(() => omitProps(_props, ["class", "children", "side", "showCloseButton", "binding", "stock", "rules", "seed", "onInteractOutside"]));
  const scope = useInkScope();
  const seed = useInkSeed(() => seedProp.value);
  const edge = computed(() => INNER[side.value]);
  const bound = computed(() => binding.value === "spiral" || binding.value === "holes");
  const paperEdge = computed(() => binding.value === "perf" || binding.value === "torn" ? {
    [edge.value]: binding.value
  } : undefined);
  const xClass = computed(() => bound.value && edge.value === "right" ? "end-9 top-3" as const : bound.value && edge.value === "top" ? "end-3 top-9" as const : bound.value && edge.value === "left" ? "end-3 top-3 rtl:end-9" as const : "end-3 top-3" as const);
  return () => {
    return <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content asChild {...domProps(props.value)} onInteractOutside={e => {
        onInteractOutside.value?.(e);
        if ((e.target as Element | null)?.closest?.("[data-sonner-toaster]")) e.preventDefault();
      }}>
        <Paper data-slot="sheet-content" data-side={side.value} data-binding={binding.value} stock={stock.value} edge={paperEdge.value} tilt={false} rules={rules.value ?? "none"} seed={seed.value} {...domProps(scope.value)} class={cn("group/sheet fixed z-(--ll-z-overlay) flex flex-col gap-4 text-foreground outline-hidden", "data-[side=right]:[--ll-sheet-shadow:-7px_0_18px_-6px_rgb(var(--ll-shade)/calc(0.34*var(--ll-shadow-k))),-1px_0_1.5px_rgb(var(--ll-shade)/calc(0.24*var(--ll-shadow-k)))]", "data-[side=left]:[--ll-sheet-shadow:7px_0_18px_-6px_rgb(var(--ll-shade)/calc(0.34*var(--ll-shadow-k))),1px_0_1.5px_rgb(var(--ll-shade)/calc(0.24*var(--ll-shadow-k)))]", "data-[side=top]:[--ll-sheet-shadow:0_7px_18px_-6px_rgb(var(--ll-shade)/calc(0.34*var(--ll-shadow-k))),0_1px_1.5px_rgb(var(--ll-shade)/calc(0.24*var(--ll-shadow-k)))]", "data-[side=bottom]:[--ll-sheet-shadow:0_-7px_18px_-6px_rgb(var(--ll-shade)/calc(0.34*var(--ll-shadow-k))),0_-1px_1.5px_rgb(var(--ll-shade)/calc(0.24*var(--ll-shadow-k)))]", "duration-(--ll-dur-sheet) ease-out data-[state=closed]:animate-out data-[state=open]:animate-in", side.value === "right" && "inset-y-0 right-0 h-full w-3/4 pb-[env(safe-area-inset-bottom)] data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm", side.value === "left" && "inset-y-0 left-0 h-full w-3/4 pb-[env(safe-area-inset-bottom)] data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm", side.value === "top" && "inset-x-0 top-0 h-auto max-h-[85dvh] data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top", side.value === "bottom" && "inset-x-0 bottom-0 h-auto max-h-[85dvh] pb-[env(safe-area-inset-bottom)] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom", bound.value && edge.value === "left" && "pl-6", bound.value && edge.value === "right" && "pr-6", bound.value && edge.value === "top" && "pt-6", bound.value && edge.value === "bottom" && "pb-6", className.value)}>
          {bound.value && <SheetBinding edge={edge.value} kind={binding.value} seed={`${seed.value}|bind`} />}
          {readSlot(_slots.default)}
          {showCloseButton.value && <SheetCloseMark class={xClass.value} seed={`${seed.value}|x`} />}
        </Paper>
      </SheetPrimitive.Content>
    </SheetPortal>;
  };
});
const SheetHeader = defineUi<UI.ComponentProps<"div">>("SheetHeader", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="sheet-header" class={cn("flex flex-col gap-1.5 p-4 group-has-[[data-part=x]]/sheet:pe-12", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const SheetFooter = defineUi<UI.ComponentProps<"div">>("SheetFooter", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="sheet-footer" class={cn("mt-auto flex flex-col gap-2 p-4", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const SheetTitle = defineUi<UI.ComponentProps<typeof SheetPrimitive.Title>>("SheetTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <SheetPrimitive.Title data-slot="sheet-title" class={cn("font-script text-[1.7rem] leading-none font-semibold text-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</SheetPrimitive.Title>;
  };
});
const SheetDescription = defineUi<UI.ComponentProps<typeof SheetPrimitive.Description>>("SheetDescription", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <SheetPrimitive.Description data-slot="sheet-description" class={cn("text-sm text-muted-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</SheetPrimitive.Description>;
  };
});
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
