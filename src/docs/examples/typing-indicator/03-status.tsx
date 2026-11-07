// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Mascot } from "@/components/ui/mascot";
import { Message, MessageAvatar, MessageContent, MessageHeader } from "@/components/ui/message";
import { TypingIndicator } from "@/components/ui/typing-indicator";
export const meta = {
  title: "Who is typing" as const,
  description: "A message row with an avatar, a header and the indicator in blue felt for the person on the other end. The label names them for screen readers." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-auto flex w-full max-w-sm flex-col gap-4 px-4 pb-4">
      <Message>
        <MessageAvatar>
          <Mascot pose="write" size={40} seed="ti-mascot" />
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Stubby</MessageHeader>
          <Bubble variant="muted">
            <BubbleContent seed="ti-3">
              <TypingIndicator variant="squiggle" label="Stubby is writing a reply" seed="ti-3" />
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent>
          <MessageHeader>Lin</MessageHeader>
          <Bubble variant="outline" pen="you">
            <BubbleContent seed="ti-4">
              <TypingIndicator pen="you" label="Lin is typing" seed="ti-4" />
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>;
  };
});
export default Example;
