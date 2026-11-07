// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Sticker } from "@/components/ui/sticker";
export const meta = {
  title: "Peeled corner" as const,
  description: "`peel` folds the lower-right corner over along a line perpendicular to the diagonal, whatever the silhouette. A number is the fold in px." as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center gap-8">
      <Sticker name="done" peel />
      <Sticker name="sale" peel={22} />
      <Sticker name="cursor-click" peel rotate={-5} />
      <Sticker name="hand-point-right" peel={16} rotate={4} />
    </div>;
  };
});
export default Example;
