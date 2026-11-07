// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Message, MessageContent } from "@/components/ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport, useMessageScroller, useMessageScrollerVisibility } from "@/components/ui/message-scroller";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
export const meta = {
  title: "Transcript outline" as const,
  description: "shadcn's `message-scroller-visibility`: `useMessageScrollerVisibility` reports the anchor (the last user turn scrolled past the top) and `scrollToMessage` jumps to a turn. The ticks in the header are the outline; open them (click, Enter or Space) for the list. The original opens it on hover beside the card, which a keyboard cannot; a popover can be tabbed into." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 680
};
const messages = [{
  id: "vis-brief" as const,
  role: "user" as const,
  text: "Review the incident handoff and tell me what to read first." as const
}, {
  id: "vis-brief-reply" as const,
  role: "assistant" as const,
  text: "Start with the summary and the impact section. The regression affected the upload queue, but the recovery path completed for every queued job." as const
}, {
  id: "vis-impact" as const,
  role: "user" as const,
  text: "What was the customer impact?" as const
}, {
  id: "vis-impact-reply" as const,
  role: "assistant" as const,
  text: "Impact was limited to delayed processing.\n\nNo records were dropped, and the reconciliation worker confirmed each retry batch. Support saw confusion from two customers, but there were no checkout or billing errors." as const
}, {
  id: "vis-actions" as const,
  role: "user" as const,
  text: "What actions are open?" as const
}, {
  id: "vis-actions-reply" as const,
  role: "assistant" as const,
  text: "Keep the retry window enabled until the next deploy, then add a queue-depth alert as the long-term fix.\n\nThe alert should fire on sustained queue growth, not a single short spike." as const
}, {
  id: "vis-checklist" as const,
  role: "user" as const,
  text: "Give me the follow-up checklist." as const
}, {
  id: "vis-checklist-reply" as const,
  role: "assistant" as const,
  text: "Compare the queue recovery graph with the deploy timeline so the handoff shows exactly when processing returned to baseline.\n\nAdd a short owner note beside each follow-up item, so the retry-window decision, alert tuning and support macro do not drift into separate conversations.\n\nKeep the retry window enabled until the next deploy, then add a queue-depth alert as the long-term fix." as const
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
    return <MessageScrollerProvider scrollMargin={12}>
      <div class="relative mx-auto flex w-full max-w-sm flex-col gap-4">
        <Card class="h-140 w-full gap-0">
          <CardHeader class="gap-1 border-b">
            <CardTitle>Transcript Outline</CardTitle>
            <CardDescription>Track the current anchored turn.</CardDescription>
            <CardAction>
              <TranscriptOutline />
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
        <div class="px-0.5 text-center text-xs text-muted-foreground">Open the outline to jump between anchored turns as you read.</div>
      </div>
    </MessageScrollerProvider>;
  };
});
export default Example;
const TranscriptOutline = defineUi<{}>("TranscriptOutline", [], (_props, {
  slots: _slots
}) => {
  const _hook0 = useMessageScroller();
  const scrollToMessage = computed(() => _hook0.value.scrollToMessage);
  const _hook2 = useMessageScrollerVisibility();
  const currentAnchorId = computed(() => _hook2.value.currentAnchorId);
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  return () => {
    return <Popover open={open.value} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" aria-label="Open transcript outline" class="flex h-9 w-9 flex-col items-center justify-center gap-1 outline-offset-2 focus-visible:outline-2 focus-visible:outline-focus">
          {userMessages.map((message, i) => <span key={message.id} data-current={message.id === currentAnchorId.value} style={cssStyle({
            rotate: `${i * 7 % 5 - 2}deg`
          })} class="h-0.5 w-3.5 rounded-full bg-pencil/60 data-[current=true]:h-[3px] data-[current=true]:w-5 data-[current=true]:bg-foreground" />)}
        </button>
      </PopoverTrigger>
      <PopoverContent align="center" side="left" aria-label="Transcript outline" class="flex w-64 flex-col gap-1 p-1">
        {userMessages.map(message => <button key={message.id} type="button" aria-current={currentAnchorId.value === message.id ? "location" as const : undefined} class="flex min-h-7 items-center px-2 py-1.5 text-start text-sm outline-none hover:ll-swipe focus-visible:ll-swipe aria-current:ll-swipe aria-current:font-bold" onClick={() => {
          scrollToMessage.value(message.id, {
            align: "start" as const,
            behavior: "smooth" as const
          });
          setOpen(false);
        }}>
            <span class="line-clamp-1 min-w-0">{message.text.length > 42 ? `${message.text.slice(0, 39)}...` : message.text}</span>
          </button>)}
      </PopoverContent>
    </Popover>;
  };
});
