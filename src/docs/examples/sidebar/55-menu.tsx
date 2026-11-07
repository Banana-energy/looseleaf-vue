// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
export const meta = {
  title: "Menu" as const,
  description: "Official `sidebar-menu`: five projects as `SidebarMenuButton asChild` around links. Each row carries its own line of the pad's ruling, painted by CSS, so this list costs no drawing per row; only a current page (`isActive`) draws a mark." as const,
  layout: "full" as const,
  height: 260,
  stage: "desk" as const
};
const projects = [{
  name: "Design Engineering" as const,
  url: "#sidebar-menu-design" as const,
  icon: "frame" as const
}, {
  name: "Sales & Marketing" as const,
  url: "#sidebar-menu-sales" as const,
  icon: "chart-pie" as const
}, {
  name: "Travel" as const,
  url: "#sidebar-menu-travel" as const,
  icon: "map" as const
}, {
  name: "Support" as const,
  url: "#sidebar-menu-support" as const,
  icon: "life-buoy" as const
}, {
  name: "Feedback" as const,
  url: "#sidebar-menu-feedback" as const,
  icon: "send" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="relative h-[260px] w-full overflow-hidden [transform:translateZ(0)]">
      <SidebarProvider class="h-full min-h-0">
        <Sidebar class="h-full" seed="official-menu">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projects.map(project => <SidebarMenuItem key={project.name}>
                      <SidebarMenuButton asChild>
                        <a href={project.url}>
                          <Icon name={project.icon} />
                          <span>{project.name}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>;
  };
});
export default Example;
