// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Switch as SwitchPrimitive } from "@/lib/primitives";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { switchRecipe, switchThumbRecipe } from "@/lib/ink/recipes/switch-ink";
import { cn } from "@/lib/utils";
const SwitchThumb = defineUi<UI.ComponentProps<typeof SwitchPrimitive.Thumb> & {
  seed: string;
  disabled: boolean;
}>("SwitchThumb", ["class", "seed", "disabled"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const disabled = computed(() => _props["disabled"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "seed", "disabled", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: switchThumbRecipe,
    params: {
      disabled: disabled.value
    },
    kind: "thumb" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <SwitchPrimitive.Thumb data-slot="switch-thumb" ref={useMergedRef<HTMLSpanElement>(hostRef, ref.value)} {...domProps(hostProps.value)} class={cn("pointer-events-none relative isolate block shrink-0 transition-transform duration-(--ll-dur-pop) ease-pop forced-colors:rounded-full forced-colors:bg-[ButtonText]", "size-(--sw-t) data-[state=unchecked]:translate-x-1 rtl:data-[state=unchecked]:-translate-x-1 data-[state=checked]:translate-x-(--sw-on) rtl:data-[state=checked]:-translate-x-(--sw-on)", className.value)} {...domProps(props.value)}>
      {node.value}
    </SwitchPrimitive.Thumb>;
  };
});
const Switch = defineUi<UI.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
  seed?: string | number;
}>("Switch", ["class", "size", "seed", "disabled"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const size = computed(() => _props["size"] === undefined ? "default" as const : _props["size"]);
  const seed = computed(() => _props["seed"]);
  const disabled = computed(() => _props["disabled"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "size", "seed", "disabled", "ref"]));
  const invalid = computed(() => props.value["aria-invalid"] === true || props.value["aria-invalid"] === "true");
  const {
    hostRef,
    hostProps,
    node,
    seed: hostSeed
  } = useInk(() => ({
    recipe: switchRecipe,
    params: {
      disabled: !!disabled.value,
      invalid: invalid.value
    },
    kind: "switch" as const,
    seed: seed.value
  }));
  return () => {
    return <SwitchPrimitive.Root data-slot="switch" data-size={size.value} ref={useMergedRef<HTMLButtonElement>(hostRef, ref.value)} {...domProps(hostProps.value)} disabled={disabled.value} class={cn("peer group/switch relative isolate inline-flex shrink-0 items-center after:absolute after:-inset-1 disabled:cursor-not-allowed", "h-6 w-11 [--sw-on:1.5rem] [--sw-t:1rem] data-[size=sm]:h-5 data-[size=sm]:w-9 data-[size=sm]:[--sw-on:1.25rem] data-[size=sm]:[--sw-t:0.75rem] calm:h-5 calm:w-9 calm:[--sw-on:1.25rem] calm:[--sw-t:0.75rem]", "forced-colors:border forced-colors:border-[ButtonText] forced-colors:data-[state=checked]:bg-[Highlight]", "group-hover/field:[&>svg_[data-layer=hover]]:visible group-hover/field:[&>svg_[data-layer=hover]]:opacity-100", "has-[+[data-slot=label]:hover]:[&>svg_[data-layer=hover]]:visible has-[+[data-slot=label]:hover]:[&>svg_[data-layer=hover]]:opacity-100", "has-[+input+[data-slot=label]:hover]:[&>svg_[data-layer=hover]]:visible has-[+input+[data-slot=label]:hover]:[&>svg_[data-layer=hover]]:opacity-100", className.value)} {...domProps(props.value)}>
      {node.value}
      <SwitchThumb seed={`${hostSeed.value}|thumb`} disabled={!!disabled.value} />
    </SwitchPrimitive.Root>;
  };
});
export { Switch };
