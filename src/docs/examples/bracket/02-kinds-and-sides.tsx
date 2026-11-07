// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bracket } from "@/components/ui/bracket";
export const meta = {
  title: "Kinds and sides" as const,
  description: "Square, curly and round; on the start side and the end side; in ink, blue and red." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid max-w-xl gap-6 sm:grid-cols-2">
      <Bracket kind="square" class="w-44 text-[17px] leading-[1.6]">
        Square: for quoting a stretch of a page.
      </Bracket>
      <Bracket kind="curly" tone="blue" side="end" class="w-44 text-[17px] leading-[1.6]">
        Curly: for lumping things together, from the end side.
      </Bracket>
      <Bracket kind="round" tone="red" class="w-44 text-[17px] leading-[1.6]">
        Round: for an aside.
      </Bracket>
      <Bracket kind="square" weight="brush" tone="ink" side="end" class="w-44 text-[17px] leading-[1.6]">
        A brush pen makes it a statement.
      </Bracket>
    </div>;
  };
});
export default Example;
