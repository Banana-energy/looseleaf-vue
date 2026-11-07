// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, shallowRef } from "vue";
type Announce = (message: string) => void;
const AnnouncerContext = createContext<Announce>(() => {});
export function useAnnounce(): ComputedRef<Announce> {
  const _nestedHook0 = useContext(AnnouncerContext);
  return computed(() => {
    return _nestedHook0.value;
  });
}
export interface AnnouncerState {
  text: string;
  announce: Announce;
}
export function useAnnouncerState(): ComputedRef<AnnouncerState> {
  const state = shallowRef(initialState({
    message: "" as const,
    count: 0
  }));
  const setState = stateSetter(state);
  const announce = (message: string) => setState(s => ({
    message,
    count: s.count + 1
  }));
  return computed(() => {
    return {
      text: state.value.message ? state.value.message + (state.value.count % 2 ? "" as const : "​" as const) : "" as const,
      announce
    };
  });
}
export const AnnouncerProvider = defineUi<{
  announce: Announce;
  children: UI.VueNode;
}>("AnnouncerProvider", ["announce"], (_props, {
  slots: _slots
}) => {
  const announce = computed(() => _props["announce"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <AnnouncerContext.Provider value={announce.value}>{readSlot(_slots.default)}</AnnouncerContext.Provider>;
  };
});
