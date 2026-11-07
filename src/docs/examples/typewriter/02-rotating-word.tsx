// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Typewriter } from "@/components/ui/typewriter";
export const meta = {
  title: "A rotating word" as const,
  description: "mode=\"cycle\" types a word, holds it, backspaces it and moves on; loop keeps it going. A block caret, and the sentence still reads once to a screen reader." as const,
  layout: "center" as const,
  height: 160
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <p class="text-center font-script text-4xl leading-tight">
      We make{" "}
      <span class="inline-block w-[11em] text-start align-baseline">
        <Typewriter text={["notebooks", "stickers", "tape", "small good things"]} mode="cycle" loop cursor="block" pause={1100} speed={14} class="text-orange-text" startOnView={false} />
      </span>
    </p>;
  };
});
export default Example;
