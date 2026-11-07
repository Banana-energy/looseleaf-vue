// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@/lib/primitives";
import { Separator } from "@/components/ui/separator";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { buttonGroupTextRecipe } from "@/lib/ink/recipes/button-group-ink";
import { cn } from "@/lib/utils";
const buttonGroupVariants = cva("flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 [&>[data-slot=input-frame]]:flex-1 [&>*:has(+[data-slot=button-group-separator])]:[--cl-e:15px] [&>*:not([data-slot=button-group-separator]):not(:first-child)]:[--cl-s:15px]", {
  variants: {
    orientation: {
      horizontal: "[&>*:not([data-slot=button-group-separator]):not(:focus-visible):not(:has(:focus-visible))>svg.absolute]:[clip-path:inset(-14px_var(--cl-e,-14px)_-14px_var(--cl-s,-14px))] rtl:[&>*:not([data-slot=button-group-separator]):not(:focus-visible):not(:has(:focus-visible))>svg.absolute]:[clip-path:inset(-14px_var(--cl-s,-14px)_-14px_var(--cl-e,-14px))]" as const,
      vertical: "flex-col [&>*:not([data-slot=button-group-separator]):not(:focus-visible):not(:has(:focus-visible))>svg.absolute]:[clip-path:inset(var(--cl-s,-14px)_-14px_var(--cl-e,-14px)_-14px)]" as const
    }
  },
  defaultVariants: {
    orientation: "horizontal" as const
  }
});
const ButtonGroup = defineUi<UI.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>>("ButtonGroup", ["class", "orientation"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const orientation = computed(() => _props["orientation"]);
  const props = computed(() => omitProps(_props, ["class", "orientation"]));
  return () => {
    return <div role="group" data-slot="button-group" data-orientation={orientation.value ?? "horizontal"} class={cn(buttonGroupVariants({
      orientation: orientation.value
    }), className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const ButtonGroupText = defineUi<UI.ComponentProps<"div"> & {
  asChild?: boolean;
  seed?: string | number;
}>("ButtonGroupText", ["class", "asChild", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const asChild = computed(() => _props["asChild"] === undefined ? false : _props["asChild"]);
  const seed = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "asChild", "seed", "children", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: buttonGroupTextRecipe,
    params: {},
    kind: "cell" as const,
    seed: seed.value
  }));
  const shared = computed(() => ({
    ref: useMergedRef<HTMLElement>(hostRef, ref.value as UI.Ref<HTMLElement> | undefined),
    ...hostProps.value,
    class: cn("relative isolate flex min-h-9 items-center gap-2 px-4 font-hand text-base compact:min-h-8 calm:min-h-7 [&_svg]:pointer-events-none [&_svg:not(.absolute):not([class*='size-'])]:size-4", className.value),
    ...props.value
  }));
  return () => {
    if (asChild.value) {
      return <Slot.Root data-slot="button-group-text" {...domProps(shared.value)}>
        <Slot.Slottable>{readSlot(_slots.default)}</Slot.Slottable>
        {node.value}
      </Slot.Root>;
    }
    return <div data-slot="button-group-text" {...domProps(shared.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </div>;
  };
});
const ButtonGroupSeparator = defineUi<UI.ComponentProps<typeof Separator>>("ButtonGroupSeparator", ["class", "orientation"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const orientation = computed(() => _props["orientation"] === undefined ? "vertical" as const : _props["orientation"]);
  const props = computed(() => omitProps(_props, ["class", "orientation"]));
  return () => {
    return <Separator data-slot="button-group-separator" orientation={orientation.value} class={cn("relative m-0! self-stretch data-[orientation=vertical]:h-auto", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Separator>;
  };
});
export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };
