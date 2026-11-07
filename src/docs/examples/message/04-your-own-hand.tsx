// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Mascot } from "@/components/ui/mascot";
import { Message, MessageAvatar, MessageContent, MessageGroup, MessageHeader, MessageText } from "@/components/ui/message";
export const meta = {
  title: "In your own hand" as const,
  description: "`pen=\"you\"` sets a bubble in blue felt and the script face. MessageText keeps its words plain inline text with a baseline offset and a lighter ink, so the tall last letters of a script face (d, l, e, !) are whole." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <MessageGroup class="mx-auto w-full max-w-lg gap-5 px-3 pb-4">
      <Message align="end">
        <MessageContent>
          <MessageHeader class="justify-end">you</MessageHeader>
          <Bubble variant="tinted" pen="you">
            <BubbleContent seed="hand-1">
              <MessageText seed="hand-words-1">Call me when the old road is closed, and bring the good umbrella!</MessageText>
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageAvatar>
          <Mascot pose="write" size={40} seed="hand-mascot" />
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Stubby</MessageHeader>
          <Bubble variant="muted">
            <BubbleContent seed="hand-2">
              <MessageText seed="hand-words-2">Noted. I will call at six and read you the whole plan aloud.</MessageText>
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>;
  };
});
export default Example;
