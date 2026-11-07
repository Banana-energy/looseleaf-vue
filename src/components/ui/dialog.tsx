// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Dialog as DialogPrimitive } from "@/lib/primitives";
import { Button } from "@/components/ui/button";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { useInk, useInkScope } from "@/lib/ink/vue";
import { closeMarkRecipe } from "@/lib/ink/recipes/overlay-ink";
import { cn } from "@/lib/utils";
const ModalContext = createContext(true);
const Dialog = defineUi<UI.ComponentProps<typeof DialogPrimitive.Root>>("Dialog", ["modal"], (_props, {
  slots: _slots
}) => {
  const modal = computed(() => _props["modal"] === undefined ? true : _props["modal"]);
  const props = computed(() => omitProps(_props, ["modal"]));
  return () => {
    return <ModalContext.Provider value={modal.value}>
      <DialogPrimitive.Root data-slot="dialog" modal={modal.value} {...domProps(props.value)}>{_slots.default?.()}</DialogPrimitive.Root>
    </ModalContext.Provider>;
  };
});
const DialogTrigger = defineUi<UI.ComponentProps<typeof DialogPrimitive.Trigger>>("DialogTrigger", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...domProps(props.value)}>{_slots.default?.()}</DialogPrimitive.Trigger>;
  };
});
const DialogPortal = defineUi<UI.ComponentProps<typeof DialogPrimitive.Portal>>("DialogPortal", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    // Portal 只负责 Teleport，不生成可承载 data-slot 的 DOM 节点，避免 Vue 将属性错误透传到 Teleport。
    return <DialogPrimitive.Portal {...domProps(props.value)}>{_slots.default?.()}</DialogPrimitive.Portal>;
  };
});
const DialogClose = defineUi<UI.ComponentProps<typeof DialogPrimitive.Close>>("DialogClose", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <DialogPrimitive.Close data-slot="dialog-close" {...domProps(props.value)}>{_slots.default?.()}</DialogPrimitive.Close>;
  };
});
const DialogOverlay = defineUi<UI.ComponentProps<typeof DialogPrimitive.Overlay>>("DialogOverlay", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const scope = useInkScope();
  return () => {
    return <DialogPrimitive.Overlay data-slot="dialog-overlay" {...domProps(scope.value)} class={cn("fixed inset-0 z-(--ll-z-overlay) flex overflow-y-auto overscroll-contain p-4 [background:var(--ll-overlay-dim)] [scrollbar-gutter:stable_both-edges] max-sm:p-0", "duration-(--ll-dur-sheet) data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0", className.value)} {...domProps(props.value)}>{_slots.default?.()}</DialogPrimitive.Overlay>;
  };
});
const DialogFrame = defineUi<{
  children: UI.ReactNode;
}>("DialogFrame", [], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const scope = useInkScope();
  return () => {
    return <div data-slot="dialog-frame" {...domProps(scope.value)} class="pointer-events-none fixed inset-0 z-(--ll-z-overlay) flex overflow-y-auto overscroll-contain p-4 [scrollbar-gutter:stable_both-edges] *:pointer-events-auto max-sm:p-0">
      {readSlot(_slots.default)}
    </div>;
  };
});
const DialogCloseMark = defineUi<{
  className?: string;
  seed?: string | number;
}>("DialogCloseMark", ["class", "seed"], (_props, {
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
    return <DialogPrimitive.Close data-slot="dialog-close" data-part="x" ref={hostRef} {...domProps(hostProps.value)} class={cn("absolute end-3 top-3 z-(--ll-z-raised) grid size-8 place-items-center text-ink", className.value)}>
      {node.value}
      <span aria-hidden="true" class="hidden font-hand text-xl leading-none forced-colors:block">
        ×
      </span>
      <span class="sr-only">Close</span>
    </DialogPrimitive.Close>;
  };
});
type DialogPaperProps = Pick<PaperProps, "stock" | "edge" | "tilt" | "tape" | "tapeKind" | "fastener" | "fastenerTone" | "rules" | "shadow" | "seed">;
const DialogContent = defineUi<UI.ComponentProps<typeof DialogPrimitive.Content> & DialogPaperProps & {
  showCloseButton?: boolean;
}>("DialogContent", ["class", "showCloseButton", "stock", "edge", "tilt", "tape", "tapeKind", "fastener", "fastenerTone", "rules", "shadow", "seed", "onInteractOutside"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const showCloseButton = computed(() => _props["showCloseButton"] === undefined ? true : _props["showCloseButton"]);
  const stock = computed(() => _props["stock"] === undefined ? "paper" as const : _props["stock"]);
  const edge = computed(() => _props["edge"]);
  const tilt = computed(() => _props["tilt"]);
  const tape = computed(() => _props["tape"] === undefined ? false : _props["tape"]);
  const tapeKind = computed(() => _props["tapeKind"]);
  const fastener = computed(() => _props["fastener"] === undefined ? false : _props["fastener"]);
  const fastenerTone = computed(() => _props["fastenerTone"]);
  const rules = computed(() => _props["rules"]);
  const shadow = computed(() => _props["shadow"]);
  const seed = computed(() => _props["seed"]);
  const onInteractOutside = computed(() => _props["onInteractOutside"]);
  const props = computed(() => omitProps(_props, ["class", "children", "showCloseButton", "stock", "edge", "tilt", "tape", "tapeKind", "fastener", "fastenerTone", "rules", "shadow", "seed", "onInteractOutside"]));
  const scope = useInkScope();
  const _nestedHook0 = useContext(ModalContext);
  const Frame = computed(() => jsxTag(_nestedHook0.value ? DialogOverlay : DialogFrame));
  return () => {
    return <DialogPortal>
      <Frame.value>
        <DialogPrimitive.Content asChild {...domProps(props.value)} onInteractOutside={e => {
          onInteractOutside.value?.(e);
          if ((e.target as Element | null)?.closest?.("[data-sonner-toaster]")) e.preventDefault();
        }}>
          <Paper data-slot="dialog-content" stock={stock.value} edge={edge.value} tilt={tilt.value} tape={tape.value} tapeKind={tapeKind.value} fastener={fastener.value} fastenerTone={fastenerTone.value} rules={rules.value ?? "none"} shadow={shadow.value} seed={seed.value} {...domProps(scope.value)} class={cn("group/dialog m-auto grid w-full max-w-lg gap-4 p-6 text-foreground outline-hidden compact:p-5 calm:p-4", "max-sm:[&>svg[data-slot=tape]]:hidden", "max-sm:mb-0 max-sm:max-w-none max-sm:pb-[max(1.5rem,env(safe-area-inset-bottom))] max-sm:compact:pb-[max(1.25rem,env(safe-area-inset-bottom))] max-sm:calm:pb-[max(1rem,env(safe-area-inset-bottom))] max-sm:[--ll-tilt:0deg]!", "data-[state=open]:animate-sheet-drop max-sm:data-[state=open]:animate-in max-sm:data-[state=open]:slide-in-from-bottom-16 max-sm:data-[state=open]:fade-in-0", "duration-(--ll-dur-fade) data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 max-sm:data-[state=closed]:slide-out-to-bottom-8", className.value)}>
            {readSlot(_slots.default)}
            {showCloseButton.value && <DialogCloseMark seed={seed.value === undefined ? undefined : `${seed.value}|x`} />}
          </Paper>
        </DialogPrimitive.Content>
      </Frame.value>
    </DialogPortal>;
  };
});
const DialogHeader = defineUi<UI.ComponentProps<"div">>("DialogHeader", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="dialog-header" class={cn("flex flex-col gap-2 text-center group-has-[[data-part=x]]/dialog:sm:pe-8 sm:text-start", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const DialogBody = defineUi<UI.ComponentProps<"div">>("DialogBody", ["class", "tabIndex"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const tabIndex = computed(() => _props["tabIndex"] === undefined ? 0 : _props["tabIndex"]);
  const props = computed(() => omitProps(_props, ["class", "tabIndex"]));
  return () => {
    return <div data-slot="dialog-body" tabindex={tabIndex.value} class={cn("-mx-2 max-h-[min(60dvh,32rem)] min-h-0 overflow-y-auto px-2 py-1 text-[15px] outline-hidden focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const DialogFooter = defineUi<UI.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}>("DialogFooter", ["class", "showCloseButton"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const showCloseButton = computed(() => _props["showCloseButton"] === undefined ? false : _props["showCloseButton"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "showCloseButton", "children"]));
  return () => {
    return <div data-slot="dialog-footer" class={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default)}
      {showCloseButton.value && <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>}
    </div>;
  };
});
const DialogTitle = defineUi<UI.ComponentProps<typeof DialogPrimitive.Title>>("DialogTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <DialogPrimitive.Title data-slot="dialog-title" class={cn("font-script text-[1.7rem] leading-none font-semibold", className.value)} {...domProps(props.value)}>{_slots.default?.()}</DialogPrimitive.Title>;
  };
});
const DialogDescription = defineUi<UI.ComponentProps<typeof DialogPrimitive.Description>>("DialogDescription", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <DialogPrimitive.Description data-slot="dialog-description" class={cn("text-sm text-muted-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</DialogPrimitive.Description>;
  };
});
export { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger };
