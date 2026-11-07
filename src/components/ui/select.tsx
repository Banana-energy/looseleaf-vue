// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Select as SelectPrimitive } from "@/lib/primitives";
import { Icon } from "@/components/ui/icon";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { Separator } from "@/components/ui/separator";
import { useInk, useInkScope, useMergedRef } from "@/lib/ink/vue";
import { selectRecipe } from "@/lib/ink/recipes/select-ink";
import { cn } from "@/lib/utils";
const SelectDisabledContext = createContext(false);
const Select = defineUi<UI.ComponentProps<typeof SelectPrimitive.Root>>("Select", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <SelectDisabledContext.Provider value={!!props.value.disabled}>
      <SelectPrimitive.Root data-slot="select" {...domProps(props.value)}>{_slots.default?.()}</SelectPrimitive.Root>
    </SelectDisabledContext.Provider>;
  };
});
const SelectGroup = defineUi<UI.ComponentProps<typeof SelectPrimitive.Group>>("SelectGroup", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <SelectPrimitive.Group data-slot="select-group" class={cn("scroll-my-1", className.value)} {...domProps(props.value)}>{_slots.default?.()}</SelectPrimitive.Group>;
  };
});
const SelectValue = defineUi<UI.ComponentProps<typeof SelectPrimitive.Value>>("SelectValue", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <SelectPrimitive.Value data-slot="select-value" {...domProps(props.value)}>{_slots.default?.()}</SelectPrimitive.Value>;
  };
});
const SelectTrigger = defineUi<UI.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
  seed?: string | number;
}>("SelectTrigger", ["class", "size", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const size = computed(() => _props["size"] === undefined ? "default" as const : _props["size"]);
  const seed = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "size", "seed", "children", "ref"]));
  const invalid = computed(() => props.value["aria-invalid"] === true || props.value["aria-invalid"] === "true");
  const _nestedHook0 = useContext(SelectDisabledContext);
  const disabled = computed(() => _nestedHook0.value || !!props.value.disabled);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: selectRecipe,
    params: {
      disabled: disabled.value,
      invalid: invalid.value
    },
    kind: "field" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <SelectPrimitive.Trigger data-slot="select-trigger" data-size={size.value} ref={useMergedRef<HTMLButtonElement>(hostRef, ref.value)} {...domProps(hostProps.value)} class={cn("group/select-trigger relative isolate flex h-9 w-fit items-center justify-between gap-2 ps-3 text-start font-hand text-base whitespace-nowrap text-(--ll-input-ink) compact:h-8 calm:h-7 calm:text-[15px] data-[size=sm]:h-8 data-[size=sm]:text-[15px] compact:data-[size=sm]:h-7 disabled:cursor-not-allowed disabled:text-pencil-text data-[placeholder]:text-(--ll-placeholder) forced-colors:aria-invalid:underline forced-colors:aria-invalid:decoration-wavy", "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:min-w-0 *:data-[slot=select-value]:flex-1 *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not(.absolute):not([class*='size-'])]:size-4", className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
      <SelectPrimitive.Icon data-slot="select-icon" class="grid h-full w-8 shrink-0 place-items-center text-ink-soft transition-transform duration-(--ll-dur-pop) ease-pop group-data-[state=open]/select-trigger:rotate-180 group-disabled/select-trigger:text-pencil-text">
        <Icon name="chevron-down" size={16} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>;
  };
});
const SelectContent = defineUi<UI.ComponentProps<typeof SelectPrimitive.Content> & Pick<PaperProps, "stock" | "edge" | "tilt" | "tape" | "seed">>("SelectContent", ["class", "position", "align", "stock", "edge", "tilt", "tape", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const position = computed(() => _props["position"] === undefined ? "item-aligned" as const : _props["position"]);
  const align = computed(() => _props["align"] === undefined ? "center" as const : _props["align"]);
  const stock = computed(() => _props["stock"] === undefined ? "slip" as const : _props["stock"]);
  const edge = computed(() => _props["edge"]);
  const tilt = computed(() => _props["tilt"] === undefined ? true : _props["tilt"]);
  const tape = computed(() => _props["tape"]);
  const seed = computed(() => _props["seed"]);
  const props = computed(() => omitProps(_props, ["class", "children", "position", "align", "stock", "edge", "tilt", "tape", "seed"]));
  const scope = useInkScope();
  return () => {
    return <SelectPrimitive.Portal>
      <SelectPrimitive.Content asChild position={position.value} align={align.value} {...domProps(props.value)}>
        <Paper data-slot="select-content" stock={stock.value} edge={edge.value} tilt={tilt.value} tape={tape.value} rules="none" seed={seed.value} {...domProps(scope.value)} class={cn("z-(--ll-z-popover) max-h-(--reka-select-content-available-height) min-w-32 origin-(--reka-select-content-transform-origin) text-popover-foreground outline-hidden", "duration-(--ll-dur-pop) data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", position.value === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className.value)}>
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport class={cn("p-1 compact:p-0.5 calm:p-0.5", position.value === "popper" && "h-(--reka-select-trigger-height) w-full min-w-(--reka-select-trigger-width) scroll-my-1")}>
            {readSlot(_slots.default)}
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
        </Paper>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>;
  };
});
const SelectLabel = defineUi<UI.ComponentProps<typeof SelectPrimitive.Label>>("SelectLabel", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <SelectPrimitive.Label data-slot="select-label" class={cn("px-2 py-1.5 font-type text-sm tracking-wide text-ink-muted", className.value)} {...domProps(props.value)}>{_slots.default?.()}</SelectPrimitive.Label>;
  };
});
const SelectItem = defineUi<UI.ComponentProps<typeof SelectPrimitive.Item>>("SelectItem", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  return () => {
    return <SelectPrimitive.Item data-slot="select-item" class={cn("relative flex min-h-8 w-full cursor-default items-center gap-2 py-1.5 ps-2 pe-8 font-hand text-base outline-hidden select-none compact:min-h-7 compact:py-1 calm:min-h-7 calm:py-1 calm:text-[15px]", "data-[highlighted]:ll-swipe data-[state=checked]:font-bold data-[disabled]:pointer-events-none data-[disabled]:text-pencil-text", "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not(.absolute):not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className.value)} {...domProps(props.value)}>
      <span data-slot="select-item-indicator" class="absolute end-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator class="flex animate-[ll-wipe_var(--ll-dur-sheet)_var(--ll-ease-out)_both]">
          <Icon name="check" size={16} class="text-ink-you forced-colors:text-[CanvasText]" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{readSlot(_slots.default)}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>;
  };
});
const SelectSeparator = defineUi<UI.ComponentProps<typeof SelectPrimitive.Separator>>("SelectSeparator", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <SelectPrimitive.Separator asChild {...domProps(props.value)}>
      <Separator data-slot="select-separator" class={cn("pointer-events-none -mx-1 my-1.5 w-auto", className.value)} />
    </SelectPrimitive.Separator>;
  };
});
const SelectScrollUpButton = defineUi<UI.ComponentProps<typeof SelectPrimitive.ScrollUpButton>>("SelectScrollUpButton", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <SelectPrimitive.ScrollUpButton data-slot="select-scroll-up-button" class={cn("flex cursor-default items-center justify-center py-1 text-ink-soft", className.value)} {...domProps(props.value)}>
      <Icon name="chevron-up" size={16} />
    </SelectPrimitive.ScrollUpButton>;
  };
});
const SelectScrollDownButton = defineUi<UI.ComponentProps<typeof SelectPrimitive.ScrollDownButton>>("SelectScrollDownButton", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <SelectPrimitive.ScrollDownButton data-slot="select-scroll-down-button" class={cn("flex cursor-default items-center justify-center py-1 text-ink-soft", className.value)} {...domProps(props.value)}>
      <Icon name="chevron-down" size={16} />
    </SelectPrimitive.ScrollDownButton>;
  };
});
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue };
