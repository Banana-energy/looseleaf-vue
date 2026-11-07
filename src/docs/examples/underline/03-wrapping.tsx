// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Underline } from "@/components/ui/underline";
export const meta = {
  title: "Wraps, and draws on" as const,
  description: "An underline that wraps onto several lines is one pull per line. Press replay to watch it being drawn." as const,
  layout: "stack" as const,
  height: 220
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const on = shallowRef(initialState(true));
  const setOn = stateSetter(on);
  return () => {
    return <div class="grid max-w-sm gap-4">
      <p class="text-[17px] leading-[1.55]">
        A book is a conversation with someone who cannot answer back, so{" "}
        <Underline animate show={on.value} kind="wavy" tone="blue">
          talk back in the margin, argue with the author, and write down where you stopped believing them
        </Underline>
        , then close it.
      </p>
      <Button variant="outline" size="sm" class="w-fit" onClick={() => {
        setOn(false);
        setTimeout(() => setOn(true), 60);
      }}>
        Replay
      </Button>
    </div>;
  };
});
export default Example;
