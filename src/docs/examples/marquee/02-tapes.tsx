// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Marquee, MarqueeItem } from "@/components/ui/marquee";
export const meta = {
  title: "Tapes and directions" as const,
  description: "Any tape from the desk: masking, striped, gingham. direction=\"end\" runs it the other way, speed sets px per second. (washi-dots is for short, large words: its white dots are as big as small letters.)" as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex w-full max-w-2xl flex-col gap-5">
      <Marquee tape="masking" speed={45} label="Masking tape ticker" controls={false}>
        <MarqueeItem>Handle with care</MarqueeItem>
        <MarqueeItem>This side up</MarqueeItem>
      </Marquee>
      <Marquee tape="washi-stripes" color="sky" direction="end" label="Striped tape ticker">
        <MarqueeItem>New arrivals</MarqueeItem>
        <MarqueeItem>Restocked today</MarqueeItem>
      </Marquee>
      <Marquee tape="washi-gingham" color="tomato" speed={90} label="Gingham ticker">
        <MarqueeItem>Picnic season</MarqueeItem>
        <MarqueeItem>Bring a blanket</MarqueeItem>
      </Marquee>
    </div>;
  };
});
export default Example;
