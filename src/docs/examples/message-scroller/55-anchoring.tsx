// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Message, MessageContent } from "@/components/ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "@/components/ui/message-scroller";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
export const meta = {
  title: "Anchoring turns" as const,
  description: "shadcn's `message-scroller-anchoring`: `scrollAnchor` decides which message settles near the top when it arrives. Pick User or Assistant, send the scripted turns, and watch where each new one lands. Changing the role starts the transcript over." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 680
};
type AnchorRole = "user" | "assistant";
type ChatMessage = {
  id: string;
  role: AnchorRole;
  text: string;
};
const scriptedMessages: ChatMessage[] = [{
  id: "anchor-1-user" as const,
  role: "user" as const,
  text: "Can you show me how anchoring behaves when a new prompt starts the turn?" as const
}, {
  id: "anchor-1-assistant" as const,
  role: "assistant" as const,
  text: "Append the user prompt first, then append the assistant response. With User selected, the prompt settles near the top and the assistant response fills in below it." as const
}, {
  id: "anchor-2-user" as const,
  role: "user" as const,
  text: "What changes when assistant messages are the anchor?" as const
}, {
  id: "anchor-2-assistant" as const,
  role: "assistant" as const,
  text: "Now each assistant response is the item MessageScroller keeps in view. This is useful when the reply is the moment you want readers to land on after each turn." as const
}, {
  id: "anchor-3-user" as const,
  role: "user" as const,
  text: "Can I switch roles and keep adding turns?" as const
}, {
  id: "anchor-3-assistant" as const,
  role: "assistant" as const,
  text: "Yes. The next appended message with the selected role becomes the anchor, so you can compare user and assistant anchoring without resetting the demo." as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const anchorRole = shallowRef<AnchorRole>(initialState("user"));
  const setAnchorRole = stateSetter(anchorRole);
  const messages = shallowRef<ChatMessage[]>(initialState([]));
  const setMessages = stateSetter(messages);
  const messageIndex = shallowRef(initialState(0));
  const setMessageIndex = stateSetter(messageIndex);
  const nextMessage = computed(() => scriptedMessages[messageIndex.value]);
  return () => {
    return <div class="relative mx-auto flex w-full max-w-sm flex-col gap-4">
      <Card class="h-140 w-full gap-0">
        <CardHeader class="gap-1 border-b">
          <CardTitle>Anchoring Turns</CardTitle>
          <CardDescription>Choose which role settles near the top edge.</CardDescription>
          <CardAction>
            <Button type="button" variant="outline" size="icon" aria-label="Reset anchored turns" disabled={messages.value.length === 0} onClick={() => {
              setMessages([]);
              setMessageIndex(0);
            }}>
              <Icon name="rotate-cw" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent class="flex min-h-0 flex-1 overflow-hidden p-0">
          {messages.value.length === 0 ? <Empty class="h-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Icon name="message-circle" />
                </EmptyMedia>
                <EmptyTitle>No anchored messages yet</EmptyTitle>
                <EmptyDescription>Send the first message to see the selected role anchor.</EmptyDescription>
              </EmptyHeader>
            </Empty> : <MessageScrollerProvider>
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent>
                    {messages.value.map(message => {
                    const mine = message.role === "user";
                    return <MessageScrollerItem key={message.id} messageId={message.id} scrollAnchor={message.role === anchorRole.value}>
                          <Message align={mine ? "end" as const : "start" as const}>
                            <MessageContent>
                              <Bubble variant={mine ? "muted" as const : "ghost" as const}>
                                <BubbleContent>{message.text}</BubbleContent>
                              </Bubble>
                            </MessageContent>
                          </Message>
                        </MessageScrollerItem>;
                  })}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </MessageScrollerProvider>}
        </CardContent>
        <CardFooter>
          <ToggleGroup type="single" aria-label="Select scroll anchor role" value={anchorRole.value} onValueChange={value => {
            if (value === "user" || value === "assistant") {
              setAnchorRole(value);
              setMessages([]);
              setMessageIndex(0);
            }
          }}>
            <ToggleGroupItem value="user" aria-label="Anchor user messages">
              User
            </ToggleGroupItem>
            <ToggleGroupItem value="assistant" aria-label="Anchor assistant messages">
              Assistant
            </ToggleGroupItem>
          </ToggleGroup>
          <Button type="button" size="icon" class="ms-auto" disabled={!nextMessage.value} onClick={() => {
            if (!nextMessage.value) {
              return;
            }
            setMessages(messages => [...messages, nextMessage.value]);
            setMessageIndex(index => index + 1);
          }}>
            <Icon name="arrow-up" />
            <span class="sr-only">Send Message</span>
          </Button>
        </CardFooter>
      </Card>
      <div class="mx-auto max-w-xs px-0.5 text-center text-xs text-muted-foreground">Toggle the anchor role, then send messages to compare where turns settle.</div>
    </div>;
  };
});
export default Example;
