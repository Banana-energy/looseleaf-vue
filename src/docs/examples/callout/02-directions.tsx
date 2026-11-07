// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Callout } from "@/components/ui/callout";
export const meta = {
  title: "Eight directions" as const,
  description: "The arrow points where you say; the words sit on its tail." as const,
  layout: "stack" as const
};
const NOTES = [["left", "check the date!"], ["right", "ask sam"], ["up", "this again?"], ["down", "so true"], ["up-left", "nice one"], ["up-right", "wait, why?"], ["down-left", "move this up"], ["down-right", "the best line"]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid grid-cols-2 gap-x-10 gap-y-8 py-2 sm:grid-cols-4">
      {NOTES.map(([direction, text], i) => <Callout key={direction} direction={direction} seed={`d${i}`} curve={i === 6 ? "curl" as const : "curved" as const}>
          {text}
        </Callout>)}
    </div>;
  };
});
export default Example;
