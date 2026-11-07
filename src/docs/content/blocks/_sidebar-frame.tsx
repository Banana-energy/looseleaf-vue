// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Desk } from "@/components/ui/desk";
export const SidebarFrame = defineUi<{
  height?: number;
  children: UI.VueNode;
}>("SidebarFrame", ["height"], (_props, {
  slots: _slots
}) => {
  const height = computed(() => _props["height"] === undefined ? 640 : _props["height"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <Desk class="w-full overflow-hidden [transform:translateZ(0)]" style={cssStyle({
      height: height.value
    })}>
      {readSlot(_slots.default)}
    </Desk>;
  };
});
