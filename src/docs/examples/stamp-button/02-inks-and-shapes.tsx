// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
import { StampButton, StampSurface } from "@/components/ui/stamp-button";
export const meta = {
  title: "Inks and shapes" as const,
  description: "The tool takes the color of the pad it will leave: green, red, blue felt, black. Any preset from the sticker sheet works, or give the words and the shape yourself." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 540
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <StampSurface class="w-full max-w-xl">
      <Paper stock="paper" tilt={false} class="flex flex-col gap-6 p-6 text-ink">
        <p class="max-w-sm">Received from the post office on the 14th, signed for and put on the shelf by the window. Stamp it however you like.</p>
        <div class="mt-40 flex flex-wrap items-end gap-4">
          <StampButton stamp="stamp-paid" place={{
            x: 0.2,
            y: 0.5
          }} />
          <StampButton stamp="stamp-received" sub="Mar 14 2026" place={{
            x: 0.66,
            y: 0.42
          }} />
          <StampButton text="Filed" shape="rect" ink="ink" dashed w={140} h={52} place={{
            x: 0.5,
            y: 0.6
          }} />
          <StampButton stamp="stamp-urgent" place={{
            x: 0.78,
            y: 0.7
          }} />
        </div>
      </Paper>
    </StampSurface>;
  };
});
export default Example;
