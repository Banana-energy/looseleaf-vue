// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Napkin, NapkinContent, NapkinTitle } from "@/components/ui/napkin";
export const meta = {
  title: "Quarter, half, flat" as const,
  description: "Folded in four, in half with a coffee ring, and unfolded." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="w-full">
      <div class="flex flex-wrap justify-center gap-x-6 gap-y-10 p-4">
        <Napkin fold="quarter" seed="q" class="w-52 max-w-full">
          <NapkinTitle>Quarter</NapkinTitle>
          <NapkinContent>a crease each way</NapkinContent>
        </Napkin>
        <Napkin fold="half" stain seed="h" class="w-52 max-w-full">
          <NapkinTitle>Half</NapkinTitle>
          <NapkinContent>and a cup stood here</NapkinContent>
        </Napkin>
        <Napkin fold="none" seed="f" class="w-52 max-w-full">
          <NapkinTitle>Flat</NapkinTitle>
          <NapkinContent>never folded</NapkinContent>
        </Napkin>
      </div>
    </div>;
  };
});
export default Example;
