// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "Ruled notes" as const,
  description: "Printed rules are part of the sheet, so they turn with it and the text stays upright. Set the line height to the rule pitch (28 px) and start the first line 16 px down (p-4) and the words sit on the lines, baseline 2 to 3 px above the rule. Each rule is printed 8 px above the bottom of its line; --ll-rule-offset tunes that." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="paper" rules="ruled" seed="notes" class="mx-auto w-full max-w-md px-4 pt-4 pb-6 pl-14" style={cssStyle({
      minHeight: 236
    })}>
      <h3 class="relative top-[calc(3px-var(--ll-rule-offset,8px))] font-script text-[1.7rem] leading-[28px] font-bold">Field notes</h3>
      <p class="text-[15px] leading-[28px]">
        Tuesday. Rain on the window, three cups of tea, and one very small plan for a very big week.
      </p>
    </Paper>;
  };
});
export default Example;
