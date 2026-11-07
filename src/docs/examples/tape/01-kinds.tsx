// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Tape, type TapeProps } from "@/components/ui/tape";
export const meta = {
  title: "Kinds" as const,
  description: "Crepe masking tape, four printed washi patterns, gummed kraft and nearly invisible cellophane. Every strip has slit lines along its edges and crinkles where it was pressed down." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const kinds: TapeProps["kind"][] = ["masking", "washi-dots", "washi-stripes", "washi-zigzag", "washi-gingham", "kraft", "clear"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid grid-cols-2 gap-x-8 gap-y-6 p-4 sm:grid-cols-4">
      {kinds.map(kind => <div key={kind} class="flex flex-col items-start gap-2">
          <Tape kind={kind} length={110} height={26} seed={kind} />
          <span class="text-sm text-muted-foreground">{kind}</span>
        </div>)}
    </div>;
  };
});
export default Example;
