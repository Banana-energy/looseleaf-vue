// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { CodeBlock } from "@/components/ui/code-block";
import { Message, MessageContent, MessageHeader } from "@/components/ui/message";
export const meta = {
  title: "In a reply" as const,
  description: "A code slip inside a message: it takes the width of the column and scrolls sideways when a line is long." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Message class="mx-auto max-w-lg px-3 pt-4 pb-4">
      <MessageContent>
        <MessageHeader>Stubby</MessageHeader>
        <Bubble variant="ghost" class="max-w-full">
          <BubbleContent>Here is the one-line fix:</BubbleContent>
        </Bubble>
        <CodeBlock diff language="ts" filename="filter.ts" seed="chat" code={`-export const label = "all";
+export const label = picked.size ? "filtered" : "all";`} />
      </MessageContent>
    </Message>;
  };
});
export default Example;
