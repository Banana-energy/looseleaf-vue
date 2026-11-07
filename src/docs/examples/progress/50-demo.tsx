// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Progress } from "@/components/ui/progress";
export const meta = {
  title: "Demo" as const,
  description: "Official `progress-demo`: the bar starts at 13 and jumps to 66 half a second later. The marker is drawn once, full length, and revealed to the value, so the change is a CSS transition. Only addition: an `aria-label`, which a progressbar needs." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const progress = shallowRef(initialState(13));
  const setProgress = stateSetter(progress);
  watchDependencies(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, () => [], false);
  return () => {
    return <Progress value={progress.value} aria-label="Progress" class="w-[60%]" />;
  };
});
export default Example;
