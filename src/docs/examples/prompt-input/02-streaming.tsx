// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { PromptInput, PromptInputBody, PromptInputFooter, PromptInputHint, PromptInputSubmit, PromptInputTextarea } from "@/components/ui/prompt-input";
import { TypingIndicator } from "@/components/ui/typing-indicator";
export const meta = {
  title: "While a reply streams" as const,
  description: "With status streaming the send button is a stop button and sending waits; you can keep typing the next message. `lockWhileStreaming` makes the text read-only instead." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const status = shallowRef<"ready" | "submitted" | "streaming">(initialState("ready"));
  const setStatus = stateSetter(status);
  const timers = shallowRef<number[]>([]);
  const clear = computed(() => () => {
    timers.value.forEach(t => window.clearTimeout(t));
    timers.value = [];
  });
  watchDependencies(() => clear.value, () => [], false);
  const send = computed(() => () => {
    clear.value();
    setStatus("submitted");
    timers.value.push(window.setTimeout(() => setStatus("streaming"), 700));
    timers.value.push(window.setTimeout(() => setStatus("ready"), 4200));
  });
  return () => {
    return <div class="mx-auto flex w-full max-w-xl flex-col gap-3 px-2 pb-3">
      <div class="min-h-8">
        <TypingIndicator active={status.value !== "ready"} label={status.value === "submitted" ? "Sent, waiting for a reply" as const : "Stubby is writing" as const} variant="squiggle" seed="stream" />
      </div>
      <PromptInput seed="stream" status={status.value} onSubmit={send.value} onStop={() => {
        clear.value();
        setStatus("ready");
      }}>
        <PromptInputBody>
          <PromptInputTextarea aria-label="Message" placeholder="Ask something..." />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputHint>{status.value === "ready" ? "Enter to send" as const : "Press stop to interrupt" as const}</PromptInputHint>
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>
    </div>;
  };
});
export default Example;
