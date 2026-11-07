// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Message, MessageContent, MessageHeader, MessageText } from "@/components/ui/message";
export const meta = {
  title: "Streaming text" as const,
  description: "MessageText keeps the words already on the page and soaks each new word in as it arrives: dark and blurred at first, then dry. A felt-tip caret rides after the last word." as const,
  layout: "stack" as const
};
const REPLY = "Tags now sit under each note as small chips. Pick one or two and the list narrows. I kept the count at the top honest, so it always shows what is left.";
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const words = computed(() => REPLY.split(" "));
  const count = shallowRef(initialState(0));
  const setCount = stateSetter(count);
  const run = shallowRef(initialState(0));
  const setRun = stateSetter(run);
  watchDependencies(() => {
    setCount(0);
    const id = window.setInterval(() => setCount(c => c >= words.value.length ? c : c + 1), 140);
    return () => window.clearInterval(id);
  }, () => [run.value, words.value.length], false);
  const streaming = computed(() => count.value < words.value.length);
  return () => {
    return <div class="mx-auto flex w-full max-w-lg flex-col gap-3 px-3 pb-4">
      <Message>
        <MessageContent>
          <MessageHeader>Stubby</MessageHeader>
          <Bubble variant="muted" class="max-w-full">
            <BubbleContent seed="stream">
              <MessageText streaming={streaming.value} seed="stream-words">
                {words.value.slice(0, count.value).join(" ")}
              </MessageText>
              {count.value === 0 ? <span class="text-muted-foreground">...</span> : null}
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Button variant="ghost" size="sm" class="self-start" onClick={() => setRun(r => r + 1)}>
        Replay
      </Button>
    </div>;
  };
});
export default Example;
