// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Icon } from "@/components/ui/icon";
import { PromptInput, PromptInputBody, PromptInputButton, PromptInputFooter, PromptInputHint, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from "@/components/ui/prompt-input";
export const meta = {
  title: "The composer" as const,
  description: "Type, press Enter and the paper plane flies. Shift+Enter breaks the line; the box grows with the text up to eight rows. The send button is pencilled in until there is something to send." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const sent = shallowRef<string[]>(initialState([]));
  const setSent = stateSetter(sent);
  return () => {
    return <div class="mx-auto flex w-full max-w-xl flex-col gap-4 px-2 pb-3">
      <PromptInput seed="composer" onSubmit={text => setSent(s => [...s, text])}>
        <PromptInputBody>
          <PromptInputTextarea aria-label="Message" />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputButton size="icon-sm" aria-label="Attach a file">
              <Icon name="paperclip" />
            </PromptInputButton>
          </PromptInputTools>
          <PromptInputHint>Enter to send, Shift+Enter for a new line</PromptInputHint>
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>
      <ul aria-label="Sent" class="m-0 flex list-none flex-col gap-1 p-0 text-sm text-foreground">
        {sent.value.map((s, i) => <li key={i} class="whitespace-pre-wrap">
            {s}
          </li>)}
      </ul>
    </div>;
  };
});
export default Example;
