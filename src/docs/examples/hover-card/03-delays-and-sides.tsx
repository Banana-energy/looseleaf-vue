// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Doodle } from "@/components/ui/doodle";
import { HoverCard, HoverCardCaption, HoverCardContent, HoverCardMedia, HoverCardTrigger } from "@/components/ui/hover-card";
export const meta = {
  title: "Delays and sides" as const,
  description: "openDelay and closeDelay tune how eager the card is (the default 700 / 300 ms is deliberate: a card that pops up on every pass of the pointer is noise). `side` and `align` are Reka UI's: left and right cards start level with their link, so none rises above the page." as const,
  layout: "center" as const,
  height: 320
};
const CARDS = [{
  label: "Instant, left" as const,
  openDelay: 0,
  closeDelay: 100,
  side: "left" as const,
  doodle: "sun" as const
}, {
  label: "Default, bottom" as const,
  openDelay: 700,
  closeDelay: 300,
  side: "bottom" as const,
  doodle: "mushroom" as const
}, {
  label: "Patient, right" as const,
  openDelay: 1200,
  closeDelay: 300,
  side: "right" as const,
  doodle: "star" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center justify-center gap-4 self-start">
      {CARDS.map(c => <HoverCard key={c.label} openDelay={c.openDelay} closeDelay={c.closeDelay}>
          <HoverCardTrigger asChild>
            <Button variant="outline" asChild>
              <a href="#delays">{c.label}</a>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent side={c.side} align="start" seed={c.label} class="w-56">
            <HoverCardMedia class="h-24">
              <Doodle name={c.doodle} size={72} />
            </HoverCardMedia>
            <HoverCardCaption>{c.label}</HoverCardCaption>
            <p class="px-1 text-sm text-muted-foreground">
              open {c.openDelay} ms, close {c.closeDelay} ms
            </p>
          </HoverCardContent>
        </HoverCard>)}
    </div>;
  };
});
export default Example;
