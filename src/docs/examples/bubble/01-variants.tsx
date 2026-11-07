// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble";
export const meta = {
  title: "Variants" as const,
  description: "Marker, highlighter, paper shade, a marker wash, paper and a line, red pencil hatching, and nothing at all. The tail sits on the sender's side." as const,
  layout: "stack" as const
};
const SAYS = {
  default: "Can you add tags to my notes?" as const,
  secondary: "Tags, then a filter row above the list." as const,
  muted: "Sure. Give me a minute, I will look at the list first." as const,
  tinted: "Two tags per note is plenty, I think." as const,
  outline: "And a way to remove them again?" as const,
  destructive: "That would delete every tag. Are you sure?" as const
} as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <BubbleGroup class="mx-auto w-full max-w-lg gap-4 px-3 pb-4">
      {(Object.keys(SAYS) as Array<keyof typeof SAYS>).map((variant, i) => <Bubble key={variant} variant={variant} align={i % 2 ? "end" as const : "start" as const} tail>
          <BubbleContent seed={`variant-${variant}`}>{SAYS[variant]}</BubbleContent>
        </Bubble>)}
      <Bubble variant="ghost">
        <BubbleContent>Ghost bubbles are just the words, set in the same hand.</BubbleContent>
      </Bubble>
    </BubbleGroup>;
  };
});
export default Example;
