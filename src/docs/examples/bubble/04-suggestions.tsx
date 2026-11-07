// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
export const meta = {
  title: "Bubbles as buttons" as const,
  description: "asChild turns a bubble into a real button: it wobbles on hover (drop-lines), draws a blue ring on keyboard focus, and can be pressed. Good for suggested replies." as const,
  layout: "stack" as const
};
const REPLIES = ["Show me the diff", "Run the tests", "Not now, thanks"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const picked = shallowRef<string | null>(initialState(null));
  const setPicked = stateSetter(picked);
  return () => {
    return <div class="mx-auto flex w-full max-w-lg flex-col items-end gap-3 px-4 pb-6">
      {REPLIES.map(reply => <Bubble key={reply} variant="outline" align="end" tail={false}>
          <BubbleContent asChild seed={reply}>
            <button type="button" aria-pressed={picked.value === reply} onClick={() => setPicked(reply)}>
              {reply}
            </button>
          </BubbleContent>
        </Bubble>)}
      <p role="status" class="min-h-6 text-sm text-muted-foreground">
        {picked.value ? `You picked "${picked.value}"` : "Pick a reply" as const}
      </p>
    </div>;
  };
});
export default Example;
