// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
export const meta = {
  title: "Sticky note" as const,
  description: "`variant=\"note\"` is a sticky note with a taped corner: a Paper, so the sheet turns a little and the text does not. Use it for asides that should not look like system messages." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 220
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Alert variant="note" seed="note" class="max-w-xs">
      <AlertTitle class="font-script text-2xl leading-none">Reminder</AlertTitle>
      <AlertDescription>Bring the good pens. The desk is mint now, so nothing will match.</AlertDescription>
    </Alert>;
  };
});
export default Example;
