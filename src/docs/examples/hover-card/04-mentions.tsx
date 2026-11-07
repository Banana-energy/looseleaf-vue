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
  title: "Mentions in prose" as const,
  description: "The real use: names in a paragraph that unfold into a card. Every mention is a real link that works without the card (touch, keyboard, no JS), and the card is a bonus for the pointer." as const,
  layout: "center" as const,
  height: 340
};
const PEOPLE = [{
  handle: "ada" as const,
  name: "Ada Lovelace" as const,
  bio: "Wrote the first program. Notes longer than the paper they annotate." as const,
  doodle: "star" as const
}, {
  handle: "grace" as const,
  name: "Grace Hopper" as const,
  bio: "Found the first bug, taped it in the log, kept the nanosecond wire." as const,
  doodle: "sun" as const
}, {
  handle: "margaret" as const,
  name: "Margaret Hamilton" as const,
  bio: "Flew the software that flew to the Moon." as const,
  doodle: "flower" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <p class="max-w-md self-start text-base/7">
      Today&apos;s notebook was started by{" "}
      {PEOPLE.map((p, i) => <span key={p.handle}>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" class="h-auto p-0 align-baseline text-base" asChild>
                <a href={`#${p.handle}`}>@{p.handle}</a>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent tape={i === 1 ? "top" as const : false} seed={p.handle}>
              <HoverCardMedia>
                <Doodle name={p.doodle} size={80} />
              </HoverCardMedia>
              <HoverCardCaption>{p.name}</HoverCardCaption>
              <p class="px-1 text-sm text-muted-foreground">{p.bio}</p>
            </HoverCardContent>
          </HoverCard>
          {i < PEOPLE.length - 2 ? ", " as const : i === PEOPLE.length - 2 ? " and " as const : "" as const}
        </span>)}
      , and finished by nobody yet.
    </p>;
  };
});
export default Example;
