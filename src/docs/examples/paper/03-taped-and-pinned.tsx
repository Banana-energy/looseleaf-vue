// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "Taped, pinned, clipped" as const,
  description: "The `tape` shorthand lays strips across a corner, along the top or across both corners. A `fastener` holds a sheet with a clip, a pin, a staple or a binder clip." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="@container w-full">
      <div class="grid gap-x-10 gap-y-10 p-6 @2xl:grid-cols-3">
        <Paper tape="both" tapeKind="washi-dots" seed="a" class="h-32 p-5">
          <p class="font-script text-2xl font-bold">Taped up</p>
          <p class="text-sm">two strips, one at each corner</p>
        </Paper>
        <Paper stock="index-card" fastener="pin" seed="b" class="h-32 p-5 pt-3">
          <p class="mb-3 font-script text-2xl font-bold">Pinned</p>
          <p class="text-sm">a push-pin through the top</p>
        </Paper>
        <Paper stock="slip" fastener="clip" fastenerTone="sky" seed="c" class="h-32 p-5">
          <p class="font-script text-2xl font-bold">Clipped</p>
          <p class="text-sm">plastic-coated, sky blue</p>
        </Paper>
      </div>
    </div>;
  };
});
export default Example;
