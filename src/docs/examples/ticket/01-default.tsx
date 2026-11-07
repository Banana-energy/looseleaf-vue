// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Ticket, TicketBody, TicketDescription, TicketNumber, TicketStub, TicketTitle } from "@/components/ui/ticket";
export const meta = {
  title: "Admit one" as const,
  description: "Concave corners, a bite out of both edges where the stub tears off, and a row of holes along the tear. The whole silhouette is drawn, holes and all." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Ticket seed="admit" role="group" aria-label="Ticket number 0042" class="max-w-md">
      <TicketBody>
        <TicketTitle>Admit one</TicketTitle>
        <TicketDescription>Le Grand Jardin</TicketDescription>
        <TicketNumber>No. 0042</TicketNumber>
      </TicketBody>
      <TicketStub>
        <TicketNumber class="text-lg">
          <span class="block text-xs">No.</span>
          0042
        </TicketNumber>
      </TicketStub>
    </Ticket>;
  };
});
export default Example;
