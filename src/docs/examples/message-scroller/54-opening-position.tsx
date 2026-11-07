// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Message, MessageContent } from "@/components/ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "@/components/ui/message-scroller";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
export const meta = {
  title: "Opening position" as const,
  description: "shadcn's `message-scroller-opening-position`: where a saved transcript opens. `start` shows the first message, `end` the newest, and `last-anchor` puts the last message you sent at the top, which is usually where you stopped. The provider is keyed on the choice so it opens afresh each time. (The original uses Tabs with no panels, which axe flags; a toggle group is the right control for a choice with no content behind it.)" as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 640
};
type Position = "start" | "end" | "last-anchor";
const messages = [{
  id: "open-1" as const,
  role: "user" as const,
  text: "This is the first message the user sent in the conversation." as const
}, {
  id: "open-2" as const,
  role: "assistant" as const,
  text: "Workspace creation rose 8%, but first invite completion only rose 2%." as const
}, {
  id: "open-3" as const,
  role: "user" as const,
  text: "This is the last message the user sent in the conversation." as const
}, {
  id: "open-4" as const,
  role: "assistant" as const,
  text: "Start with the invite step. Teams are creating workspaces but waiting to add collaborators.\n\nRecommended follow-up:\n\n1. Compare invite drop-off by account size.\n2. Check whether users who skip invites still return within 24 hours.\n3. Review the empty-state copy on the first project screen.\n4. Segment activation by template, since template users may not need invites right away.\n\nIf that pattern holds, the next experiment should make collaboration useful earlier instead of prompting for invites harder." as const
}] satisfies Array<{
  id: string;
  role: "user" | "assistant";
  text: string;
}>;
const positions = ["start", "end", "last-anchor"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const position = shallowRef<Position>(initialState("last-anchor"));
  const setPosition = stateSetter(position);
  return () => {
    return <div class="relative mx-auto flex w-full max-w-sm flex-col gap-4">
      <Card class="h-140 w-full gap-0">
        <CardHeader class="gap-1 border-b">
          <CardTitle>Opening Position</CardTitle>
          <CardDescription>Choose where a saved transcript opens.</CardDescription>
        </CardHeader>
        <CardContent class="flex min-h-0 flex-1 overflow-hidden p-0">
          <MessageScrollerProvider key={position.value} defaultScrollPosition={position.value}>
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent>
                  {messages.map(message => {
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
                  })}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>
        </CardContent>
        <CardFooter class="flex items-center justify-center border-t">
          <ToggleGroup type="single" aria-label="Opening position" value={position.value} onValueChange={value => {
            if (value) setPosition(value as Position);
          }} class="w-full">
            {positions.map(option => <ToggleGroupItem key={option} value={option} class="flex-1">
                {option}
              </ToggleGroupItem>)}
          </ToggleGroup>
        </CardFooter>
      </Card>
      <div class="px-0.5 text-center text-xs text-muted-foreground">Toggle the defaultScrollPosition to see where the transcript starts when you open the thread.</div>
    </div>;
  };
});
export default Example;
