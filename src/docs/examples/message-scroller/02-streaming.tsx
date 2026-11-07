// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Message, MessageContent, MessageText } from "@/components/ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "@/components/ui/message-scroller";
export const meta = {
  title: "Streaming and pinning" as const,
  description: "Send a message: it is pinned near the top of the view and the reply grows beneath it (autoScroll). When the reply is taller than the room, the view follows its bottom, until you scroll up." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 460
};
const REPLY = "Tags now sit under each note as small chips. Pick one or two and the list narrows. I kept the count at the top honest, so it always shows what is left. Archived notes no longer count, which was the off-by-one. There is a test for it now, and it fails on the old code. The chips are two pixels tighter, as you asked, and the filter row lives above the list so it does not jump when the list is empty.";
type Turn = {
  id: number;
  mine: boolean;
  text: string;
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const turns = shallowRef<Turn[]>(initialState([{
    id: 1,
    mine: true,
    text: "Can you add tags to my notes?" as const
  }, {
    id: 2,
    mine: false,
    text: "Done: a tags array on Note, and a chip row above the list." as const
  }]));
  const setTurns = stateSetter(turns);
  const words = shallowRef(initialState(0));
  const setWords = stateSetter(words);
  const streaming = shallowRef(initialState(false));
  const setStreaming = stateSetter(streaming);
  const next = shallowRef(3);
  const all = computed(() => REPLY.split(" "));
  watchDependencies(() => {
    if (!streaming.value) return;
    const id = window.setInterval(() => setWords(w => w + 1), 110);
    return () => window.clearInterval(id);
  }, () => [streaming.value], false);
  watchDependencies(() => {
    if (words.value >= all.value.length) setStreaming(false);
  }, () => [words.value, all.value.length], false);
  const send = computed(() => () => {
    setTurns(t => [...t, {
      id: next.value++,
      mine: true,
      text: "Show me what changed." as const
    }]);
    setWords(0);
    setStreaming(true);
  });
  const replying = computed(() => streaming.value || words.value > 0);
  return () => {
    return <div class="mx-auto flex h-[420px] w-full max-w-md flex-col gap-3">
      <div class="min-h-0 flex-1">
        <MessageScrollerProvider autoScroll>
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent aria-live={streaming.value ? "off" as const : undefined}>
                {turns.value.map(t => <MessageScrollerItem key={t.id} messageId={`t${t.id}`} scrollAnchor={t.mine}>
                    <Message align={t.mine ? "end" as const : "start" as const}>
                      <MessageContent>
                        <Bubble variant={t.mine ? "default" as const : "muted" as const}>
                          <BubbleContent seed={`turn-${t.id}`}>{t.text}</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>)}
                {replying.value ? <MessageScrollerItem messageId="reply">
                    <Message>
                      <MessageContent>
                        <Bubble variant="ghost" class="max-w-full">
                          <BubbleContent>
                            <MessageText streaming={streaming.value} seed="reply">
                              {all.value.slice(0, words.value).join(" ")}
                            </MessageText>
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem> : null}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>
      <p role="status" class="sr-only">
        {replying.value && !streaming.value ? "Stubby replied" as const : "" as const}
      </p>
      <Button size="sm" class="self-center" onClick={send.value} disabled={streaming.value}>
        Send a message
      </Button>
    </div>;
  };
});
export default Example;
