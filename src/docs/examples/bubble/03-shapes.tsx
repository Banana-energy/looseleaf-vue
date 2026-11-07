// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
export const meta = {
  title: "Notes, stickies and your own hand" as const,
  description: "A bubble does not have to be a cloud. A note is a slip of paper folded twice, a sticky is a sticky note, and `pen=\"you\"` writes in blue felt and the script font." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-auto grid w-full max-w-xl gap-8 px-4 pb-8 sm:grid-cols-2">
      <Bubble shape="note">
        <BubbleContent seed="note" class="min-h-14" paper={{
          tilt: -1.6
        }}>
          meet me by the library at four
        </BubbleContent>
      </Bubble>
      <Bubble shape="sticky" variant="secondary">
        <BubbleContent seed="sticky" class="min-h-24 pt-7" paper={{
          tilt: 1.8,
          fastener: "pin" as const
        }}>
          buy more ink!
        </BubbleContent>
      </Bubble>
      <Bubble shape="sticky" variant="tinted" align="end">
        <BubbleContent seed="sticky-2" class="min-h-24" paper={{
          tilt: -1.4
        }}>
          call mum before six
        </BubbleContent>
      </Bubble>
      <Bubble variant="outline" pen="you" align="end" class="max-w-full">
        <BubbleContent seed="you">Make the chips a little smaller, please.</BubbleContent>
      </Bubble>
    </div>;
  };
});
export default Example;
