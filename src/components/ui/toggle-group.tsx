// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { type VariantProps } from "class-variance-authority";
import { Slot, ToggleGroup as ToggleGroupPrimitive } from "@/lib/primitives";
import { toggleVariants } from "@/components/ui/toggle";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { toggleGroupRecipe } from "@/lib/ink/recipes/toggle-group-ink";
import { toggleRecipe, type ToggleTone } from "@/lib/ink/recipes/toggle-ink";
import { cn } from "@/lib/utils";
const ToggleGroupContext = createContext<VariantProps<typeof toggleVariants> & {
  spacing?: number;
  tone?: ToggleTone;
  vertical?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}>({
  size: "default" as const,
  variant: "default" as const,
  spacing: 0
});
const ToggleGroup = defineUi<UI.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants> & {
  spacing?: number;
  tone?: ToggleTone;
  seed?: string | number;
}>("ToggleGroup", ["class", "variant", "size", "spacing", "tone", "seed", "disabled", "orientation"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"]);
  const size = computed(() => _props["size"]);
  const spacing = computed(() => _props["spacing"] === undefined ? 0 : _props["spacing"]);
  const tone = computed(() => _props["tone"]);
  const seed = computed(() => _props["seed"]);
  const disabled = computed(() => _props["disabled"]);
  const orientation = computed(() => _props["orientation"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "variant", "size", "spacing", "tone", "seed", "disabled", "orientation", "children", "ref"]));
  const joinedOutline = computed(() => spacing.value === 0 && (variant.value === "outline" || !!disabled.value));
  const invalid = computed(() => !disabled.value && (props.value["aria-invalid"] === true || props.value["aria-invalid"] === "true"));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: toggleGroupRecipe,
    params: {
      joined: joinedOutline.value,
      disabled: !!disabled.value,
      invalid: invalid.value
    },
    kind: "toggle-group" as const,
    seed: seed.value
  }));
  const ctx = computed(() => ({
    variant: variant.value,
    size: size.value,
    spacing: spacing.value,
    tone: tone.value,
    vertical: orientation.value === "vertical",
    disabled: !!disabled.value,
    invalid: invalid.value
  }));
  return () => {
    return <ToggleGroupPrimitive.Root data-slot="toggle-group" data-variant={variant.value} data-size={size.value} data-spacing={spacing.value} style={cssStyle({
      "--gap": spacing.value
    } as UI.CSSProperties)} ref={useMergedRef<HTMLDivElement>(hostRef, ref.value)} {...domProps(hostProps.value)} disabled={disabled.value} orientation={orientation.value} class={cn("group/toggle-group relative isolate flex w-fit items-center gap-[--spacing(var(--gap))] data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch", className.value)} {...domProps(props.value as UI.ComponentProps<typeof ToggleGroupPrimitive.Root>)}>
      {node.value}
      <ToggleGroupContext.Provider value={ctx.value}>{readSlot(_slots.default)}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>;
  };
});
const ToggleGroupItem = defineUi<UI.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants> & {
  seed?: string | number;
}>("ToggleGroupItem", ["class", "variant", "size", "seed", "asChild", "disabled"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const variant = computed(() => _props["variant"]);
  const size = computed(() => _props["size"]);
  const seed = computed(() => _props["seed"]);
  const asChild = computed(() => _props["asChild"]);
  const disabled = computed(() => _props["disabled"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "children", "variant", "size", "seed", "asChild", "disabled", "ref"]));
  const context = useContext(ToggleGroupContext);
  const v = computed(() => context.value.variant || variant.value || "default");
  const s = computed(() => context.value.size || size.value || "default");
  const joined = computed(() => context.value.spacing === 0 && (v.value !== "outline" || context.value.variant === "outline"));
  const forced = computed(() => "data-focus-visible" in props.value);
  const own = computed(() => props.value["aria-invalid"]);
  const invalid = computed(() => own.value === undefined ? !!context.value.invalid : own.value === true || own.value === "true");
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: toggleRecipe,
    params: {
      variant: v.value,
      disabled: !!disabled.value || !!context.value.disabled,
      tone: context.value.tone,
      joined: joined.value,
      vertical: context.value.vertical,
      invalid: invalid.value
    },
    kind: "toggle" as const,
    seed: seed.value,
    layers: forced.value ? "all" as const : undefined
  }));
  return () => {
    return <ToggleGroupPrimitive.Item data-slot="toggle-group-item" data-variant={v.value} data-size={s.value} data-spacing={context.value.spacing} data-ink-sink="self" ref={useMergedRef<HTMLButtonElement>(hostRef, ref.value)} {...domProps(hostProps.value)} asChild={asChild.value} disabled={disabled.value} class={cn(toggleVariants({
      variant: v.value,
      size: s.value
    }), "w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10", "data-[spacing=0]:first-of-type:[&>svg_[data-part=seam]]:hidden", className.value)} {...domProps(props.value)}>
      {!asChild.value && node.value}
      {asChild.value ? <Slot.Slottable>{readSlot(_slots.default)}</Slot.Slottable> : readSlot(_slots.default)}
      {asChild.value && node.value}
    </ToggleGroupPrimitive.Item>;
  };
});
export { ToggleGroup, ToggleGroupItem };
