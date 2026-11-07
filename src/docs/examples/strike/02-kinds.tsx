// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Strike } from "@/components/ui/strike";
export const meta = {
  title: "Kinds and pens" as const,
  description: "A single line, a double line, a cross-out over the whole phrase, and other pens." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid max-w-lg gap-4 text-[17px] leading-[1.55]">
      <p>
        <Strike>single</Strike>, <Strike kind="double">double</Strike>, and <Strike kind="cross">a cross-out over the whole phrase</Strike>.
      </p>
      <p>
        <Strike tone="ink">ink felt</Strike>, <Strike tone="blue">blue felt</Strike>, <Strike weight="brush">a brush pen</Strike>, <Strike weight="fine">a fine-liner</Strike>.
      </p>
    </div>;
  };
});
export default Example;
