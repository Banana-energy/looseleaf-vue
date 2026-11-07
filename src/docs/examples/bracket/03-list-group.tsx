// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bracket } from "@/components/ui/bracket";
import { Callout } from "@/components/ui/callout";
export const meta = {
  title: "Grouping list items" as const,
  description: "A curly brace across three items with a note on the other side: the list is still a list." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex items-center gap-2">
      <Bracket kind="curly" side="end" tone="blue" class="pe-8">
        <ul role="list" class="grid gap-1.5 text-[17px]">
          <li>Flour</li>
          <li>Butter</li>
          <li>Sugar</li>
        </ul>
      </Bracket>
      <Callout direction="left" tone="blue" arrowClassName="h-8 w-12">
        the base
      </Callout>
    </div>;
  };
});
export default Example;
