// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Mascot } from "@/components/ui/mascot";
export const meta = {
  title: "Sizes are redrawn" as const,
  description: "Under 28 px he is a face on a silhouette (two dots and a smile), 32 and 48 px add the blush, the wood and the graphite tip, 96 px is the master, 160 px adds a shine and a ferrule line." as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex items-end gap-8">
      {[24, 32, 48, 96, 160].map(size => <figure key={size} class="flex flex-col items-center gap-1">
          <Mascot pose="idle" size={size} />
          <figcaption class="text-sm text-pencil-text">{size}</figcaption>
        </figure>)}
    </div>;
  };
});
export default Example;
