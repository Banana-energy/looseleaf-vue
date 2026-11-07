// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { useLocation } from "../core/router";
import { BlockPage, BlocksIndexPage } from "../pages/BlocksPage";
import { ComponentPage } from "../pages/ComponentPage";
import { ComponentsIndexPage } from "../pages/ComponentsIndexPage";
import { FoundationPage, FoundationsIndexPage } from "../pages/FoundationsPage";
import { GettingStartedPage } from "../pages/GettingStartedPage";
import { HomePage } from "../pages/HomePage";
import { ChangelogPage, PlaygroundPage } from "../pages/MiscPages";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ErrorBoundary } from "../widgets/ErrorBoundary";
export const Outlet = defineUi<{}>("Outlet", [], (_props, {
  slots: _slots
}) => {
  const _hook0 = useLocation();
  const route = computed(() => _hook0.value.route);
  const path = computed(() => _hook0.value.path);
  return () => {
    return <ErrorBoundary resetKey={path.value} title="This page crashed">
      {(() => {
        switch (route.value.name) {
          case "home":
            return <HomePage />;
          case "getting-started":
            return <GettingStartedPage />;
          case "foundations":
            return route.value.topic ? <FoundationPage topic={route.value.topic} /> : <FoundationsIndexPage />;
          case "components":
            return route.value.slug ? <ComponentPage slug={route.value.slug} /> : <ComponentsIndexPage />;
          case "blocks":
            return route.value.slug ? <BlockPage slug={route.value.slug} /> : <BlocksIndexPage />;
          case "playground":
            return <PlaygroundPage />;
          case "changelog":
            return <ChangelogPage />;
          case "not-found":
            return <NotFoundPage missing={route.value.path} />;
        }
      })()}
    </ErrorBoundary>;
  };
});
