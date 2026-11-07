// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent } from "@/components/ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "@/components/ui/message-scroller";
export const meta = {
  title: "A transcript that opens at the end" as const,
  description: "It opens on the newest message. Scroll up and the page fades at the top, the jump button wakes; press it and you glide back down." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 420
};
const LINES = ["Did the tags make it into the build?", "They did. The filter row is next.", "Can you draw the chips a little smaller?", "Smaller, yes. Two pixels off the padding.", "And the count at the top?", "It says 12 but the list has 11.", "Off by one, as ever.", "Found it: the archived note still counts.", "Fixed. Do you want a test for it?", "Yes please. One that would have caught it.", "Written. It fails on the old code and passes on the new.", "Lovely. Ship it after lunch?"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-auto h-[380px] w-full max-w-md">
      <MessageScrollerProvider>
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent>
              {LINES.map((text, i) => <MessageScrollerItem key={i} messageId={`m${i}`}>
                  <Message align={i % 2 ? "end" as const : "start" as const}>
                    <MessageContent>
                      <Bubble variant={i % 2 ? "default" as const : "muted" as const}>
                        <BubbleContent seed={`line-${i}`}>{text}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>)}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>;
  };
});
export default Example;
