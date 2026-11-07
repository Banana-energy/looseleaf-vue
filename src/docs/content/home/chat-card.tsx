// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message, MessageAvatar, MessageContent, MessageGroup, MessageHeader } from "@/components/ui/message";
import { Paper } from "@/components/ui/paper";
const ChatCard = defineUi<{}>("ChatCard", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper data-home="chat" stock="graph" tape="both" tapeKind="masking" seed="home-chat" class="w-full px-4 pt-7 pb-5">
      <MessageGroup role="group" class="gap-5" aria-label="A conversation with Sam">
        <Message align="end">
          <MessageContent>
            <MessageHeader class="justify-end">Ada</MessageHeader>
            <Bubble variant="default">
              <BubbleContent seed="home-chat-1">Can I keep my shadcn imports?</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message>
          <MessageAvatar>
            <Avatar>
              <AvatarFallback name="Sam Reyes" />
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>Sam</MessageHeader>
            <BubbleGroup>
              <Bubble variant="muted">
                <BubbleContent seed="home-chat-2">Yes. Same parts, same props, same Reka UI.</BubbleContent>
              </Bubble>
              <Bubble variant="muted">
                <BubbleContent seed="home-chat-3">Swap the file, keep your JSX.</BubbleContent>
              </Bubble>
            </BubbleGroup>
          </MessageContent>
        </Message>
      </MessageGroup>
    </Paper>;
  };
});
export default ChatCard;
