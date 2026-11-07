// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble";
import { Mascot } from "@/components/ui/mascot";
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } from "@/components/ui/message";
export const meta = {
  title: "A conversation" as const,
  description: "Bubbles inside Messages: the tail follows the sender, the earlier bubbles of a run lose theirs, a reaction chip sits on the edge, and the header and footer are hand notes." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <MessageGroup class="mx-auto w-full max-w-lg gap-5 px-3 pb-6">
      <Message>
        <MessageAvatar>
          <Mascot pose="idle" size={36} seed="stubby" />
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>
            Stubby <span class="font-normal">9:41</span>
          </MessageHeader>
          <BubbleGroup>
            <Bubble variant="muted">
              <BubbleContent seed="a1">I read src/notes/list.tsx first.</BubbleContent>
            </Bubble>
            <Bubble variant="muted" class="mb-2">
              <BubbleContent seed="a2">Tags become a string array on Note, with a chip row above the list. Want me to draw the chips small?</BubbleContent>
              <BubbleReactions align="start">+1</BubbleReactions>
            </Bubble>
          </BubbleGroup>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <MessageHeader class="justify-end">you</MessageHeader>
          <BubbleGroup>
            <Bubble variant="default">
              <BubbleContent seed="u1">Yes, small. And can you put the filter row above the list?</BubbleContent>
            </Bubble>
            <Bubble variant="default">
              <BubbleContent seed="u2">Thank you!</BubbleContent>
            </Bubble>
          </BubbleGroup>
          <MessageFooter>seen</MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>;
  };
});
export default Example;
