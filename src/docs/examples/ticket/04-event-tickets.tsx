// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Ticket, TicketBody, TicketDescription, TicketNumber, TicketStub, TicketTitle } from "@/components/ui/ticket";
export const meta = {
  title: "Your tickets" as const,
  description: "A real list: tickets with an action, a status, and a punched hole once used. The state lives in your app; the ticket only shows it." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const initial = [{
  no: "0042" as const,
  event: "Book fair" as const,
  when: "Sat 27 Sep - 10:00" as const,
  used: false
}, {
  no: "0043" as const,
  event: "Print workshop" as const,
  when: "Sun 28 Sep - 14:00" as const,
  used: false
}, {
  no: "0017" as const,
  event: "Opening night" as const,
  when: "Fri 19 Sep - 19:30" as const,
  used: true
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const tickets = shallowRef(initialState(initial));
  const setTickets = stateSetter(tickets);
  return () => {
    return <ul class="mx-auto grid max-w-xl gap-8">
      {tickets.value.map(t => <li key={t.no}>
          <Ticket punched={t.used} seed={t.no} role="group" aria-label={`${t.event}, ticket ${t.no}${t.used ? ", used" as const : "" as const}`}>
            <TicketBody>
              <TicketTitle>{t.event}</TicketTitle>
              <TicketDescription>{t.when}</TicketDescription>
              <div class="pt-1">
                {t.used ? <TicketNumber>Used</TicketNumber> : <Button size="sm" variant="secondary" onClick={() => setTickets(all => all.map(x => x.no === t.no ? {
                ...x,
                used: true
              } : x))}>
                    Scan at the door
                  </Button>}
              </div>
            </TicketBody>
            <TicketStub>
              <TicketNumber class="text-lg">
                <span class="block text-xs">No.</span>
                {t.no}
              </TicketNumber>
            </TicketStub>
          </Ticket>
        </li>)}
    </ul>;
  };
});
export default Example;
