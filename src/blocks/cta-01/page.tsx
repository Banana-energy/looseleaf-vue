// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Lettering } from "@/components/ui/lettering";
import { Mascot } from "@/components/ui/mascot";
import { Sticker } from "@/components/ui/sticker";
import { Ticket, TicketBody, TicketDescription, TicketNumber, TicketStub } from "@/components/ui/ticket";
const Cta01 = defineUi<{}>("Cta01", [], (_props, {
  slots: _slots
}) => {
  const titleId = useId();
  return () => {
    return <section aria-labelledby={titleId} class="@container w-full">
      <div class="px-4 py-14 @xl:px-8 @xl:py-20">
        <div class="relative mx-auto max-w-4xl">
          <Ticket stock="index-card" stubWidth={112} seed="cta-ticket" class="max-w-none">
            <TicketBody class="gap-3 px-6 py-8 @xl:px-10 @xl:py-10">
              <TicketDescription>Admit one team</TicketDescription>
              <Lettering as="h2" id={titleId} size="md" tone="marker" wobble={0.4} seed="cta-title" class="text-start @xl:text-6xl">
                Ready when you are.
              </Lettering>
              <p class="max-w-lg font-hand text-lg/7 text-ink-soft">Start a notebook in under a minute. It is free for teams of five, and there is no card to enter.</p>
              <div class="mt-2 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <a href="#start">
                    Start writing
                    <Icon name="arrow-right" class="rtl:-scale-x-100" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <a href="#talk">or talk to a human</a>
                </Button>
              </div>
            </TicketBody>
            <TicketStub class="gap-1">
              <Mascot pose="celebrate" size={84} />
              <TicketNumber>No. 0001</TicketNumber>
            </TicketStub>
          </Ticket>
          <Sticker name="party-popper" size={76} rotate={-14} class="pointer-events-none absolute -start-5 -top-9 hidden @xl:block" />
        </div>
      </div>
    </section>;
  };
});
export default Cta01;
