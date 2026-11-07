// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Spinner } from "@/components/ui/spinner";
export const meta = {
  title: "Size" as const,
  description: "Official `spinner-size`: `size-3`, `size-4`, `size-6` and `size-8`. The scribble is redrawn for each size (fewer, wider turns when it is small) rather than scaled, so the pencil line keeps its weight." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex items-center gap-6">
      <Spinner class="size-3" aria-label="Loading, extra small" />
      <Spinner class="size-4" aria-label="Loading, small" />
      <Spinner class="size-6" aria-label="Loading, medium" />
      <Spinner class="size-8" aria-label="Loading, large" />
    </div>;
  };
});
export default Example;
