// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Icon } from "@/components/ui/icon";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
export const meta = {
  title: "Collapse to icons" as const,
  description: "collapsible=\"icon\" shrinks the pad to a 3rem strip: labels fade, the margin bracket steps aside, the binder clip comes off, and each button names itself in a tooltip. The state is controlled here so the page can read it." as const,
  layout: "full" as const,
  height: 460,
  stage: "desk" as const
};
const ITEMS = [{
  title: "Inbox" as const,
  icon: "inbox" as const,
  count: "3" as const
}, {
  title: "Calendar" as const,
  icon: "calendar" as const
}, {
  title: "Search" as const,
  icon: "search" as const
}, {
  title: "Settings" as const,
  icon: "settings" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const open = shallowRef(initialState(true));
  const setOpen = stateSetter(open);
  const current = shallowRef(initialState("Inbox"));
  const setCurrent = stateSetter(current);
  return () => {
    return <div class="relative h-[460px] w-full overflow-hidden [transform:translateZ(0)]">
      <SidebarProvider open={open.value} onOpenChange={setOpen} class="h-full min-h-0">
        <Sidebar collapsible="icon" class="h-full" seed="icons">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip="Looseleaf">
                  <Icon name="book-open" />
                  <span class="font-bold">Looseleaf</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {ITEMS.map(item => <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={current.value === item.title} tooltip={item.title} onClick={() => setCurrent(item.title)}>
                        <Icon name={item.icon} />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.count ? <SidebarMenuBadge>{item.count}</SidebarMenuBadge> : null}
                    </SidebarMenuItem>)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset class="p-4">
          <div class="flex items-center gap-2">
            <SidebarTrigger />
            <h2 class="font-script text-2xl leading-none font-semibold">{current.value}</h2>
          </div>
          <p class="mt-3 text-sm text-muted-foreground" aria-live="polite">
            The pad is {open.value ? "open" as const : "collapsed to icons" as const}. Hover a button when it is collapsed to read its name.
          </p>
        </SidebarInset>
      </SidebarProvider>
    </div>;
  };
});
export default Example;
