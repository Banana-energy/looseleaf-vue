// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Default" as const,
  description: "Sixteen pixels, ink in the current text color. Names are lucide's, so a shadcn snippet keeps working." as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center gap-5 text-ink">
      {["check", "x", "plus", "minus", "search", "chevron-down", "arrow-right", "copy", "trash", "pencil", "user", "settings", "calendar", "ellipsis"].map(name => <Icon key={name} name={name} />)}
    </div>;
  };
});
export default Example;
