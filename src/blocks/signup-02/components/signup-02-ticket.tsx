// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Mascot } from "@/components/ui/mascot";
import { Sticker } from "@/components/ui/sticker";
import { Stamp } from "@/components/ui/stamp";
import { Ticket, TicketBody, TicketDescription, TicketNumber, TicketStub, TicketTitle } from "@/components/ui/ticket";
const SignupTicket = defineUi<{}>("SignupTicket", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div data-slot="signup-ticket" aria-hidden="true" class="relative h-[30rem] w-[23rem] shrink-0">
      <Ticket stock="kraft" tilt={-4} stubWidth={92} seed="signup-02-ticket" class="absolute start-0 top-[5.5rem] min-h-36 w-[22rem]">
        <TicketBody>
          <TicketTitle>Admit one</TicketTitle>
          <TicketDescription>The Looseleaf Club</TicketDescription>
          <p class="text-xs text-ink-soft">Founding season - general</p>
        </TicketBody>
        <TicketStub>
          <span class="text-xs">No.</span>
          <TicketNumber>0001</TicketNumber>
        </TicketStub>
      </Ticket>
      <Sticker name="party-popper" size={92} rotate={-10} class="absolute start-2 top-2" />
      <Stamp name="stamp-member" size={120} tilt={-8} class="absolute end-0 top-[12.5rem]" />
      <Mascot pose="celebrate" size={190} seed="signup-02-stubby" class="absolute start-[7.5rem] bottom-0 [--ll-blend:normal]" />
      <p class="absolute start-2 bottom-10 max-w-[7.5rem] font-script text-[2rem] leading-[0.95] font-bold text-ink">your seat is saved</p>
    </div>;
  };
});
export { SignupTicket };
