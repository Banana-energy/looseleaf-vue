// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { RadioGroup as RadioGroupPrimitive } from "@/lib/primitives";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { REVEAL_DASH, REVEAL_WHEN_CHECKED, markTouched } from "@/lib/ink/recipes/draw-on-ink";
import { radioRecipe } from "@/lib/ink/recipes/radio-group-ink";
import { cn } from "@/lib/utils";
const RadioGroupContext = createContext({
  invalid: false,
  disabled: false
});
const RadioGroup = defineUi<UI.ComponentProps<typeof RadioGroupPrimitive.Root>>("RadioGroup", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const invalid = computed(() => props.value["aria-invalid"] === true || props.value["aria-invalid"] === "true");
  const group = computed(() => ({
    invalid: invalid.value,
    disabled: !!props.value.disabled
  }));
  return () => {
    return <RadioGroupContext.Provider value={group.value}>
      <RadioGroupPrimitive.Root data-slot="radio-group" class={cn("grid gap-3 data-[orientation=horizontal]:flex data-[orientation=horizontal]:flex-wrap data-[orientation=horizontal]:gap-x-6", className.value)} {...domProps(props.value)}>{_slots.default?.()}</RadioGroupPrimitive.Root>
    </RadioGroupContext.Provider>;
  };
});
const RadioGroupItem = defineUi<UI.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  seed?: string | number;
}>("RadioGroupItem", ["class", "seed", "disabled", "onClickCapture"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const disabled = computed(() => _props["disabled"]);
  const ref = computed(() => _props["ref"]);
  const onClickCapture = computed(() => _props["onClickCapture"]);
  const props = computed(() => omitProps(_props, ["class", "seed", "disabled", "ref", "onClickCapture"]));
  const group = useContext(RadioGroupContext);
  const invalid = computed(() => props.value["aria-invalid"] === true || props.value["aria-invalid"] === "true" || group.value.invalid && props.value["aria-invalid"] === undefined);
  const off = computed(() => !!disabled.value || group.value.disabled);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: radioRecipe,
    params: {
      disabled: off.value,
      invalid: invalid.value
    },
    kind: "radio" as const,
    seed: seed.value
  }));
  return () => {
    return <RadioGroupPrimitive.Item data-slot="radio-group-item" ref={useMergedRef<HTMLButtonElement>(hostRef, ref.value)} {...domProps(hostProps.value)} disabled={disabled.value} onClickCapture={e => {
      markTouched(e);
      onClickCapture.value?.(e);
    }} class={cn("peer relative isolate aspect-square size-4 shrink-0 after:absolute after:-inset-2 disabled:cursor-not-allowed", REVEAL_DASH, REVEAL_WHEN_CHECKED, "group-hover/field:[&>svg_[data-layer=hover]]:visible group-hover/field:[&>svg_[data-layer=hover]]:opacity-100", "has-[+[data-slot=label]:hover]:[&>svg_[data-layer=hover]]:visible has-[+[data-slot=label]:hover]:[&>svg_[data-layer=hover]]:opacity-100", "has-[+input+[data-slot=label]:hover]:[&>svg_[data-layer=hover]]:visible has-[+input+[data-slot=label]:hover]:[&>svg_[data-layer=hover]]:opacity-100", className.value)} {...domProps(props.value)}>
      {node.value}
      <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" class="pointer-events-none absolute inset-0 hidden place-content-center leading-none font-bold forced-colors:grid forced-colors:before:content-['●']" />
    </RadioGroupPrimitive.Item>;
  };
});
export { RadioGroup, RadioGroupItem };
