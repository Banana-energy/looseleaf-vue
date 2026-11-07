// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Icon } from "@/components/ui/icon";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
export const meta = {
  title: "Where you stopped reading" as const,
  description: "tone=\"new\" pulls the lines in red pencil and lays a highlighter swipe under the words, with a red asterisk in the margin. As a button it jumps to the first unread message." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const read = shallowRef(initialState(false));
  const setRead = stateSetter(read);
  return () => {
    return <div class="mx-auto flex w-full max-w-lg flex-col gap-3 px-4 pb-4">
      <Bubble variant="muted">
        <BubbleContent seed="un-1">I also drew the chips a little smaller, like you asked.</BubbleContent>
      </Bubble>
      {read.value ? <Marker variant="separator" seed="read">
          <MarkerContent>Read</MarkerContent>
        </Marker> : <Marker variant="separator" tone="new" seed="new" asChild>
          <button type="button" onClick={() => setRead(true)} aria-label="Mark as read: 2 new messages">
            <MarkerIcon>
              <Icon name="asterisk" />
            </MarkerIcon>
            <MarkerContent>New messages</MarkerContent>
          </button>
        </Marker>}
      <Bubble variant="muted">
        <BubbleContent seed="un-2">One more thing: the count at the top.</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent seed="un-3">It says 12 but the list has 11.</BubbleContent>
      </Bubble>
    </div>;
  };
});
export default Example;
