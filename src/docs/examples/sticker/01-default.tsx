// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Sticker } from "@/components/ui/sticker";
export const meta = {
  title: "Default" as const,
  description: "Die-cut vinyl: a white border, a cut line, a soft shadow and a small seeded tilt. Badges like Done and Sale are generated; the rest are drawn." as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center gap-6">
      {["done", "sale", "cursor-click", "hand-point-right"].map(name => <Sticker key={name} name={name} />)}
    </div>;
  };
});
export default Example;
