// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { Message, MessageContent } from "@/components/ui/message";
import { MessageScroller, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport, useMessageScroller, useMessageScrollerVisibility } from "@/components/ui/message-scroller";
export const meta = {
  title: "Earlier messages, and jumping to one" as const,
  description: "Load older messages and the one you were reading stays exactly where it was (preserveScrollOnPrepend). useMessageScroller jumps to a message by id, useMessageScrollerVisibility says which are in view." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 460
};
const make = (from: number, to: number) => Array.from({
  length: to - from
}, (_, i) => ({
  id: from + i,
  text: `Message number ${from + i}`
}));
const Toolbar = defineUi<{
  onEarlier: () => void;
}>("Toolbar", ["onEarlier"], (_props, {
  slots: _slots
}) => {
  const onEarlier = computed(() => _props["onEarlier"]);
  const _hook1 = useMessageScroller();
  const scrollToMessage = computed(() => _hook1.value.scrollToMessage);
  const _hook3 = useMessageScrollerVisibility();
  const visibleMessageIds = computed(() => _hook3.value.visibleMessageIds);
  return () => {
    return <div class="flex flex-wrap items-center justify-between gap-2">
      <Button variant="secondary" size="sm" onClick={onEarlier.value}>
        Load 10 earlier
      </Button>
      <Button variant="ghost" size="sm" onClick={() => scrollToMessage.value("m20", {
        align: "center" as const
      })}>
        Jump to 20
      </Button>
      <span class="text-sm text-muted-foreground" aria-live="off">
        in view: {visibleMessageIds.value.length ? visibleMessageIds.value.map(id => id.slice(1)).join(", ") : "none" as const}
      </span>
    </div>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const messages = shallowRef(initialState(() => make(20, 40)));
  const setMessages = stateSetter(messages);
  return () => {
    return <div class="mx-auto flex h-[420px] w-full max-w-md flex-col gap-3">
      <MessageScrollerProvider>
        <Toolbar onEarlier={() => setMessages(m => [...make(Math.max(0, m[0].id - 10), m[0].id), ...m])} />
        <div class="min-h-0 flex-1">
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent>
                {messages.value[0].id > 0 ? null : <Marker variant="separator">
                    <MarkerContent>The beginning</MarkerContent>
                  </Marker>}
                {messages.value.map(m => <MessageScrollerItem key={m.id} messageId={`m${m.id}`}>
                    <Message align={m.id % 3 === 0 ? "end" as const : "start" as const}>
                      <MessageContent>
                        <Bubble variant={m.id % 3 === 0 ? "default" as const : "muted" as const}>
                          <BubbleContent seed={`n-${m.id}`}>{m.text}</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>)}
              </MessageScrollerContent>
            </MessageScrollerViewport>
          </MessageScroller>
        </div>
      </MessageScrollerProvider>
    </div>;
  };
});
export default Example;
