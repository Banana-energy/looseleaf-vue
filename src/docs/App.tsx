// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { Catalog } from "./core/catalog";
import { CatalogProvider } from "./core/catalog-context";
import { RouterProvider } from "./core/router";
import { SettingsProvider } from "./core/settings";
import { Shell } from "./shell/Shell";
export interface DocsAppProps {
  catalog: Catalog;
  Providers?: UI.ComponentType<{
    children: UI.VueNode;
  }>;
}
const NoProviders = defineUi<{
  children: UI.VueNode;
}>("NoProviders", [], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <>{readSlot(_slots.default)}</>;
  };
});
export const DocsApp = defineUi<DocsAppProps>("DocsApp", ["catalog", "Providers"], (_props, {
  slots: _slots
}) => {
  const catalog = computed(() => _props["catalog"]);
  const Providers = computed(() => jsxTag(_props["Providers"] === undefined ? NoProviders : _props["Providers"]));
  return () => {
    return <SettingsProvider>
      <RouterProvider>
        <CatalogProvider catalog={catalog.value}>
          <Providers.value>
            <Shell />
          </Providers.value>
        </CatalogProvider>
      </RouterProvider>
    </SettingsProvider>;
  };
});
