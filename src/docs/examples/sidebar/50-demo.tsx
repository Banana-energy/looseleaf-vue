// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
export const meta = {
  title: "Demo" as const,
  description: "Official `sidebar-demo`: one group of five links and an inset with the trigger. The pad hangs from a binder clip and every link wears the highlighter when pointed at. The outer frame is only there so the fixed pad stays inside this preview (in an app the provider goes at the root); try Ctrl/Cmd+B." as const,
  layout: "full" as const,
  height: 320,
  stage: "desk" as const
};
const items = [{
  title: "Home" as const,
  url: "#sidebar-demo-home" as const,
  icon: "house" as const
}, {
  title: "Inbox" as const,
  url: "#sidebar-demo-inbox" as const,
  icon: "inbox" as const
}, {
  title: "Calendar" as const,
  url: "#sidebar-demo-calendar" as const,
  icon: "calendar" as const
}, {
  title: "Search" as const,
  url: "#sidebar-demo-search" as const,
  icon: "search" as const
}, {
  title: "Settings" as const,
  url: "#sidebar-demo-settings" as const,
  icon: "settings" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="relative h-[320px] w-full overflow-hidden [transform:translateZ(0)]">
      <SidebarProvider class="h-full min-h-0">
        <Sidebar class="h-full" seed="official-demo">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map(item => <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <Icon name={item.icon} />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header class="flex h-12 items-center justify-between px-4">
            <SidebarTrigger />
          </header>
        </SidebarInset>
      </SidebarProvider>
    </div>;
  };
});
export default Example;
