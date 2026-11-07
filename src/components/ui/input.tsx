// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { splitFieldClass } from "@/lib/field-class";
import { useInk } from "@/lib/ink/vue";
import { inputRecipe } from "@/lib/ink/recipes/input-ink";
import { cn } from "@/lib/utils";
const control = "h-full w-full min-w-0 flex-1 appearance-none border-0 bg-transparent px-3 py-1 text-[length:inherit] [text-align:inherit] " + "file:me-3 file:inline-flex file:h-6 file:items-center file:border-0 file:bg-hi-select file:px-2 file:text-sm file:font-bold file:text-foreground " + "disabled:cursor-not-allowed disabled:text-pencil-text aria-invalid:pe-9 forced-colors:aria-invalid:underline forced-colors:aria-invalid:decoration-wavy " + "autofill:shadow-[inset_0_0_0_1000px_var(--ll-slip)] autofill:[-webkit-text-fill-color:var(--ll-input-ink)] " + "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-search-cancel-button]:appearance-none [&::-ms-reveal]:hidden " + "[&[type=number]]:[appearance:textfield] " + "[&[type=password]:not(:placeholder-shown)]:font-mono [&[type=password]:not(:placeholder-shown)]:tracking-wider";
const frame = "relative isolate flex h-9 w-full min-w-0 items-center font-hand text-base text-(--ll-input-ink) caret-(--ll-caret) compact:h-8 calm:h-7 calm:text-[15px]";
const isTrue = (v: unknown) => v === true || v === "true";
const InputControl = defineUi<UI.ComponentProps<"input">>("InputControl", ["class", "type"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const type = computed(() => _props["type"]);
  const props = computed(() => omitProps(_props, ["class", "type"]));
  return () => {
    return <input type={type.value} data-slot="input" class={cn(control, className.value)} {...domProps(props.value, true)} />;
  };
});
const Input = defineUi<UI.ComponentProps<"input"> & {
  inputClassName?: string;
  seed?: string | number;
}>("Input", ["class", "inputClassName", "type", "seed", "style"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const inputClassName = computed(() => _props["inputClassName"]);
  const type = computed(() => _props["type"]);
  const seed = computed(() => _props["seed"]);
  const style = computed(() => _props["style"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "inputClassName", "type", "seed", "style", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: inputRecipe,
    params: {
      disabled: !!props.value.disabled,
      invalid: isTrue(props.value["aria-invalid"]),
      readOnly: !!props.value.readOnly
    },
    kind: "field" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    if (type.value === "hidden") return <InputControl type="hidden" ref={ref.value} {...domProps(props.value)}>{_slots.default?.()}</InputControl>;
    const split = splitFieldClass(className.value);
    return <span data-slot="input-frame" data-ink-focus="within" ref={hostRef} {...domProps(hostProps.value)} style={cssStyle(style.value)} class={cn(frame, split.frame)}>
      {node.value}
      <InputControl type={type.value} ref={ref.value} class={cn(split.control, inputClassName.value)} {...domProps(props.value)}>{_slots.default?.()}</InputControl>
    </span>;
  };
});
export { Input, InputControl };
