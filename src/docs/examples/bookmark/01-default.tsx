// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bookmark } from "@/components/ui/bookmark";
export const meta = {
  title: "A bookmark" as const,
  description: "Press it: the ghost becomes a ribbon that settles in with a little turn. It is a toggle button, so Space and Enter work, and its state is `aria-pressed`." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex items-center gap-8 p-6">
      <Bookmark seed="off">Save for later</Bookmark>
      <Bookmark defaultPressed seed="on">
        Saved
      </Bookmark>
      <Bookmark disabled seed="dis">
        Cannot save
      </Bookmark>
    </div>;
  };
});
export default Example;
