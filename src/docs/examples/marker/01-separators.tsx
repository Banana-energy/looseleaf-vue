// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Marker, MarkerContent } from "@/components/ui/marker";
export const meta = {
  title: "Day separators" as const,
  description: "A ruled pencil line on each side of the day, written in the script font. The lines run level and stop just short of the words." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-auto flex w-full max-w-lg flex-col gap-3 px-4 pb-4">
      <Marker variant="separator" seed="wed">
        <MarkerContent>Wednesday</MarkerContent>
      </Marker>
      <Bubble variant="muted">
        <BubbleContent seed="sep-1">Did the tags make it into the build?</BubbleContent>
      </Bubble>
      <Bubble variant="default" align="end">
        <BubbleContent seed="sep-2">They did. Filter row is next.</BubbleContent>
      </Bubble>
      <Marker variant="separator" seed="today" class="mt-3">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Bubble variant="muted">
        <BubbleContent seed="sep-3">Morning! The filter row is in.</BubbleContent>
      </Bubble>
    </div>;
  };
});
export default Example;
