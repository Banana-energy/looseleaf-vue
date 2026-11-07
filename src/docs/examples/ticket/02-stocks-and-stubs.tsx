// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Ticket, TicketBody, TicketDescription, TicketNumber, TicketStub, TicketTitle } from "@/components/ui/ticket";
export const meta = {
  title: "Stocks, stubs, used" as const,
  description: "Kraft, cream, cinema yellow and tram-ticket pink. The stub can be at the start, wider, or not there; a punched hole says it has been used." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid justify-items-center gap-y-9 p-4">
      <Ticket stock="sticky-yellow" punched seed="cinema" role="group" aria-label="Cinema ticket, used">
        <TicketBody>
          <TicketTitle>Cinema</TicketTitle>
          <TicketDescription>Sat 27 Sep - 19:30</TicketDescription>
          <TicketNumber>Screen 2 - Row F - Seat 14</TicketNumber>
        </TicketBody>
        <TicketStub>
          <TicketNumber class="text-lg">1187</TicketNumber>
        </TicketStub>
      </Ticket>
      <Ticket stock="index-card" stub="start" stubWidth={80} seed="raffle" role="group" aria-label="Raffle ticket 311">
        <TicketBody>
          <TicketTitle>Raffle</TicketTitle>
          <TicketDescription>Win a very small pencil</TicketDescription>
        </TicketBody>
        <TicketStub>
          <TicketNumber class="text-xl">311</TicketNumber>
        </TicketStub>
      </Ticket>
      <Ticket stock="sticky-pink" stub="none" seed="tram" role="group" aria-label="One tram ride">
        <TicketBody class="items-center text-center">
          <TicketTitle>One ride</TicketTitle>
          <TicketDescription>Good until the last tram</TicketDescription>
        </TicketBody>
      </Ticket>
      <Ticket stubWidth={120} seed="fair" role="group" aria-label="Fair entry 0007">
        <TicketBody>
          <TicketTitle>Admit one</TicketTitle>
          <TicketDescription>The Looseleaf Fair - Sunday</TicketDescription>
        </TicketBody>
        <TicketStub>
          <TicketNumber class="text-xl">
            <span class="block text-xs">No.</span>
            0007
          </TicketNumber>
        </TicketStub>
      </Ticket>
    </div>;
  };
});
export default Example;
