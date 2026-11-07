// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Notebook, NotebookPage, NotebookTitle } from "@/components/ui/notebook";
export const meta = {
  title: "Four bindings" as const,
  description: "A wire spiral, binder rings, a stab-stitched spine in tomato thread, and a reporter's pad bound on top. Each is a different drawing; the holes are punched through and the desk shows in them." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="@container w-full">
      <div class="grid gap-x-10 gap-y-12 p-2 @2xl:grid-cols-2">
        <Notebook binding="spiral" pages={2} seed="spiral" class="min-h-64">
          <NotebookPage>
            <NotebookTitle>Spiral</NotebookTitle>
            <p>a coil for every hole</p>
          </NotebookPage>
        </Notebook>
        <Notebook binding="rings" pages={3} seed="rings" class="min-h-64">
          <NotebookPage>
            <NotebookTitle>Rings</NotebookTitle>
            <p>rings on a steel strip</p>
          </NotebookPage>
        </Notebook>
        <Notebook binding="stitched" tone="tomato" pages={1} seed="stitched" class="min-h-64">
          <NotebookPage>
            <NotebookTitle>Stitched</NotebookTitle>
            <p>a running thread</p>
          </NotebookPage>
        </Notebook>
        <Notebook binding="spiral" side="top" tone="sky" seed="top" class="min-h-64">
          <NotebookPage>
            <NotebookTitle>Reporter pad</NotebookTitle>
            <p>call the printer before ten</p>
          </NotebookPage>
        </Notebook>
      </div>
    </div>;
  };
});
export default Example;
