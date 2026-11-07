// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Doodle } from "@/components/ui/doodle";
export const meta = {
  title: "Sizes are redrawn" as const,
  description: "Below 72 px a doodle switches to its 48 px drawing: the silhouette and one identifying detail, drawn with a heavier line." as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-col gap-4">
      {["sun", "mushroom"].map(name => <div key={name} class="flex items-end gap-6">
          {[32, 48, 64, 96, 128].map(size => <figure key={size} class="flex flex-col items-center gap-1">
              <Doodle name={name} size={size} />
              <figcaption class="text-sm text-pencil-text">{size}</figcaption>
            </figure>)}
        </div>)}
    </div>;
  };
});
export default Example;
