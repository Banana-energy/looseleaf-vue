// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "Edges" as const,
  description: "A plain cut is pure CSS. Torn, deckled, pinked, perforated and scalloped edges draw their outline once, with a fringe of torn fibers." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const edges = ["cut", "torn", "deckle", "crimp", "zig", "perf", "scallop"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="@container w-full">
      <div class="grid grid-cols-2 gap-x-8 gap-y-8 p-2 @2xl:grid-cols-4">
        {edges.map(edge => <figure key={edge} class="m-0 grid gap-2">
            <Paper edge={edge} seed={edge} class="h-20" />
            <figcaption class="font-script text-xl leading-none font-bold">{edge}</figcaption>
          </figure>)}
        <figure class="m-0 grid gap-2">
          <Paper edge={{
            bottom: "torn" as const
          }} seed="one-side" class="h-20" />
          <figcaption class="font-script text-xl leading-none font-bold">torn below</figcaption>
        </figure>
      </div>
    </div>;
  };
});
export default Example;
