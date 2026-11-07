// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Tape } from "@/components/ui/tape";
export const meta = {
  title: "A label on tape" as const,
  description: "Write on it: put the tape behind a line of text. The strip is decoration, so the label is real text a screen reader reads." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center gap-8 p-4">
      {[{
        kind: "masking" as const,
        text: "fragile" as const
      }, {
        kind: "kraft" as const,
        text: "this side up" as const
      }, {
        kind: "washi-gingham" as const,
        text: "picnic" as const
      }].map(({
        kind,
        text
      }) => <span key={text} class="relative inline-block">
          <Tape kind={kind as "masking"} length={132} height={32} seed={text} class="absolute inset-0" />
          <span class="relative z-(--ll-z-prop) block w-[132px] text-center font-script text-2xl leading-[32px] font-bold">{text}</span>
        </span>)}
    </div>;
  };
});
export default Example;
