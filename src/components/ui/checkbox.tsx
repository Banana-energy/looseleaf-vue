// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Checkbox as CheckboxPrimitive } from "@/lib/primitives";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { checkboxRecipe } from "@/lib/ink/recipes/checkbox-ink";
import { REVEAL_DASH, REVEAL_WHEN_CHECKED, REVEAL_WHEN_INDETERMINATE, markTouched } from "@/lib/ink/recipes/draw-on-ink";
import { cn } from "@/lib/utils";
const Checkbox = defineUi<UI.ComponentProps<typeof CheckboxPrimitive.Root> & {
  seed?: string | number;
}>("Checkbox", ["class", "seed", "disabled", "onClickCapture"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const disabled = computed(() => _props["disabled"]);
  const ref = computed(() => _props["ref"]);
  const onClickCapture = computed(() => _props["onClickCapture"]);
  const props = computed(() => omitProps(_props, ["class", "seed", "disabled", "ref", "onClickCapture"]));
  const invalid = computed(() => props.value["aria-invalid"] === true || props.value["aria-invalid"] === "true");
  const forced = computed(() => "data-focus-visible" in props.value);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: checkboxRecipe,
    params: {
      disabled: !!disabled.value,
      invalid: invalid.value
    },
    kind: "checkbox" as const,
    seed: seed.value,
    layers: forced.value ? "all" as const : undefined
  }));
  return () => {
    return <CheckboxPrimitive.Root data-slot="checkbox" ref={useMergedRef<HTMLButtonElement>(hostRef, ref.value)} {...domProps(hostProps.value)} disabled={disabled.value} onClickCapture={e => {
      markTouched(e);
      onClickCapture.value?.(e);
    }} class={cn("peer relative isolate size-4 shrink-0 after:absolute after:-inset-1.5 disabled:cursor-not-allowed", REVEAL_DASH, REVEAL_WHEN_CHECKED, REVEAL_WHEN_INDETERMINATE, "group-hover/field:[&>svg_[data-layer=hover]]:visible group-hover/field:[&>svg_[data-layer=hover]]:opacity-100", "has-[+[data-slot=label]:hover]:[&>svg_[data-layer=hover]]:visible has-[+[data-slot=label]:hover]:[&>svg_[data-layer=hover]]:opacity-100", "has-[+input+[data-slot=label]:hover]:[&>svg_[data-layer=hover]]:visible has-[+input+[data-slot=label]:hover]:[&>svg_[data-layer=hover]]:opacity-100", className.value)} {...domProps(props.value)}>
      {node.value}
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" class="pointer-events-none absolute inset-0 hidden place-content-center leading-none font-bold forced-colors:grid forced-colors:data-[state=checked]:before:content-['✓'] forced-colors:data-[state=indeterminate]:before:content-['–']" />
    </CheckboxPrimitive.Root>;
  };
});
export { Checkbox };
