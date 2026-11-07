// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Message, MessageContent, MessageFooter } from "@/components/ui/message";
export const meta = {
  title: "Actions" as const,
  description: "shadcn's `message-actions`: icon buttons in MessageFooter (copy, like, dislike), each with an `aria-label`, and a failed send with a retry. The thumbs are not drawn yet, so like and dislike wear a tick and a cross-out." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex w-full max-w-sm flex-col gap-8 py-4">
      <Message>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>The install failure is coming from the workspace package.</BubbleContent>
          </Bubble>
          <MessageFooter>
            <Button variant="ghost" size="icon" aria-label="Copy" title="Copy">
              <Icon name="copy" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Like" title="Like">
              <Icon name="circle-check" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Dislike" title="Dislike">
              <Icon name="circle-x" />
            </Button>
          </MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>Okay drop me a link. Taking a look...</BubbleContent>
          </Bubble>
          <MessageFooter class="gap-2">
            <span class="font-normal text-red">Failed to send</span>
            <Button variant="ghost" size="icon-xs" title="Retry" aria-label="Retry">
              <Icon name="rotate-cw" />
            </Button>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>;
  };
});
export default Example;
