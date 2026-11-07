// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent } from "@/components/ui/message";
export const meta = {
  title: "Rich replies" as const,
  description: "shadcn's `message-markdown`: the user's message stays plain text in a bubble; the assistant's reply goes in a `ghost` bubble, which has no frame, so rendered markdown (a list, bold, inline code) reads as a page. shadcn's docs render it with their own Markdown component, which is not part of the registry; the markup below is what such a renderer produces." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex w-full max-w-sm flex-col gap-8 py-4">
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>How do I render markdown in a message?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent>
          <Bubble variant="ghost">
            <BubbleContent>
              <p>Here&apos;s how to render markdown in a message:</p>
              <ol class="my-2 list-decimal ps-5">
                <li>
                  Render assistant text through <strong>Markdown</strong>.
                </li>
                <li>Keep user messages as plain text.</li>
                <li>
                  Use a <code class="font-mono text-sm">ghost</code> bubble so the response is unframed.
                </li>
              </ol>
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>;
  };
});
export default Example;
