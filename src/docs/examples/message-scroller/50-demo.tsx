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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { Message, MessageContent, MessageText } from "@/components/ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "@/components/ui/message-scroller";
export const meta = {
  title: "Scripted chat" as const,
  description: "shadcn's `message-scroller-demo`: a whole chat around the scroller. Send plays the next line of a script; your message settles near the top (`scrollAnchor`), the reply streams in below it and the view follows it (`autoScroll`) until you scroll up. The original drives this with the AI SDK; here a few lines of state and a timer stand in for the model." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 680
};
type Turn = {
  id: string;
  role: "user" | "assistant";
  text: string;
};
const SCRIPT: Turn[] = [{
  id: "u1" as const,
  role: "user" as const,
  text: "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI streams a reply, the whole thread jumps around." as const
}, {
  id: "a1" as const,
  role: "assistant" as const,
  text: "That's the classic streaming scroll problem. Wrap your message list in MessageScroller and turn on autoScroll: the viewport pins to the bottom as words arrive, so the reader sees each one land in place.\n\nIt only follows while the reader is already at the bottom. The moment they scroll up, it backs off and their place is kept." as const
}, {
  id: "u2" as const,
  role: "user" as const,
  text: "Okay, but when someone sends a new message the view still feels jarring, like the whole conversation reloads from the top." as const
}, {
  id: "a2" as const,
  role: "assistant" as const,
  text: "MessageScrollerItem fixes that with turn anchoring. Set scrollAnchor on the turn that should settle near the top instead of snapping to the bottom.\n\nA small peek of the previous exchange stays visible above the anchor, so context isn't lost." as const
}, {
  id: "u3" as const,
  role: "user" as const,
  text: "Last one: does this work with assistive tech?" as const
}, {
  id: "a3" as const,
  role: "assistant" as const,
  text: "MessageScrollerContent is a log with aria-relevant additions, so new messages are announced. The jump button is a real button, and it leaves the tab order when you are already at the end." as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const messages = shallowRef<Turn[]>(initialState([]));
  const setMessages = stateSetter(messages);
  const streaming = shallowRef(initialState(false));
  const setStreaming = stateSetter(streaming);
  const run = shallowRef(initialState(0));
  const setRun = stateSetter(run);
  const timer = shallowRef(0);
  watchDependencies(() => () => window.clearInterval(timer.value), () => [], false);
  const next = computed(() => SCRIPT.find(t => t.role === "user" && !messages.value.some(m => m.id === t.id)));
  return () => {
    function send() {
      if (!next.value || streaming.value) return;
      const reply = SCRIPT[SCRIPT.indexOf(next.value) + 1];
      const words = reply.text.split(" ");
      let n = 0;
      setMessages(m => [...m, next.value, {
        ...reply,
        text: "" as const
      }]);
      setStreaming(true);
      timer.value = window.setInterval(() => {
        n += 1;
        setMessages(m => m.map(x => x.id === reply.id ? {
          ...x,
          text: words.slice(0, n).join(" ")
        } : x));
        if (n >= words.length) {
          window.clearInterval(timer.value);
          setStreaming(false);
        }
      }, 45);
    }
    function reset() {
      window.clearInterval(timer.value);
      setStreaming(false);
      setMessages([]);
      setRun(r => r + 1);
    }
    return <div class="relative flex w-full max-w-sm flex-col gap-4">
      <Card class="mx-auto h-140 w-full gap-0">
        <CardHeader class="gap-1 border-b">
          <CardTitle>New Chat</CardTitle>
          <CardDescription>How can I help you today?</CardDescription>
          <CardAction>
            <Button variant="outline" size="icon" aria-label="Reset conversation" title="Reset" onClick={reset} disabled={streaming.value}>
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
                <EmptyTitle>Morning, Ada!</EmptyTitle>
                <EmptyDescription>What are we working on today? Press send to start a new conversation</EmptyDescription>
              </EmptyHeader>
            </Empty> : <MessageScrollerProvider key={run.value} autoScroll>
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent aria-busy={streaming.value}>
                    {messages.value.map((turn, i) => {
                    const mine = turn.role === "user";
                    return <MessageScrollerItem key={turn.id} messageId={turn.id} scrollAnchor={mine}>
                          <Message align={mine ? "end" as const : "start" as const}>
                            <MessageContent>
                              <Bubble variant={mine ? "muted" as const : "ghost" as const}>
                                <BubbleContent class="space-y-2">
                                  <MessageText streaming={streaming.value && i === messages.value.length - 1} seed={turn.id}>
                                    {turn.text}
                                  </MessageText>
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
            </MessageScrollerProvider>}
        </CardContent>
        <CardFooter class="flex-col gap-2">
          <form onSubmit={(e: SubmitEvent) => {
            e.preventDefault();
            send();
          }} class="w-full">
            <InputGroup>
              <div class="h-14 w-full px-3 py-2.5">
                <span class="line-clamp-2 opacity-60 data-[busy=false]:opacity-100" data-busy={streaming.value}>
                  {next.value ? next.value.text : <span class="text-muted-foreground">No messages queued. Reset the conversation.</span>}
                </span>
              </div>
              <InputGroupAddon align="block-end" class="pt-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <InputGroupButton aria-label="Add files" type="button" size="icon-sm" variant="outline">
                      <Icon name="plus" />
                    </InputGroupButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="top" class="w-44">
                    <DropdownMenuItem>
                      <Icon name="paperclip" />
                      Add Photos & Files
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Icon name="image" />
                      Create Image
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Icon name="sparkles" />
                      Deep Research
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Icon name="globe" />
                      Web Search
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <InputGroupButton type="submit" variant="default" size="icon-sm" disabled={!next.value} aria-disabled={streaming.value || undefined} class="ms-auto">
                  <Icon name="arrow-up" />
                  <span class="sr-only">Send</span>
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
        </CardFooter>
      </Card>
      <div class="px-0.5 text-center text-xs text-muted-foreground">Demo is read only. Press send to send the next message.</div>
    </div>;
  };
});
export default Example;
