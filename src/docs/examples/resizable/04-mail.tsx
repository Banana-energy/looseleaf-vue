// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, usePanelRef } from "@/components/ui/resizable";
export const meta = {
  title: "Mail layout" as const,
  description: "A real screen: an inbox that collapses to nothing (a button, and dragging it past its minimum, both do it), a message and a details column. Collapsing uses the panel's imperative API." as const,
  layout: "center" as const
};
const mails = [["Ada", "Tabs landed"], ["Jo", "Table rules, by hand"], ["Mika", "Redrew the ticks"], ["Sam", "September invoice"]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const inbox = usePanelRef();
  const open = shallowRef(initialState(0));
  const setOpen = stateSetter(open);
  const collapsed = shallowRef(initialState(false));
  const setCollapsed = stateSetter(collapsed);
  return () => {
    return <Card seed="mail" class="w-full max-w-3xl py-0">
      <ResizablePanelGroup orientation="horizontal" class="h-80">
        <ResizablePanel id="inbox" panelRef={inbox.value} collapsible collapsedSize="0%" defaultSize="30%" minSize="20%" onResize={size => setCollapsed(size.asPercentage === 0)}>
          <ul inert={collapsed.value} class="grid gap-1 p-3 text-sm">
            <li class="mb-1 font-script text-xl font-semibold">Inbox</li>
            {mails.map(([from, subject], i) => <li key={from}>
                <button type="button" onClick={() => setOpen(i)} aria-current={open.value === i ? "true" as const : undefined} class="w-full px-2 py-1.5 text-start hover:ll-swipe focus-visible:ll-swipe aria-[current=true]:ll-swipe">
                  <span class="block font-bold">{from}</span>
                  <span class="block text-muted-foreground">{subject}</span>
                </button>
              </li>)}
          </ul>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize the inbox" />
        <ResizablePanel id="message" defaultSize="45%" minSize="30%">
          <div class="grid gap-2 p-4">
            <div class="flex items-center gap-2">
              <Button variant="ghost" size="icon-sm" onClick={() => {
                const shut = inbox.value.value?.isCollapsed() ?? collapsed.value;
                if (shut) inbox.value.value?.expand();else inbox.value.value?.collapse();
                setCollapsed(!shut);
              }}>
                <Icon name="panel-left" />
                <span class="sr-only">{collapsed.value ? "Show the inbox" as const : "Hide the inbox" as const}</span>
              </Button>
              <h3 class="font-script text-2xl leading-none font-semibold">{mails[open.value][1]}</h3>
            </div>
            <p class="text-sm text-muted-foreground">From {mails[open.value][0]}. The rules are pulled once and printed by CSS, so a hundred rows cost no drawings.</p>
            <p class="text-sm text-muted-foreground">Drag the seams, or focus one and press the arrow keys. Enter puts the inbox away and brings it back.</p>
          </div>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize the details" />
        <ResizablePanel id="details" defaultSize="25%" minSize="15%">
          <div class="grid gap-1 p-4 text-sm text-muted-foreground">
            <div class="font-bold text-foreground">Details</div>
            <div>From {mails[open.value][0]}</div>
            <div>Received 09:41</div>
            <div>Pencil, 1 page</div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Card>;
  };
});
export default Example;
