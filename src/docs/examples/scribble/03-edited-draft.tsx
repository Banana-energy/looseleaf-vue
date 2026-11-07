// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Highlight } from "@/components/ui/highlight";
import { Paper } from "@/components/ui/paper";
import { Scribble } from "@/components/ui/scribble";
import { Strike } from "@/components/ui/strike";
export const meta = {
  title: "An edited draft" as const,
  description: "Scribbles, strikes and a highlight on the same page: an editor's pass over a paragraph." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="paper" class="w-full max-w-lg p-7" tilt>
      <p class="font-script text-2xl">Draft 3</p>
      <p class="mt-3 text-[17px] leading-[1.7]">
        The garden was <Scribble weight="fine">very extremely</Scribble> overgrown, and the gate, which had been <Strike>painted green</Strike> left open for years, no longer{" "}
        <Scribble tone="red">closed properly at all</Scribble> closed. <Highlight tone="green">Keep this line.</Highlight>
      </p>
    </Paper>;
  };
});
export default Example;
