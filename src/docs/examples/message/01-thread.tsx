// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble";
import { Mascot } from "@/components/ui/mascot";
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } from "@/components/ui/message";
export const meta = {
  title: "A thread" as const,
  description: "Two speakers. The footer of the first message rides above the avatar, so the avatar keeps standing beside the last bubble." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <MessageGroup class="mx-auto w-full max-w-lg gap-5 px-3 pb-4">
      <Message align="end">
        <MessageContent>
          <MessageHeader class="justify-end">Ada</MessageHeader>
          <Bubble variant="default">
            <BubbleContent seed="thread-1">Which of these should I fix first?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageAvatar>
          <Mascot pose="write" size={40} seed="thread-mascot" />
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Stubby</MessageHeader>
          <BubbleGroup>
            <Bubble variant="muted">
              <BubbleContent seed="thread-2">The failing test. Everything else can wait until it is green.</BubbleContent>
            </Bubble>
            <Bubble variant="muted">
              <BubbleContent seed="thread-3">It is a one-line fix in filter.ts.</BubbleContent>
            </Bubble>
          </BubbleGroup>
          <MessageFooter>edited a minute ago</MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>;
  };
});
export default Example;
