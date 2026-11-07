// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Annotate, type AnnotateType } from "@/components/ui/annotate";
export const meta = {
  title: "Every type" as const,
  description: "The eight marks side by side. Each is a real component underneath (Highlight, Underline, Circled, Strike, Scribble) with the same props." as const,
  layout: "stack" as const
};
const TYPES: Array<[AnnotateType, string]> = [["highlight", "swipe"], ["underline", "line"], ["circle", "loop"], ["box", "box"], ["brackets", "brackets"], ["strike-through", "struck"], ["crossed-off", "crossed off"], ["scribble", "scribbled"]];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <ul role="list" class="grid max-w-xl grid-cols-2 gap-x-6 gap-y-6 py-2 text-[17px] sm:grid-cols-4">
      {TYPES.map(([type, word]) => <li key={type} class="grid gap-1.5">
          <span class="font-type text-[11px] whitespace-nowrap text-pencil-text">{type}</span>
          <span>
            <Annotate type={type} color={type === "highlight" ? "yellow" as const : type === "strike-through" || type === "crossed-off" || type === "circle" ? "red" as const : "blue" as const}>
              {word}
            </Annotate>
          </span>
        </li>)}
    </ul>;
  };
});
export default Example;
