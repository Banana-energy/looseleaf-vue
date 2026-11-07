// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { InputControl } from "@/components/ui/input";
import { TextareaControl } from "@/components/ui/textarea";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { inputGroupRecipe, inputGroupRuleRecipe } from "@/lib/ink/recipes/input-group-ink";
import { cn } from "@/lib/utils";
const InputGroup = defineUi<UI.ComponentProps<"div"> & {
  seed?: string | number;
}>("InputGroup", ["class", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "seed", "ref", "children"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: inputGroupRecipe,
    params: {},
    kind: "field" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <div data-slot="input-group" role="group" ref={useMergedRef<HTMLDivElement>(hostRef, ref.value)} {...domProps(hostProps.value)} class={cn("group/input-group relative isolate flex w-full min-w-0 items-center font-hand text-base text-(--ll-input-ink) caret-(--ll-caret) calm:text-[15px]", "h-9 compact:h-8 calm:h-7 has-[>textarea]:h-auto", "has-[>[data-align=inline-start]]:[&>input]:ps-2", "has-[>[data-align=inline-end]]:[&>input]:pe-2", "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3", "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3", "has-[[data-slot=input-group-control]:focus-visible]:[&>svg>[data-layer=focus]]:visible has-[[data-slot=input-group-control]:focus-visible]:[&>svg>[data-layer=focus]]:opacity-100", "has-[[data-slot=input-group-control][aria-invalid=true]]:[&>svg>[data-layer=invalid]]:visible has-[[data-slot=input-group-control][aria-invalid=true]]:[&>svg>[data-layer=invalid]]:opacity-100", "has-[[data-slot=input-group-control][aria-invalid=true]]:[&>svg_[data-hide-on~=invalid]]:invisible has-[[data-slot=input-group-control][aria-invalid=true]]:[&>svg_[data-hide-on~=invalid]]:opacity-0", "has-[[data-slot=input-group-control]:disabled]:[&>svg>[data-layer=disabled]]:visible has-[[data-slot=input-group-control]:disabled]:[&>svg>[data-layer=disabled]]:opacity-100", "has-[[data-slot=input-group-control]:disabled]:[&>svg_[data-hide-on~=disabled]]:invisible has-[[data-slot=input-group-control]:disabled]:[&>svg_[data-hide-on~=disabled]]:opacity-0", "has-[[data-slot=input-group-control]:disabled]:[&>svg>[data-layer=hover]]:hidden data-[disabled=true]:[&>svg>[data-layer=hover]]:hidden", className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </div>;
  };
});
const inputGroupAddonVariants = cva("flex h-auto cursor-text items-center justify-center gap-2 py-1.5 font-hand text-[15px] font-bold text-muted-foreground select-none group-has-[[data-slot=input-group-control]:disabled]/input-group:text-pencil-text group-data-[disabled=true]/input-group:text-pencil-text [&>kbd]:font-mono [&>svg:not(.absolute):not([class*='size-'])]:size-4", {
  variants: {
    align: {
      "inline-start": "order-first ps-3 has-[>button]:-ms-[0.45rem] has-[>kbd]:-ms-[0.35rem]" as const,
      "inline-end": "order-last pe-3 has-[>button]:-me-[0.45rem] has-[>kbd]:-me-[0.35rem]" as const,
      "block-start": "order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-3" as const,
      "block-end": "order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-3" as const
    }
  },
  defaultVariants: {
    align: "inline-start" as const
  }
});
const hasClass = (className: string | undefined, name: string) => !!className && className.split(/\s+/).includes(name);
const InputGroupAddon = defineUi<UI.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>>("InputGroupAddon", ["class", "align", "onClick"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const align = computed(() => _props["align"] === undefined ? "inline-start" as const : _props["align"]);
  const onClick = computed(() => _props["onClick"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "align", "onClick", "ref", "children"]));
  const edge = computed(() => hasClass(className.value, "border-b") ? "bottom" as const : hasClass(className.value, "border-t") ? "top" as const : null);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: inputGroupRuleRecipe,
    params: {
      edge: edge.value ?? "bottom"
    },
    kind: "rule" as const,
    still: true
  }));
  const drawn = computed(() => edge.value !== null);
  return () => {
    return <div role="group" data-slot="input-group-addon" data-align={align.value} ref={useMergedRef<HTMLDivElement>(drawn.value ? hostRef : undefined, ref.value)} {...domProps(drawn.value && node.value ? hostProps.value : {})} class={cn(inputGroupAddonVariants({
      align: align.value
    }), drawn.value && "[.border-b]:border-transparent [.border-t]:border-transparent forced-colors:outline-0!", className.value)} onClick={(e: PointerEvent) => {
      onClick.value?.(e);
      if ((e.target as HTMLElement).closest("button, a[href], select, input, textarea, [role=button], [role=combobox], [role=checkbox], [role=switch]")) {
        return;
      }
      (e.currentTarget as HTMLElement).parentElement?.querySelector<HTMLElement>("input, textarea")?.focus();
    }} {...domProps(props.value)}>
      {drawn.value ? node.value : null}
      {readSlot(_slots.default)}
    </div>;
  };
});
const inputGroupButtonVariants = cva("flex items-center gap-2 font-hand text-sm shadow-none", {
  variants: {
    size: {
      xs: "h-6 gap-1 px-2 has-[>svg:not(.absolute)]:px-2 [&>svg:not(.absolute):not([class*='size-'])]:size-3.5" as const,
      sm: "h-8 gap-1.5 px-2.5 has-[>svg:not(.absolute)]:px-2.5" as const,
      "icon-xs": "size-6 p-0 has-[>svg:not(.absolute)]:p-0" as const,
      "icon-sm": "size-8 p-0 has-[>svg:not(.absolute)]:p-0" as const
    }
  },
  defaultVariants: {
    size: "xs" as const
  }
});
const InputGroupButton = defineUi<Omit<UI.ComponentProps<typeof Button>, "size"> & VariantProps<typeof inputGroupButtonVariants>>("InputGroupButton", ["class", "type", "variant", "size"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const type = computed(() => _props["type"] === undefined ? "button" as const : _props["type"]);
  const variant = computed(() => _props["variant"] === undefined ? "ghost" as const : _props["variant"]);
  const size = computed(() => _props["size"] === undefined ? "xs" as const : _props["size"]);
  const props = computed(() => omitProps(_props, ["class", "type", "variant", "size"]));
  return () => {
    return <Button type={type.value} data-size={size.value} variant={variant.value} size={size.value} class={cn(inputGroupButtonVariants({
      size: size.value
    }), className.value)} {...domProps(props.value)}>{_slots.default?.()}</Button>;
  };
});
const InputGroupText = defineUi<UI.ComponentProps<"span">>("InputGroupText", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <span data-slot="input-group-text" class={cn("flex items-center gap-2 font-hand text-[15px] text-muted-foreground [&_svg]:pointer-events-none [&_svg:not(.absolute):not([class*='size-'])]:size-4", className.value)} {...domProps(props.value)}>{_slots.default?.()}</span>;
  };
});
const InputGroupInput = defineUi<UI.ComponentProps<"input">>("InputGroupInput", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <InputControl data-slot="input-group-control" class={cn("flex-1 aria-invalid:pe-3", className.value)} {...domProps(props.value)}>{_slots.default?.()}</InputControl>;
  };
});
const InputGroupTextarea = defineUi<UI.ComponentProps<"textarea">>("InputGroupTextarea", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <TextareaControl data-slot="input-group-control" class={cn("flex-1 resize-none py-3 aria-invalid:pe-3", className.value)} {...domProps(props.value)}>{_slots.default?.()}</TextareaControl>;
  };
});
export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea };
