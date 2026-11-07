// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Message, MessageContent } from "@/components/ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport, useMessageScroller } from "@/components/ui/message-scroller";
export const meta = {
  title: "Commands" as const,
  description: "shadcn's `message-scroller-commands`: `useMessageScroller` gives `scrollToMessage`, `scrollToStart` and `scrollToEnd` to anything inside the provider, so a menu in the card header can drive the transcript. Choose a question and it slides to the top of the view." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 680
};
const messages = [{
  id: "command-activation" as const,
  role: "user" as const,
  text: "We're seeing activation dip after workspace creation. Can you help me find the likely step?" as const
}, {
  id: "command-activation-reply" as const,
  role: "assistant" as const,
  text: "The sharpest drop is between creating the workspace and inviting the first teammate.\n\nWorkspace creation is still healthy, but the invite step is where users pause. That suggests the product is asking for collaboration before the user has enough confidence in the workspace." as const
}, {
  id: "command-compare" as const,
  role: "user" as const,
  text: "What should I compare before we change the onboarding flow?" as const
}, {
  id: "command-compare-reply" as const,
  role: "assistant" as const,
  text: "Compare three cohorts:\n\n1. Users who choose a template before inviting teammates.\n2. Users who start from a blank workspace.\n3. Users who skip invites and return within 24 hours.\n\nIf template users invite faster, the fix is probably better first-run guidance rather than a louder invite prompt." as const
}, {
  id: "command-experiment" as const,
  role: "user" as const,
  text: "Can you turn that into an experiment?" as const
}, {
  id: "command-experiment-reply" as const,
  role: "assistant" as const,
  text: "Yes. Create a variant that shows a short checklist after workspace creation:\n\n- Pick a template.\n- Add one project detail.\n- Invite a teammate when the workspace has context.\n\nMeasure first invite completion, 24-hour return rate, and whether teams create a second project." as const
}, {
  id: "command-risk" as const,
  role: "user" as const,
  text: "What's the risk if we delay the invite prompt?" as const
}, {
  id: "command-risk-reply" as const,
  role: "assistant" as const,
  text: "The main risk is reducing team creation for accounts that already know who they want to invite.\n\nTo protect that path, keep the invite action visible in the header and only change the primary empty-state guidance." as const
}] satisfies Array<{
  id: string;
  role: "user" | "assistant";
  text: string;
}>;
const userMessages = messages.filter(message => message.role === "user");
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <MessageScrollerProvider defaultScrollPosition="end">
      <div class="relative mx-auto flex w-full max-w-sm flex-col gap-4">
        <Card class="h-140 w-full gap-0">
          <CardHeader class="gap-1 border-b">
            <CardTitle>Commands</CardTitle>
            <CardDescription>Drive the transcript from outside.</CardDescription>
            <CardAction>
              <CommandMenu />
            </CardAction>
          </CardHeader>
          <CardContent class="flex min-h-0 flex-1 overflow-hidden p-0">
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
          </CardContent>
        </Card>
        <div class="px-0.5 text-center text-xs text-balance text-muted-foreground">Use the controls to jump to any message in the conversation.</div>
      </div>
    </MessageScrollerProvider>;
  };
});
export default Example;
const CommandMenu = defineUi<{}>("CommandMenu", [], (_props, {
  slots: _slots
}) => {
  const _hook0 = useMessageScroller();
  const scrollToMessage = computed(() => _hook0.value.scrollToMessage);
  return () => {
    return <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="secondary">
          Jump to...
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" class="w-64">
        <DropdownMenuLabel>Conversations</DropdownMenuLabel>
        {userMessages.map(message => <DropdownMenuItem key={message.id} onSelect={() => scrollToMessage.value(message.id, {
          align: "start" as const,
          behavior: "smooth" as const
        })}>
            <span class="line-clamp-1 min-w-0">{message.text.length > 42 ? `${message.text.slice(0, 39)}...` : message.text}</span>
          </DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>;
  };
});
