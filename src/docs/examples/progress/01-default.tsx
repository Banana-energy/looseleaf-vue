// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Progress } from "@/components/ui/progress";
export const meta = {
  title: "Default" as const,
  description: "A pencil-hatched box colored in with a marker as far as the value says. Change the value and the marker glides to it (a CSS clip on a full-length pass; nothing is redrawn)." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const value = shallowRef(initialState(13));
  const setValue = stateSetter(value);
  watchDependencies(() => {
    const t = setTimeout(() => setValue(66), 600);
    return () => clearTimeout(t);
  }, () => [], false);
  return () => {
    return <Progress value={value.value} class="w-[60%] min-w-48" aria-label="Chapter progress" />;
  };
});
export default Example;
