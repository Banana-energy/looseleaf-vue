// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, shallowRef } from "vue";
import { Popover as PopoverPrimitive } from "@/lib/primitives";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { PropSvg } from "@/lib/ink/paper/prop-svg";
import type { Accent } from "@/lib/ink/paper/props";
import { useDensity, useInkScope, useInkSeed, useInkTier } from "@/lib/ink/vue";
import { pointerMark } from "@/lib/ink/recipes/overlay-ink";
import { cn } from "@/lib/utils";
const Popover = defineUi<UI.ComponentProps<typeof PopoverPrimitive.Root>>("Popover", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <PopoverPrimitive.Root data-slot="popover" {...domProps(props.value)}>{_slots.default?.()}</PopoverPrimitive.Root>;
  };
});
const PopoverTrigger = defineUi<UI.ComponentProps<typeof PopoverPrimitive.Trigger>>("PopoverTrigger", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...domProps(props.value)}>{_slots.default?.()}</PopoverPrimitive.Trigger>;
  };
});
const PopoverAnchor = defineUi<UI.ComponentProps<typeof PopoverPrimitive.Anchor>>("PopoverAnchor", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...domProps(props.value)}>{_slots.default?.()}</PopoverPrimitive.Anchor>;
  };
});
const PopoverPointer = defineUi<{
  seed: string;
}>("PopoverPointer", ["seed"], (_props, {
  slots: _slots
}) => {
  const seed = computed(() => _props["seed"]);
  const tier = useInkTier();
  const _nestedHook0 = useDensity();
  const calm = computed(() => _nestedHook0.value === "calm");
  const res = computed(() => pointerMark(`${seed.value}|pointer`, {
    tier: tier.value,
    calm: calm.value
  }));
  return () => {
    return <PopoverPrimitive.Arrow asChild>
      <PropSvg res={res.value} kind="prop" data-slot="popover-arrow" width={res.value.w} height={res.value.h} viewBox={`0 0 ${res.value.w} ${res.value.h}`} preserveAspectRatio="xMidYMid meet" class="pointer-events-none" />
    </PopoverPrimitive.Arrow>;
  };
});
function useOpenerFocus(_source0: MaybeRefOrGetter<Pick<UI.ComponentProps<typeof PopoverPrimitive.Content>, "onOpenAutoFocus" | "onCloseAutoFocus" | "onInteractOutside">>) {
  const onOpenAutoFocus = computed(() => toValue(_source0).onOpenAutoFocus);
  const onCloseAutoFocus = computed(() => toValue(_source0).onCloseAutoFocus);
  const onInteractOutside = computed(() => toValue(_source0).onInteractOutside);
  const opener = shallowRef<Element | null | null>(null);
  const outside = shallowRef(false);
  return computed(() => {
    return {
      onOpenAutoFocus(event: Event) {
        outside.value = false;
        const id = event.target instanceof HTMLElement ? event.target.id : "" as const;
        const hasTrigger = !!id && Array.from(document.querySelectorAll("[aria-controls]")).some(el => el.getAttribute("aria-controls") === id);
        opener.value = hasTrigger ? null : document.activeElement;
        onOpenAutoFocus.value?.(event);
      },
      onInteractOutside(event: Parameters<NonNullable<typeof onInteractOutside["value"]>>[0]) {
        outside.value = true;
        onInteractOutside.value?.(event);
      },
      onCloseAutoFocus(event: Event) {
        onCloseAutoFocus.value?.(event);
        const el = opener.value;
        opener.value = null;
        if (event.defaultPrevented || !el || outside.value) return;
        const active = document.activeElement;
        if (active && active !== document.body && active !== el) return;
        if (el instanceof HTMLElement && el !== document.body && el.isConnected) el.focus({
          preventScroll: true
        });
      }
    };
  });
}
const PopoverContent = defineUi<UI.ComponentProps<typeof PopoverPrimitive.Content> & Pick<PaperProps, "stock" | "edge" | "tilt" | "tape" | "seed"> & {
  pin?: boolean | Accent;
  arrow?: boolean;
  "data-slot"?: string;
}>("PopoverContent", ["class", "align", "sideOffset", "collisionPadding", "stock", "edge", "tilt", "pin", "tape", "arrow", "seed", "data-slot", "onOpenAutoFocus", "onCloseAutoFocus", "onInteractOutside"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const align = computed(() => _props["align"] === undefined ? "center" as const : _props["align"]);
  const sideOffset = computed(() => _props["sideOffset"] === undefined ? 8 : _props["sideOffset"]);
  const collisionPadding = computed(() => _props["collisionPadding"] === undefined ? 8 : _props["collisionPadding"]);
  const stock = computed(() => _props["stock"] === undefined ? "slip" as const : _props["stock"]);
  const edge = computed(() => _props["edge"]);
  const tilt = computed(() => _props["tilt"] === undefined ? true : _props["tilt"]);
  const pin = computed(() => _props["pin"] === undefined ? false : _props["pin"]);
  const tape = computed(() => _props["tape"] === undefined ? false : _props["tape"]);
  const arrow = computed(() => _props["arrow"] === undefined ? false : _props["arrow"]);
  const seedProp = computed(() => _props["seed"]);
  const slot = computed(() => _props["data-slot"] === undefined ? "popover-content" as const : _props["data-slot"]);
  const children = renderValue(() => readSlot(_slots.default));
  const onOpenAutoFocus = computed(() => _props["onOpenAutoFocus"]);
  const onCloseAutoFocus = computed(() => _props["onCloseAutoFocus"]);
  const onInteractOutside = computed(() => _props["onInteractOutside"]);
  const props = computed(() => omitProps(_props, ["class", "align", "sideOffset", "collisionPadding", "stock", "edge", "tilt", "pin", "tape", "arrow", "seed", "data-slot", "children", "onOpenAutoFocus", "onCloseAutoFocus", "onInteractOutside"]));
  const scope = useInkScope();
  const seed = useInkSeed(() => seedProp.value);
  const focus = useOpenerFocus(() => ({
    onOpenAutoFocus: onOpenAutoFocus.value,
    onCloseAutoFocus: onCloseAutoFocus.value,
    onInteractOutside: onInteractOutside.value
  }));
  return () => {
    return <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content asChild align={align.value} sideOffset={sideOffset.value} collisionPadding={collisionPadding.value} {...domProps(props.value)} {...domProps(focus.value)}>
        <Paper data-slot={slot.value} stock={stock.value} edge={edge.value} tilt={tilt.value} tape={tape.value} fastener={pin.value ? "pin" as const : false} fastenerTone={typeof pin.value === "string" ? pin.value : undefined} rules="none" seed={seed.value} {...domProps(scope.value)} class={cn("z-(--ll-z-popover) w-72 max-w-[calc(100vw-1rem)] origin-(--reka-popover-content-transform-origin) p-4 text-popover-foreground outline-hidden compact:p-3.5 calm:p-3", "data-[side]:[--ll-sheet-shadow:var(--ll-shadow-lift)] data-[side]:calm:[--ll-sheet-shadow:var(--ll-shadow-hair)]", "duration-(--ll-dur-pop) data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", className.value)}>
          {readSlot(_slots.default)}
          {arrow.value && <PopoverPointer seed={seed.value} />}
        </Paper>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>;
  };
});
const PopoverHeader = defineUi<UI.ComponentProps<"div">>("PopoverHeader", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="popover-header" class={cn("flex flex-col gap-1 text-sm", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const PopoverTitle = defineUi<UI.ComponentProps<"h2">>("PopoverTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="popover-title" class={cn("font-script text-[1.4rem] leading-none font-semibold", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const PopoverDescription = defineUi<UI.ComponentProps<"p">>("PopoverDescription", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <p data-slot="popover-description" class={cn("text-muted-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</p>;
  };
});
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverHeader, PopoverTitle, PopoverDescription };
