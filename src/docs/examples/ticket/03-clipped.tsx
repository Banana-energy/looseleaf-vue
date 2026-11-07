// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Ticket, TicketBody, TicketDescription, TicketNumber, TicketStub, TicketTitle } from "@/components/ui/ticket";
import { Tape } from "@/components/ui/tape";
export const meta = {
  title: "Taped to the page" as const,
  description: "A ticket is an ordinary positioned box: tape and stamps go on it with plain className. Its shadow follows the notches and the holes." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="relative">
      <Tape kind="washi-stripes" length={72} height={22} angle={-24} class="absolute -top-2 -left-6 z-10" />
      <Ticket stock="kraft" tilt={-2} seed="taped" role="group" aria-label="Ticket 0099" class="max-w-md">
        <TicketBody>
          <TicketTitle>Admit one</TicketTitle>
          <TicketDescription>Museum of small things</TicketDescription>
        </TicketBody>
        <TicketStub>
          <TicketNumber class="text-lg">0099</TicketNumber>
        </TicketStub>
      </Ticket>
    </div>;
  };
});
export default Example;
