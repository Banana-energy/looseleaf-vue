// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { Bubble, BubbleContent, BubbleReactions } from "@/components/ui/bubble";
import { Message, MessageContent, MessageFooter, MessageGroup, MessageHeader } from "@/components/ui/message";
export const meta = {
  title: "Names, times and receipts" as const,
  description: "Header and footer are quiet hand notes. A reaction chip and a tick make a message look lived in." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <MessageGroup class="mx-auto w-full max-w-lg gap-6 px-3 pb-6">
      <Message>
        <MessageContent>
          <MessageHeader>
            <span class="text-foreground">Lin</span>
            <span class="font-normal">Thursday 9:12</span>
          </MessageHeader>
          <Bubble variant="secondary" class="mb-3">
            <BubbleContent seed="hf-1">The chips look great. Ship it after lunch?</BubbleContent>
            <BubbleReactions side="bottom" align="end">
              <Icon name="check" size={14} /> 2
            </BubbleReactions>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble variant="default">
            <BubbleContent seed="hf-2">After lunch, yes.</BubbleContent>
          </Bubble>
          <MessageFooter>
            <Icon name="check" size={14} /> seen 9:14
          </MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>;
  };
});
export default Example;
