// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Handwritten } from "@/components/ui/handwritten";
export const meta = {
  title: "Default" as const,
  description: "Typeset on the left, written on the right: the same words, the same size." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid max-w-xl gap-6 sm:grid-cols-2">
      <p class="text-[17px] leading-[1.7]">Most of what I remember from a book is in the margins: an arrow, a question mark, a small argument with a dead author.</p>
      <Handwritten as="p" class="text-[17px] leading-[1.7]">
        Most of what I remember from a book is in the margins: an arrow, a question mark, a small argument with a dead author.
      </Handwritten>
    </div>;
  };
});
export default Example;
