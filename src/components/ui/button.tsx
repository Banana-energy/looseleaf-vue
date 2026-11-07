// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@/lib/primitives";
import { IconSizeProvider, useInk, useMergedRef } from "@/lib/ink/vue";
import { buttonRecipe } from "@/lib/ink/recipes/button-ink";
import { cn } from "@/lib/utils";
const swipe = "hover:[&>svg_[data-part=swipe]]:animate-[ll-wipe_var(--ll-dur-sheet)_var(--ll-ease-out)_both]";
const buttonVariants = cva("relative isolate inline-flex shrink-0 items-center justify-center gap-2 font-hand font-bold whitespace-nowrap transition-[translate] duration-(--ll-dur-press) ease-out active:translate-y-(--ll-press-sink) [&[data-pressed]:not([data-pressed=false])]:translate-y-(--ll-press-sink) disabled:pointer-events-none disabled:text-pencil-text aria-disabled:pointer-events-none aria-disabled:text-pencil-text [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not(.absolute):not([class*='size-'])]:size-4", {
  variants: {
    variant: {
      default: "text-primary-foreground" as const,
      destructive: "text-paper" as const,
      outline: "text-ink" as const,
      secondary: "text-secondary-foreground" as const,
      ghost: `text-foreground ${swipe}`,
      link: `text-link hover:text-link-hover ${swipe}`
    },
    size: {
      default: "h-9 px-4 py-2 text-base has-[>svg:not(.absolute)]:px-3 compact:h-8 calm:h-7" as const,
      xs: "h-6 gap-1 px-2 text-sm has-[>svg:not(.absolute)]:px-1.5 [&_svg:not(.absolute):not([class*='size-'])]:size-3" as const,
      sm: "h-8 gap-1.5 px-3 text-[15px] has-[>svg:not(.absolute)]:px-2.5 compact:h-7 calm:h-7" as const,
      lg: "h-10 px-6 text-[17px] has-[>svg:not(.absolute)]:px-4 compact:h-9 calm:h-8" as const,
      icon: "size-9 compact:size-8 calm:size-7" as const,
      "icon-xs": "size-6 [&_svg:not(.absolute):not([class*='size-'])]:size-3" as const,
      "icon-sm": "size-8 compact:size-7 calm:size-7" as const,
      "icon-lg": "size-10 compact:size-9 calm:size-8" as const
    }
  },
  defaultVariants: {
    variant: "default" as const,
    size: "default" as const
  }
});
const Button = defineUi<UI.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
  seed?: string | number;
}>("Button", ["class", "variant", "size", "asChild", "disabled", "seed", "onClick"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"]);
  const size = computed(() => _props["size"]);
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const disabled = computed(() => _props["disabled"]);
  const seed = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const onClick = computed(() => _props["onClick"]);
  const props = computed(() => omitProps(_props, ["class", "variant", "size", "asChild", "disabled", "seed", "children", "ref", "onClick"]));
  const v = computed(() => variant.value ?? "default");
  const s = computed(() => size.value ?? "default");
  const pill = computed(() => !!className.value && className.value.split(/\s+/).includes("rounded-full"));
  const forced = computed(() => "data-focus-visible" in props.value || "data-pressed" in props.value);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: buttonRecipe,
    params: {
      variant: v.value,
      size: s.value,
      disabled: !!disabled.value,
      shape: pill.value ? "pill" as const : "default" as const
    },
    kind: "button" as const,
    seed: seed.value,
    layers: forced.value ? "all" as const : undefined
  }));
  const mergedRef = computed(() => useMergedRef<HTMLElement>(hostRef, ref.value as UI.Ref<HTMLElement> | undefined));
  const iconPx = computed(() => s.value === "xs" || s.value === "icon-xs" ? 12 : undefined);
  const shared = computed(() => ({
    "data-variant": v.value,
    "data-size": s.value,
    "data-shape": pill.value ? "pill" as const : undefined,
    "data-ink-sink": "self" as const,
    class: cn(buttonVariants({
      variant: v.value,
      size: s.value,
      className: className.value
    })),
    ref: mergedRef.value,
    ...hostProps.value,
    ...props.value
  }));
  return () => {
    if (asChild.value) {
      const inert = disabled.value ? {
        "aria-disabled": true as const,
        "data-disabled": "" as const,
        tabIndex: -1,
        onClick: (e: MouseEvent) => e.preventDefault()
      } : {
        onClick: onClick.value as UI.MouseEventHandler<HTMLElement> | undefined
      };
      return <IconSizeProvider value={iconPx.value}>
        <Slot.Root data-slot="button" {...domProps(shared.value)} {...domProps(inert)}>
          <Slot.Slottable>{readSlot(_slots.default)}</Slot.Slottable>
          {node.value}
        </Slot.Root>
      </IconSizeProvider>;
    }
    return <IconSizeProvider value={iconPx.value}>
      <button data-slot="button" {...domProps(shared.value)} disabled={disabled.value} onClick={onClick.value}>
        {node.value}
        {readSlot(_slots.default)}
      </button>
    </IconSizeProvider>;
  };
});
export { Button, buttonVariants };
