// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Circled } from "@/components/ui/circled";
export const meta = {
  title: "The answer key" as const,
  description: "Mark the right answer, written on with the pen. The circle is decoration: the answer is also given in words." as const,
  layout: "stack" as const,
  height: 240
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const show = shallowRef(initialState(false));
  const setShow = stateSetter(show);
  return () => {
    return <div class="grid w-full max-w-sm gap-4">
      <p class="font-script text-2xl">Which of these is a fine-liner?</p>
      <ul class="grid gap-2.5 py-1 text-[17px]">
        <li>a) A chisel-tip marker</li>
        <li>
          <Circled animate show={show.value} tone="red">
            b) A 0.4 mm felt pen
          </Circled>
        </li>
        <li>c) A stick of graphite</li>
      </ul>
      <Button variant="outline" size="sm" class="w-fit" aria-pressed={show.value} onClick={() => setShow(s => !s)}>
        {show.value ? "Hide the answer (b)" as const : "Show the answer" as const}
      </Button>
    </div>;
  };
});
export default Example;
