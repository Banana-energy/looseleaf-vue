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
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { Message, MessageContent } from "@/components/ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "@/components/ui/message-scroller";
import { Slider } from "@/components/ui/slider";
export const meta = {
  title: "Keeping context visible" as const,
  description: "shadcn's `message-scroller-previous-context`: `scrollPreviousItemPeek` is how much of the previous reply stays in sight above a new anchor, and `scrollMargin` the space kept above it. Drag the slider, send the next line, and see how much of the last answer is left above your message." as const,
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
  text: "MessageScrollerItem fixes that with turn anchoring. Set scrollAnchor on the turn that should settle near the top instead of snapping to the bottom.\n\nA small peek of the previous exchange stays visible above the anchor, so context isn't lost. The reply starts in view without that disorienting jump you get from a plain overflow container." as const
}, {
  id: "u3" as const,
  role: "user" as const,
  text: "And if they've scrolled up to re-read an older answer? I don't want to yank them back down." as const
}, {
  id: "a3" as const,
  role: "assistant" as const,
  text: "You won't. Auto-scroll only runs when the viewport is already pinned to the bottom, so scrolling up is a deliberate opt-out. Their place stays put even as new words keep arriving below.\n\nWhen there is content they haven't seen yet, the jump button appears at the bottom of the viewport. One tap returns them to the newest message." as const
}];
const START = SCRIPT.slice(0, 2);
const DEFAULT_PEEK = 64;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const demoKey = shallowRef(initialState(0));
  const setDemoKey = stateSetter(demoKey);
  const peek = shallowRef(initialState(DEFAULT_PEEK));
  const setPeek = stateSetter(peek);
  const messages = shallowRef<Turn[]>(initialState(START));
  const setMessages = stateSetter(messages);
  const next = computed(() => SCRIPT.find(t => t.role === "user" && !messages.value.some(m => m.id === t.id)));
  return () => {
    function send() {
      if (!next.value) return;
      setMessages(m => [...m, next.value, SCRIPT[SCRIPT.indexOf(next.value) + 1]]);
    }
    return <MessageScrollerProvider key={demoKey.value} scrollMargin={24} scrollPreviousItemPeek={peek.value}>
      <div class="relative mx-auto flex w-full max-w-sm flex-col gap-4">
        <Card class="h-140 w-full gap-0">
          <CardHeader class="gap-1 border-b">
            <CardTitle>Keeping Context Visible</CardTitle>
            <CardDescription>New turns keep part of the previous reply in view.</CardDescription>
            <CardAction>
              <Button variant="outline" size="icon" aria-label="Reset context example" title="Reset" onClick={() => {
                setMessages(START);
                setPeek(DEFAULT_PEEK);
                setDemoKey(key => key + 1);
              }}>
                <Icon name="rotate-cw" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent class="flex min-h-0 flex-1 overflow-hidden p-0">
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent>
                  {messages.value.map(message => {
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
          <CardFooter class="flex-col gap-2">
            <form onSubmit={(e: SubmitEvent) => {
              e.preventDefault();
              send();
            }} class="w-full">
              <InputGroup>
                <div class="h-14 w-full px-3 py-2.5">
                  <span class="line-clamp-2">{next.value ? next.value.text : <span class="text-muted-foreground">No messages queued. Reset the context.</span>}</span>
                </div>
                <InputGroupAddon align="block-end" class="pt-1">
                  <div class="flex w-28 items-center gap-2">
                    <span class="text-xs text-muted-foreground tabular-nums">{peek.value}px</span>
                    <Slider aria-label="Previous context peek" value={[peek.value]} min={64} max={128} step={1} onValueChange={value => setPeek(value[0] ?? DEFAULT_PEEK)} />
                  </div>
                  <InputGroupButton type="submit" variant="default" size="icon-sm" disabled={!next.value} class="ms-auto">
                    <Icon name="arrow-up" />
                    <span class="sr-only">Send</span>
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </CardFooter>
        </Card>
        <div class="px-0.5 text-center text-xs text-muted-foreground">Adjust the slider and send. Observe the previous message peek.</div>
      </div>
    </MessageScrollerProvider>;
  };
});
export default Example;
