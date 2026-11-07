// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Desk } from "@/components/ui/desk";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "Things on the blotter" as const,
  description: "`objects` lays a coffee ring, a pencil, paper clips, a ruler and push-pins behind your content. Pick some or take them all." as const,
  layout: "full" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Desk objects seed="objects" class="min-h-[26rem] px-8 pt-16 pb-24">
      <Paper stock="paper" seed="mid" class="mx-auto max-w-md p-8">
        <p class="font-script text-3xl leading-none font-bold">A tidy desk</p>
        <p class="mt-3">Everything lying around is behind the paper, hidden on small screens, and gone in calm density.</p>
      </Paper>
    </Desk>;
  };
});
export default Example;
