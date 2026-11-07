// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef } from "vue";
import type { ContentModule, Loader } from "../core/catalog";
import { useCatalog } from "../core/catalog-context";
import { Skeleton } from "../kit";
import { ErrorBoundary } from "./ErrorBoundary";
const lazyCache = new WeakMap<Loader<ContentModule>, UI.ComponentType>();
function lazyBody(loader: Loader<ContentModule>): UI.ComponentType {
  let component = lazyCache.get(loader);
  if (!component) {
    component = vueLazy(async () => {
      const mod = await loader();
      if (typeof mod.default !== "function" && typeof mod.default !== "object") console.error("A content module must `export default` a component.");
      return {
        default: mod.default
      };
    });
    lazyCache.set(loader, component);
  }
  return component;
}
export function useHasContent(_source0: MaybeRefOrGetter<string>): ComputedRef<boolean> {
  const key = computed(() => toValue(_source0));
  const _nestedHook0 = useCatalog();
  return computed(() => {
    return _nestedHook0.value.content.has(key.value);
  });
}
export const ContentSlot = defineUi<{
  contentKey: string;
  fallback?: UI.VueNode;
}>("ContentSlot", ["contentKey", "fallback"], (_props, {
  slots: _slots
}) => {
  const contentKey = computed(() => _props["contentKey"]);
  const fallback = computed(() => _props["fallback"] === undefined ? null : _props["fallback"]);
  const _nestedHook0 = useCatalog();
  const loader = computed(() => _nestedHook0.value.content.get(contentKey.value));
  return () => {
    if (!loader.value) return <>{fallback.value}</>;
    const Body = lazyBody(loader.value);
    return <ErrorBoundary resetKey={contentKey.value} title="This page body crashed">
      <Suspense fallback={<Skeleton height={240} />}>
        <Body />
      </Suspense>
    </ErrorBoundary>;
  };
});
