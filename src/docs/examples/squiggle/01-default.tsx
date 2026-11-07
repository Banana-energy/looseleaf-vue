// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Squiggle } from "@/components/ui/squiggle";
export const meta = {
  title: "Default" as const,
  description: "A wavy line across the width, between two paragraphs." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="max-w-md text-[17px] leading-[1.6]">
      <p>The morning was slow and gray and smelled of toast.</p>
      <Squiggle class="my-3" />
      <p>By noon the whole street had come out to look at the sky.</p>
    </div>;
  };
});
export default Example;
