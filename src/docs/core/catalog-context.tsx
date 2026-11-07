// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef } from "vue";
import { EMPTY_CATALOG, type Catalog } from "./catalog";
const CatalogContext = createContext<Catalog>(EMPTY_CATALOG);
export const CatalogProvider = defineUi<{
  catalog: Catalog;
  children: UI.VueNode;
}>("CatalogProvider", ["catalog"], (_props, {
  slots: _slots
}) => {
  const catalog = computed(() => _props["catalog"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <CatalogContext.Provider value={catalog.value}>{readSlot(_slots.default)}</CatalogContext.Provider>;
  };
});
export function useCatalog(): ComputedRef<Catalog> {
  const _nestedHook0 = useContext(CatalogContext);
  return computed(() => {
    return _nestedHook0.value;
  });
}
