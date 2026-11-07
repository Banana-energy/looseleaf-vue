// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Badge } from "@/components/ui/badge";
export const meta = {
  title: "Counts and tally marks" as const,
  description: "A number in tabular figures that stops at 99+, and the same number written the way a person keeps score: four uprights and a slash. Screen readers get the digits either way." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-col gap-5">
      <div class="flex flex-wrap items-center gap-3">
        <Badge count={3} />
        <Badge count={8} variant="secondary" />
        <Badge count={42} variant="outline" />
        <Badge count={128} variant="destructive" />
        <Badge count={1200} max={999} variant="outline" />
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <Badge tally count={1} variant="outline" />
        <Badge tally count={3} variant="outline" />
        <Badge tally count={5} variant="outline" />
        <Badge tally count={7} variant="secondary" />
        <Badge tally count={12} />
        <Badge tally count={9} variant="destructive" />
      </div>
    </div>;
  };
});
export default Example;
