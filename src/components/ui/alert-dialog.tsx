// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { AlertDialog as AlertDialogPrimitive } from "@/lib/primitives";
import { Button } from "@/components/ui/button";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { Tape } from "@/components/ui/tape";
import { useInk, useInkScope, useInkSeed, useMergedRef } from "@/lib/ink/vue";
import { alertMediaRecipe, type AlertMediaTone } from "@/lib/ink/recipes/alert-dialog-ink";
import { cn } from "@/lib/utils";
const AlertDialog = defineUi<UI.ComponentProps<typeof AlertDialogPrimitive.Root>>("AlertDialog", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...domProps(props.value)}>{_slots.default?.()}</AlertDialogPrimitive.Root>;
  };
});
const AlertDialogTrigger = defineUi<UI.ComponentProps<typeof AlertDialogPrimitive.Trigger>>("AlertDialogTrigger", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...domProps(props.value)}>{_slots.default?.()}</AlertDialogPrimitive.Trigger>;
  };
});
const AlertDialogPortal = defineUi<UI.ComponentProps<typeof AlertDialogPrimitive.Portal>>("AlertDialogPortal", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...domProps(props.value)}>{_slots.default?.()}</AlertDialogPrimitive.Portal>;
  };
});
const AlertDialogOverlay = defineUi<UI.ComponentProps<typeof AlertDialogPrimitive.Overlay>>("AlertDialogOverlay", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const scope = useInkScope();
  return () => {
    return <AlertDialogPrimitive.Overlay data-slot="alert-dialog-overlay" {...domProps(scope.value)} class={cn("fixed inset-0 z-(--ll-z-overlay) flex overflow-y-auto overscroll-contain p-4 [background:var(--ll-overlay-dim)] [scrollbar-gutter:stable_both-edges] max-sm:p-0", "duration-(--ll-dur-sheet) data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0", className.value)} {...domProps(props.value)}>{_slots.default?.()}</AlertDialogPrimitive.Overlay>;
  };
});
const AlertDialogContent = defineUi<UI.ComponentProps<typeof AlertDialogPrimitive.Content> & Pick<PaperProps, "stock" | "edge" | "tilt" | "seed"> & {
  size?: "default" | "sm";
  tone?: "default" | "danger";
}>("AlertDialogContent", ["class", "size", "tone", "stock", "edge", "tilt", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const size = computed(() => _props["size"] === undefined ? "default" as const : _props["size"]);
  const tone = computed(() => _props["tone"] === undefined ? "default" as const : _props["tone"]);
  const children = renderValue(() => readSlot(_slots.default));
  const stock = computed(() => _props["stock"] === undefined ? "paper" as const : _props["stock"]);
  const edge = computed(() => _props["edge"]);
  const tilt = computed(() => _props["tilt"]);
  const seedProp = computed(() => _props["seed"]);
  const props = computed(() => omitProps(_props, ["class", "size", "tone", "children", "stock", "edge", "tilt", "seed"]));
  const scope = useInkScope();
  const seed = useInkSeed(() => seedProp.value);
  return () => {
    return <AlertDialogPortal>
      <AlertDialogOverlay>
        <AlertDialogPrimitive.Content asChild {...domProps(props.value)}>
          <Paper data-slot="alert-dialog-content" data-size={size.value} data-tone={tone.value} stock={stock.value} edge={edge.value} tilt={tilt.value} rules="none" seed={seed.value} {...domProps(scope.value)} class={cn("group/alert-dialog-content m-auto grid w-full max-w-lg gap-4 p-6 text-foreground outline-hidden compact:p-5 calm:p-4 data-[size=sm]:max-w-xs", "max-sm:mb-0 max-sm:max-w-none max-sm:pb-[max(1.5rem,env(safe-area-inset-bottom))] max-sm:compact:pb-[max(1.25rem,env(safe-area-inset-bottom))] max-sm:calm:pb-[max(1rem,env(safe-area-inset-bottom))] max-sm:[--ll-tilt:0deg]!", "data-[state=open]:animate-sheet-drop max-sm:data-[state=open]:animate-in max-sm:data-[state=open]:slide-in-from-bottom-16 max-sm:data-[state=open]:fade-in-0", "duration-(--ll-dur-fade) data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 max-sm:data-[state=closed]:slide-out-to-bottom-8", className.value)}>
            {tone.value === "danger" && <>
                <Tape kind="washi-stripes" color="tomato" length={68} height={20} angle={-38} seed={`${seed.value}:hz-a`} class="absolute -top-2 -left-7 z-(--ll-z-prop) max-sm:hidden calm:hidden" />
                <Tape kind="washi-stripes" color="tomato" length={68} height={20} angle={36} seed={`${seed.value}:hz-b`} class="absolute -top-2 -right-7 z-(--ll-z-prop) max-sm:hidden calm:hidden" />
              </>}
            {readSlot(_slots.default)}
          </Paper>
        </AlertDialogPrimitive.Content>
      </AlertDialogOverlay>
    </AlertDialogPortal>;
  };
});
const AlertDialogHeader = defineUi<UI.ComponentProps<"div">>("AlertDialogHeader", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="alert-dialog-header" class={cn("grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-start sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const AlertDialogFooter = defineUi<UI.ComponentProps<"div">>("AlertDialogFooter", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="alert-dialog-footer" class={cn("flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const AlertDialogTitle = defineUi<UI.ComponentProps<typeof AlertDialogPrimitive.Title>>("AlertDialogTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <AlertDialogPrimitive.Title data-slot="alert-dialog-title" class={cn("font-script text-[1.7rem] leading-none font-semibold sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2", className.value)} {...domProps(props.value)}>{_slots.default?.()}</AlertDialogPrimitive.Title>;
  };
});
const AlertDialogDescription = defineUi<UI.ComponentProps<typeof AlertDialogPrimitive.Description>>("AlertDialogDescription", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <AlertDialogPrimitive.Description data-slot="alert-dialog-description" class={cn("text-sm text-muted-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</AlertDialogPrimitive.Description>;
  };
});
const AlertDialogMedia = defineUi<UI.ComponentProps<"div"> & {
  tone?: AlertMediaTone;
  seed?: string | number;
}>("AlertDialogMedia", ["class", "tone", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const tone = computed(() => _props["tone"] === undefined ? "default" as const : _props["tone"]);
  const seedProp = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "tone", "seed", "children", "ref"]));
  const seed = useInkSeed(() => seedProp.value);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: alertMediaRecipe,
    params: {
      tone: tone.value
    },
    kind: "plate" as const,
    size: [64, 64],
    seed: seed.value
  }));
  return () => {
    return <div data-slot="alert-dialog-media" ref={useMergedRef<HTMLElement>(hostRef, ref.value as UI.Ref<HTMLElement> | undefined)} {...domProps(hostProps.value)} class={cn("relative isolate mb-2 inline-flex size-16 items-center justify-center sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not(.absolute):not([class*='size-'])]:size-8", className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </div>;
  };
});
const AlertDialogAction = defineUi<UI.ComponentProps<typeof AlertDialogPrimitive.Action> & Pick<UI.ComponentProps<typeof Button>, "variant" | "size">>("AlertDialogAction", ["class", "variant", "size"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"] === undefined ? "default" as const : _props["variant"]);
  const size = computed(() => _props["size"] === undefined ? "default" as const : _props["size"]);
  const props = computed(() => omitProps(_props, ["class", "variant", "size"]));
  return () => {
    return <Button variant={variant.value} size={size.value} asChild>
      <AlertDialogPrimitive.Action data-slot="alert-dialog-action" class={cn(className.value)} {...domProps(props.value)}>{_slots.default?.()}</AlertDialogPrimitive.Action>
    </Button>;
  };
});
const AlertDialogCancel = defineUi<UI.ComponentProps<typeof AlertDialogPrimitive.Cancel> & Pick<UI.ComponentProps<typeof Button>, "variant" | "size">>("AlertDialogCancel", ["class", "variant", "size"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"] === undefined ? "outline" as const : _props["variant"]);
  const size = computed(() => _props["size"] === undefined ? "default" as const : _props["size"]);
  const props = computed(() => omitProps(_props, ["class", "variant", "size"]));
  return () => {
    return <Button variant={variant.value} size={size.value} asChild>
      <AlertDialogPrimitive.Cancel data-slot="alert-dialog-cancel" class={cn(className.value)} {...domProps(props.value)}>{_slots.default?.()}</AlertDialogPrimitive.Cancel>
    </Button>;
  };
});
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger };
