// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, toValue, type MaybeRefOrGetter, type ComputedRef } from "vue";
import { readStored, writeStored } from "../core/storage";
interface DeskKnob {
  clutter: boolean;
  setClutter(value: boolean): void;
}
const DeskKnobContext = createContext<DeskKnob>({
  clutter: true,
  setClutter: () => {}
});
export const DeskKnobProvider = defineUi<{
  children: UI.VueNode;
}>("DeskKnobProvider", [], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const clutter = shallowRef(initialState(() => readStored("desk-clutter") !== "off"));
  const setState = stateSetter(clutter);
  const setClutter = (value: boolean) => {
    setState(value);
    writeStored("desk-clutter", value ? "on" as const : "off" as const);
  };
  const value = computed(() => ({
    clutter: clutter.value,
    setClutter
  }));
  return () => {
    return <DeskKnobContext.Provider value={value.value}>{readSlot(_slots.default)}</DeskKnobContext.Provider>;
  };
});
export function useDeskKnob(): ComputedRef<DeskKnob> {
  const _nestedHook0 = useContext(DeskKnobContext);
  return computed(() => {
    return _nestedHook0.value;
  });
}
