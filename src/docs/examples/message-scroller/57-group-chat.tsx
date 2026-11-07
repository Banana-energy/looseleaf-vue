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
import { Icon } from "@/components/ui/icon";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { Message, MessageContent, MessageHeader } from "@/components/ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "@/components/ui/message-scroller";
export const meta = {
  title: "Group chat" as const,
  description: "shadcn's `message-scroller-group-chat`: several speakers and an assistant, and a Marker that is itself the anchor. When Rocky joins, the marker (`scrollAnchor` on its MessageScrollerItem) settles near the top and his reply arrives beneath it. Your own lines are on the right, the assistant is unframed, the others are tinted." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 680
};
type GroupChatItem = {
  id: string;
  type: "event";
  text: string;
  scrollAnchor?: boolean;
} | {
  id: string;
  type: "message";
  sender: string;
  role: "assistant" | "participant";
  text: string;
  scrollAnchor?: boolean;
};
const currentUser = "Grace";
const initialItems = [{
  id: "group-1" as const,
  type: "message" as const,
  sender: "Grace" as const,
  role: "participant" as const,
  text: "@mary, the astrophage line keeps matching Venus energy output. Can you check my math?" as const
}, {
  id: "group-2" as const,
  type: "message" as const,
  sender: "Mary (Agent)" as const,
  role: "assistant" as const,
  text: "Yes. Confirmed. The curve points to a microorganism harvesting stellar energy and breeding near carbon dioxide. If @rocky agrees, this is the clue we need." as const
}, {
  id: "group-3" as const,
  type: "message" as const,
  sender: "Grace" as const,
  role: "participant" as const,
  text: "ping @rocky" as const,
  scrollAnchor: true
}] satisfies GroupChatItem[];
const rockyMarker = {
  id: "group-4" as const,
  type: "event" as const,
  text: "Rocky has joined the chat" as const,
  scrollAnchor: true
} satisfies GroupChatItem;
const rockyMessage = {
  id: "group-5" as const,
  type: "message" as const,
  sender: "Rocky" as const,
  role: "participant" as const,
  text: "Amaze. Astrophage eats light, makes heat, goes to carbon dioxide. Rocky has fuel model. Grace is smart." as const
} satisfies GroupChatItem;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const demoKey = shallowRef(initialState(0));
  const setDemoKey = stateSetter(demoKey);
  const rockyTurn = shallowRef<"idle" | "marker" | "message">(initialState("idle"));
  const setRockyTurn = stateSetter(rockyTurn);
  const items = computed(() => rockyTurn.value === "message" ? [...initialItems, rockyMarker, rockyMessage] : rockyTurn.value === "marker" ? [...initialItems, rockyMarker] : initialItems);
  const buttonLabel = computed(() => rockyTurn.value === "idle" ? "Add Rocky" as const : "Send Message as Rocky" as const);
  const isComplete = computed(() => rockyTurn.value === "message");
  return () => {
    return <div class="relative mx-auto flex w-full max-w-sm flex-col gap-4">
      <Card class="h-140 w-full gap-0">
        <CardHeader class="gap-1 border-b">
          <CardTitle>Group Chat</CardTitle>
          <CardDescription>A group chat with several participants and an assistant. The Marker is marked as a turn.</CardDescription>
          <CardAction>
            <Button type="button" variant="outline" size="icon" aria-label="Reset conversation" title="Reset" disabled={rockyTurn.value === "idle"} onClick={() => {
              setRockyTurn("idle");
              setDemoKey(key => key + 1);
            }}>
              <Icon name="rotate-cw" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent class="flex min-h-0 flex-1 overflow-hidden p-0">
          <MessageScrollerProvider key={demoKey.value}>
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent>
                  {items.value.map(item => item.type === "message" ? <GroupChatMessage key={item.id} item={item} /> : <GroupChatMarker key={item.id} item={item} scrollAnchor={item.scrollAnchor} />)}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>
        </CardContent>
        <CardFooter class="flex flex-col items-center gap-2 border-t">
          <Button type="button" disabled={isComplete.value} onClick={() => setRockyTurn(turn => turn === "idle" ? "marker" as const : "message" as const)} class="w-full" variant="secondary">
            {buttonLabel.value}
          </Button>
          <p class="text-xs text-muted-foreground">
            {rockyTurn.value === "idle" ? "This will create a marker and make it the anchor" as const : "Now send Rocky's reply into the conversation" as const}
          </p>
        </CardFooter>
      </Card>
      <div class="px-0.5 text-center text-xs text-balance text-muted-foreground">When a user joins, a marker is created. scrollAnchor on the marker marks it as the next turn.</div>
    </div>;
  };
});
export default Example;
const GroupChatMessage = defineUi<{
  item: Extract<GroupChatItem, {
    type: "message";
  }>;
}>("GroupChatMessage", ["item"], (_props, {
  slots: _slots
}) => {
  const item = computed(() => _props["item"]);
  const isCurrentUser = computed(() => item.value.sender === currentUser);
  const variant = computed(() => isCurrentUser.value ? "muted" as const : item.value.role === "assistant" ? "ghost" as const : "tinted" as const);
  return () => {
    return <MessageScrollerItem messageId={item.value.id} scrollAnchor={item.value.scrollAnchor}>
      <Message align={isCurrentUser.value ? "end" as const : "start" as const}>
        <MessageContent>
          {!isCurrentUser.value && <MessageHeader>{item.value.sender}</MessageHeader>}
          <Bubble variant={variant.value}>
            <BubbleContent>{item.value.text}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageScrollerItem>;
  };
});
const GroupChatMarker = defineUi<{
  item: Extract<GroupChatItem, {
    type: "event";
  }>;
  scrollAnchor?: boolean;
}>("GroupChatMarker", ["item", "scrollAnchor"], (_props, {
  slots: _slots
}) => {
  const item = computed(() => _props["item"]);
  const scrollAnchor = computed(() => _props["scrollAnchor"] === undefined ? false : _props["scrollAnchor"]);
  return () => {
    return <MessageScrollerItem scrollAnchor={scrollAnchor.value}>
      <Marker variant="separator">
        <MarkerContent>{item.value.text}</MarkerContent>
      </Marker>
    </MessageScrollerItem>;
  };
});
