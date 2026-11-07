// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot, Toggle as TogglePrimitive } from "@/lib/primitives";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { toggleRecipe, type ToggleTone } from "@/lib/ink/recipes/toggle-ink";
import { cn } from "@/lib/utils";
const toggleVariants = cva("relative isolate inline-flex shrink-0 items-center justify-center gap-2 font-hand font-bold whitespace-nowrap transition-[translate] duration-(--ll-dur-press) ease-out active:translate-y-(--ll-press-sink) [&[data-pressed]:not([data-pressed=false])]:translate-y-(--ll-press-sink) disabled:pointer-events-none disabled:text-pencil-text forced-colors:data-[state=on]:bg-[Highlight] forced-colors:data-[state=on]:text-[HighlightText] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not(.absolute):not([class*='size-'])]:size-4", {
  variants: {
    variant: {
      default: "" as const,
      outline: "" as const
    },
    size: {
      default: "h-9 min-w-9 px-2 text-base compact:h-8 compact:min-w-8 calm:h-7 calm:min-w-7" as const,
      sm: "h-8 min-w-8 px-1.5 text-[15px] compact:h-7 compact:min-w-7 calm:h-7 calm:min-w-7" as const,
      lg: "h-10 min-w-10 px-2.5 text-[17px] compact:h-9 compact:min-w-9 calm:h-8 calm:min-w-8" as const
    }
  },
  defaultVariants: {
    variant: "default" as const,
    size: "default" as const
  }
});
const Toggle = defineUi<UI.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants> & {
  tone?: ToggleTone;
  seed?: string | number;
}>("Toggle", ["class", "variant", "size", "tone", "seed", "asChild", "disabled"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"]);
  const size = computed(() => _props["size"]);
  const tone = computed(() => _props["tone"]);
  const seed = computed(() => _props["seed"]);
  const asChild = computed(() => _props["asChild"]);
  const disabled = computed(() => _props["disabled"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "variant", "size", "tone", "seed", "asChild", "disabled", "children", "ref"]));
  const v = computed(() => variant.value ?? "default");
  const forced = computed(() => "data-focus-visible" in props.value);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: toggleRecipe,
    params: {
      variant: v.value,
      disabled: !!disabled.value,
      tone: tone.value,
      invalid: props.value["aria-invalid"] === true || props.value["aria-invalid"] === "true"
    },
    kind: "toggle" as const,
    seed: seed.value,
    layers: forced.value ? "all" as const : undefined
  }));
  return () => {
    return <TogglePrimitive.Root data-slot="toggle" data-variant={v.value} data-size={size.value ?? "default"} data-ink-sink="self" ref={useMergedRef<HTMLButtonElement>(hostRef, ref.value)} {...domProps(hostProps.value)} asChild={asChild.value} disabled={disabled.value} class={cn(toggleVariants({
      variant: v.value,
      size: size.value,
      className: className.value
    }))} {...domProps(props.value)}>
      {!asChild.value && node.value}
      {asChild.value ? <Slot.Slottable>{readSlot(_slots.default)}</Slot.Slottable> : readSlot(_slots.default)}
      {asChild.value && node.value}
    </TogglePrimitive.Root>;
  };
});
export { Toggle, toggleVariants };
