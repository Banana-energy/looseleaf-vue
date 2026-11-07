// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { BookmarkRibbon } from "@/components/ui/bookmark";
import { Notebook, NotebookPage, NotebookTitle } from "@/components/ui/notebook";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "Page markers" as const,
  description: "`BookmarkRibbon` is the ribbon with no behavior: decoration that hangs out of the top of a sheet or a notebook." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-12 p-6 md:grid-cols-2">
      <Paper seed="marked" class="relative min-h-40 p-6">
        <BookmarkRibbon class="absolute -top-1 end-6" seed="r1" />
        <p class="font-script text-2xl leading-none font-bold">Chapter three</p>
        <p class="mt-2">where the ribbon marks the page</p>
      </Paper>
      <Notebook seed="nb" class="min-h-40">
        <BookmarkRibbon tone="teal" class="absolute -top-1 end-10" seed="r2" />
        <NotebookPage>
          <NotebookTitle>Marked</NotebookTitle>
          <p>a ribbon in the notebook</p>
        </NotebookPage>
      </Notebook>
    </div>;
  };
});
export default Example;
