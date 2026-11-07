// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
import { ScrollArea } from "@/components/ui/scroll-area";
export const meta = {
  title: "Horizontal strip" as const,
  description: "`orientation=\"horizontal\"` shows only the horizontal mark. `bleed` pads the viewport by 12 px so the notes' shadows and any focus ring are not cut at the edge of the strip." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const notes = [["yellow", "Buy pens"], ["green", "Call mum"], ["orange", "Water the fern"], ["pink", "Sharpen pencils"], ["blue", "Read chapter 4"], ["yellow", "Post the parcel"], ["green", "Tidy the desk"], ["orange", "Practice lettering"]] as const;
const stock = {
  yellow: "sticky-yellow" as const,
  green: "sticky-green" as const,
  orange: "sticky-orange" as const,
  pink: "sticky-pink" as const,
  blue: "sticky-blue" as const
} as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <ScrollArea orientation="horizontal" type="always" bleed class="mx-auto w-full max-w-lg whitespace-nowrap">
      <div class="flex w-max gap-4 pb-3">
        {notes.map(([color, text], i) => <Paper key={i} seed={`note-${i}`} stock={stock[color]} class="grid h-28 w-36 place-items-center px-3 text-center font-script text-2xl leading-tight whitespace-normal">
            {text}
          </Paper>)}
      </div>
    </ScrollArea>;
  };
});
export default Example;
