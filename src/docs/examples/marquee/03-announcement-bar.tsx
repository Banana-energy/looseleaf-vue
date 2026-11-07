// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Marquee, MarqueeItem } from "@/components/ui/marquee";
export const meta = {
  title: "Announcement bar" as const,
  description: "A real use: the strip above a site header, with links in it. Only the first copy can be tabbed to, and the ticker holds still while a link has focus." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <header class="flex w-full max-w-3xl flex-col gap-3">
      <Marquee label="Announcements" speed={55} tape="washi-stripes" color="tangerine">
        <MarqueeItem>
          <a href="#sale" class="underline decoration-wavy underline-offset-4 hover:text-ink-you">
            Spring sale: everything ten off
          </a>
        </MarqueeItem>
        <MarqueeItem>
          <a href="#shipping" class="underline decoration-wavy underline-offset-4 hover:text-ink-you">
            Free shipping over 40
          </a>
        </MarqueeItem>
        <MarqueeItem>New: the felt-tip collection</MarqueeItem>
      </Marquee>
      <nav aria-label="Main" class="flex items-center gap-6 px-2 font-script text-2xl">
        <span class="text-3xl">Looseleaf &amp; Co.</span>
        <a href="#shop">Shop</a>
        <a href="#journal">Journal</a>
        <a href="#about">About</a>
      </nav>
    </header>;
  };
});
export default Example;
