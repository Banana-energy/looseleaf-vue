// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Message, MessageContent } from "@/components/ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport, useMessageScrollerScrollable } from "@/components/ui/message-scroller";
export const meta = {
  title: "Scroll status" as const,
  description: "shadcn's `message-scroller-scrollable`: `useMessageScrollerScrollable` says whether there is more to scroll toward the start and toward the end, so the footer can tell the reader where they can go. The transcript opens at the start (`defaultScrollPosition=\"start\"`)." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 640
};
const messages = Array.from({
  length: 12
}, (_, index) => ({
  id: `scrollable-${index + 1}`,
  role: index % 2 === 0 ? "user" as const : "assistant" as const,
  text: index % 2 === 0 ? `Review scroll checkpoint ${index + 1}.` : `Checkpoint ${index + 1} is synced. The scrollable hook updates as the viewport moves.\n\nWhen the reader is at the first message, the footer should only point them down. Once they move into the middle of the transcript, it should explain that both directions are available.\n\nAt the latest message, the footer should switch again and only point them back up.`
})) satisfies Array<{
  id: string;
  role: "user" | "assistant";
  text: string;
}>;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-auto flex w-full max-w-sm flex-col gap-4">
      <Card class="h-140 w-full gap-0 overflow-hidden">
        <CardHeader class="gap-1 border-b">
          <CardTitle>Scroll Status</CardTitle>
          <CardDescription>Where the reader can go scroll to based on current scroll position.</CardDescription>
        </CardHeader>
        <MessageScrollerProvider defaultScrollPosition="start">
          <CardContent class="flex min-h-0 flex-1 overflow-hidden p-0">
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent class="gap-4">
                  <Transcript />
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </CardContent>
          <ScrollStateFooter />
        </MessageScrollerProvider>
      </Card>
      <div class="px-0.5 text-center text-xs text-muted-foreground">Scroll the transcript to see the footer update.</div>
    </div>;
  };
});
export default Example;
const Transcript = defineUi<{}>("Transcript", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return messages.map(message => {
      const mine = message.role === "user";
      return <MessageScrollerItem key={message.id} messageId={message.id} scrollAnchor={mine}>
        <Message align={mine ? "end" as const : "start" as const}>
          <MessageContent>
            <Bubble variant={mine ? "muted" as const : "ghost" as const}>
              <BubbleContent class="space-y-2">
                {message.text.split(/\n\s*\n/).map((paragraph, index) => <p key={index} class="whitespace-pre-wrap">
                    {paragraph}
                  </p>)}
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </MessageScrollerItem>;
    });
  };
});
const ScrollStateFooter = defineUi<{}>("ScrollStateFooter", [], (_props, {
  slots: _slots
}) => {
  const _hook0 = useMessageScrollerScrollable();
  const start = computed(() => _hook0.value.start);
  const end = computed(() => _hook0.value.end);
  return () => {
    return <CardFooter class="justify-center border-t text-center text-sm text-muted-foreground" role="status">
      {getScrollStatus({
        start: start.value,
        end: end.value
      })}
    </CardFooter>;
  };
});
function getScrollStatus({
  start,
  end
}: {
  start: boolean;
  end: boolean;
}) {
  if (start && end) {
    return "You can scroll both ways.";
  }
  if (end) {
    return "You are at the top. You can only scroll down.";
  }
  if (start) {
    return "You are at the bottom. You can only scroll up.";
  }
  return "All messages fit in the viewport.";
}
