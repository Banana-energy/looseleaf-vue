// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { TypingIndicator } from "@/components/ui/typing-indicator";
export const meta = {
  title: "Inside a bubble" as const,
  description: "Put it in a BubbleContent and the bubble draws itself round it. Keep the region mounted and exposed (hide the bubble with sr-only, never display: none) and toggle `active`, so assistive tech announces it." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const typing = shallowRef(initialState(true));
  const setTyping = stateSetter(typing);
  return () => {
    return <div class="mx-auto flex w-full max-w-sm flex-col items-start gap-4 px-4 pb-4">
      <Bubble variant="muted">
        <BubbleContent seed="ti-1">Let me look at that...</BubbleContent>
      </Bubble>
      <div class={typing.value ? undefined : "sr-only" as const}>
        <Bubble variant="muted">
          <BubbleContent seed="ti-2">
            <TypingIndicator active={typing.value} label="Stubby is typing" seed="ti" />
          </BubbleContent>
        </Bubble>
      </div>
      <Button variant="ghost" size="sm" onClick={() => setTyping(t => !t)}>
        {typing.value ? "Stop typing" as const : "Start typing" as const}
      </Button>
    </div>;
  };
});
export default Example;
