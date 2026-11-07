// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardCaption, HoverCardContent, HoverCardMedia, HoverCardTrigger } from "@/components/ui/hover-card";
import { Sticker } from "@/components/ui/sticker";
export const meta = {
  title: "Taped, with a sticker" as const,
  description: "The window holds any art: here a die-cut sticker, and the polaroid is taped down by a strip of washi across the top." as const,
  layout: "center" as const,
  height: 340
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex items-center gap-1 self-start text-base">
      Read the notes for
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" class="px-1" asChild>
            <a href="https://kevintngo.github.io/looseleaf/changelog">Looseleaf 1.0</a>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent tape="top" tilt={-1.2} seed="release" class="w-72">
          <HoverCardMedia class="h-28">
            <Sticker name="rocket" size={84} />
          </HoverCardMedia>
          <HoverCardCaption>v1.0 is out</HoverCardCaption>
          <p class="px-1 text-sm text-muted-foreground">Forty-odd components, every line drawn by hand.</p>
        </HoverCardContent>
      </HoverCard>
    </div>;
  };
});
export default Example;
