// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Notebook, NotebookPage, NotebookTitle } from "@/components/ui/notebook";
export const meta = {
  title: "A spiral notebook" as const,
  description: "Wire coils through punched holes, ruled lines with a red margin, and two more pages peeking out underneath. The words sit on the lines." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Notebook seed="field-notes" class="mx-auto min-h-[24rem] w-full max-w-md">
      <NotebookPage>
        <NotebookTitle>Field notes</NotebookTitle>
        <p>Tuesday. Rain on the window,</p>
        <p>three cups of tea, and one</p>
        <p>very small plan for a very big week.</p>
        <p class="mt-7 text-muted-foreground">1. ink the outline</p>
        <p class="text-muted-foreground">2. wash the sky, then wait</p>
        <p class="text-muted-foreground">3. hatch the shade</p>
      </NotebookPage>
    </Notebook>;
  };
});
export default Example;
