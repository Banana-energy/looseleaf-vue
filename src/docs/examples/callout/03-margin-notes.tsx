// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Callout } from "@/components/ui/callout";
import { Highlight } from "@/components/ui/highlight";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "In the margin of a paragraph" as const,
  description: "Float a callout into the page's padding (`float-end clear-end -me-56`) right after the words it is about: it lands on that line, whatever the width. Below md they are hidden." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="paper" rules="ruled" seed="margin" class="w-full max-w-3xl pt-4 pr-6 pb-6 pl-14 md:pr-60">
      <p class="text-[17px] leading-[28px]">
        Most of what I remember from a book is in the margins: an arrow, a question mark, a small argument with a dead author. The good bits get{" "}
        <Highlight>a swipe of yellow</Highlight>
        <Callout class="float-end clear-end -me-56 mt-1.5 w-48 max-md:hidden">the best line</Callout> so I can find them on the next read, and the parts I do not believe get a red pencil. I go back for them in winter, when a page is the only company.
        <Callout direction="left" bend="down" class="float-end clear-end -me-56 mt-1.5 w-48 max-md:hidden">
          ha, true
        </Callout>
      </p>
    </Paper>;
  };
});
export default Example;
