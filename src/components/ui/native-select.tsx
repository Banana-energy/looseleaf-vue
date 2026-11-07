// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { splitFieldClass } from "@/lib/field-class";
import { useInk } from "@/lib/ink/vue";
import { nativeSelectRecipe } from "@/lib/ink/recipes/native-select-ink";
import { cn } from "@/lib/utils";
const isTrue = (v: unknown) => v === true || v === "true";
const NativeSelect = defineUi<Omit<UI.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default";
  seed?: string | number;
}>("NativeSelect", ["class", "size", "seed", "style"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const size = computed(() => _props["size"] === undefined ? "default" as const : _props["size"]);
  const seed = computed(() => _props["seed"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "size", "seed", "style", "children", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: nativeSelectRecipe,
    params: {
      disabled: !!props.value.disabled,
      invalid: isTrue(props.value["aria-invalid"])
    },
    kind: "field" as const,
    seed: seed.value,
    still: true
  }));
  const split = computed(() => splitFieldClass(className.value));
  return () => {
    return <span data-slot="native-select-wrapper" data-size={size.value} data-ink-focus="within" ref={hostRef} {...domProps(hostProps.value)} style={cssStyle(style.value)} class={cn("group/native-select relative isolate flex h-9 w-fit items-center font-hand text-base text-(--ll-input-ink) caret-(--ll-caret) has-[select[multiple]]:h-auto data-[size=sm]:h-8 data-[size=sm]:text-[15px] compact:h-8 calm:h-7 calm:text-[15px] compact:data-[size=sm]:h-7", split.value.frame)}>
      {node.value}
      <select data-slot="native-select" data-size={size.value} ref={ref.value} class={cn("h-full w-full min-w-0 appearance-none bg-transparent ps-3 pe-10 aria-invalid:pe-14 outline-none text-[length:inherit] disabled:cursor-not-allowed disabled:text-pencil-text has-[option[value='']:checked]:text-(--ll-placeholder) forced-colors:aria-invalid:underline forced-colors:aria-invalid:decoration-wavy", split.value.control)} {...domProps(props.value)}>
        {readSlot(_slots.default)}
      </select>
      <Icon name="chevron-down" size={16} data-slot="native-select-icon" class="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 text-ink-soft select-none group-has-[select:disabled]/native-select:text-pencil-text" />
    </span>;
  };
});
const NativeSelectOption = defineUi<UI.ComponentProps<"option">>("NativeSelectOption", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <option data-slot="native-select-option" class={cn("bg-popover text-popover-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</option>;
  };
});
const NativeSelectOptGroup = defineUi<UI.ComponentProps<"optgroup">>("NativeSelectOptGroup", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <optgroup data-slot="native-select-optgroup" class={cn("bg-popover text-popover-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</optgroup>;
  };
});
export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
