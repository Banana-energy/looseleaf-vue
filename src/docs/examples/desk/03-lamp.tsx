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
  title: "Lamp strength" as const,
  description: "The vignette darkens toward the corners. `lamp={0}` is a flat blotter, `1` the theme's own (a whisper of shade), `2.5` a dim room." as const,
  layout: "full" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-4 p-4 sm:grid-cols-3">
      {([0, 1, 2.5] as const).map(lamp => <Desk key={lamp} lamp={lamp} class="grid h-52 place-items-center p-3">
          <Paper stock="slip" tilt={false} seed={`lamp-${lamp}`} class="px-5 py-4 text-center">
            <p class="font-script text-2xl leading-none font-bold">lamp={"{" + lamp + "}"}</p>
          </Paper>
        </Desk>)}
    </div>;
  };
});
export default Example;
