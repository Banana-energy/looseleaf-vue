// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Notebook, NotebookPage, NotebookTitle, NotebookTurn } from "@/components/ui/notebook";
export const meta = {
  title: "Turning pages" as const,
  description: "`curl` folds the corner and `NotebookTurn` is the button over it. Pages are named with `value`; only the current one is shown, and a turned page unfolds from the dog-ear (a clip-path wipe, no 3D)." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Notebook as="section" curl defaultValue="mon" seed="week" class="mx-auto min-h-[22rem] w-full max-w-md" aria-label="The week">
      <NotebookPage value="mon">
        <NotebookTitle>Monday</NotebookTitle>
        <p>Rain on the window.</p>
        <p>Tea, then the outline.</p>
      </NotebookPage>
      <NotebookPage value="tue">
        <NotebookTitle>Tuesday</NotebookTitle>
        <p>Wash the sky, wait.</p>
        <p>Post the parcel by five.</p>
      </NotebookPage>
      <NotebookPage value="wed">
        <NotebookTitle>Wednesday</NotebookTitle>
        <p>Hatch the shade.</p>
        <p>Nothing else. Nothing.</p>
      </NotebookPage>
      <NotebookTurn to="tue">Next page</NotebookTurn>
    </Notebook>;
  };
});
export default Example;
