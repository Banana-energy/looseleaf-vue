// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Circled } from "@/components/ui/circled";
export const meta = {
  title: "A word in a title, and bleed" as const,
  description: "The loop hugs one line of writing: a short word in a display title keeps clear of the lines above and below. bleed sets how far it stands off." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid max-w-lg gap-5 py-2">
      <h3 class="font-script text-4xl font-bold">
        Good to see <Circled tone="blue">you</Circled> again
      </h3>
      <p class="text-muted-foreground">Sign in with your email and the password you keep in your head.</p>
      <p class="flex flex-wrap items-baseline gap-x-8 gap-y-3 text-[17px]">
        <span>
          <Circled bleed={0}>bleed 0</Circled>
        </span>
        <span>
          <Circled>bleed 2, the default</Circled>
        </span>
        <span>
          <Circled bleed={7} tone="red">
            bleed 7
          </Circled>
        </span>
      </p>
    </div>;
  };
});
export default Example;
