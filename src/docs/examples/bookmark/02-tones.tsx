// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bookmark } from "@/components/ui/bookmark";
export const meta = {
  title: "Eight ribbons" as const,
  description: "Every stationery accent. Each ribbon is woven and edge-stitched, lit from the upper left, a hair off straight." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const tones = ["tomato", "tangerine", "lemon", "grass", "teal", "sky", "grape", "bubblegum"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center justify-center gap-6 p-6">
      {tones.map(tone => <Bookmark key={tone} tone={tone} defaultPressed seed={tone}>
          {tone}
        </Bookmark>)}
    </div>;
  };
});
export default Example;
