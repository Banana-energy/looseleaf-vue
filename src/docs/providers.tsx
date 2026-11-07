// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { InkProvider } from "@/lib/ink/vue";
import { useSettings } from "./core/settings";
export const LibraryProviders = defineUi<{
  children: UI.VueNode;
}>("LibraryProviders", [], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const _hook1 = useSettings();
  const density = computed(() => _hook1.value.density);
  const motion = computed(() => _hook1.value.motion);
  return () => {
    return <InkProvider tier="lo" density={density.value} motion={motion.value === "reduced" ? "reduced" as const : "system" as const}>
      {readSlot(_slots.default)}
    </InkProvider>;
  };
});
