// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Clipboard, ClipboardPaper } from "@/components/ui/clipboard";
export const meta = {
  title: "Graph paper and tape" as const,
  description: "The paper is a Paper: graph rules, a strip of tape across a corner, a small extra note taped on top." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Clipboard tone="sky" seed="graph" tilt={0.8} class="max-w-sm">
      <ClipboardPaper stock="graph" rules="graph" tape="corner" seed="graph-p" class="pl-5">
        <p class="font-script text-[1.75rem] leading-none font-bold">Rain, week 39</p>
        <p class="mt-2 text-ink-you">so much of it</p>
      </ClipboardPaper>
    </Clipboard>;
  };
});
export default Example;
