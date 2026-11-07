// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
export const meta = {
  title: "Menu action and badge" as const,
  description: "Official `sidebar-menu-action` and `sidebar-menu-badge` in one pad. Top group: each row has a `SidebarMenuAction` (a small button that opens a menu), and the row keeps the highlighter while its menu is open. Bottom group: a `SidebarMenuBadge` writes a count in the margin in blue felt tip. Action and badge share the same corner, so a row takes one or the other." as const,
  layout: "full" as const,
  height: 380,
  stage: "desk" as const
};
const projects = [{
  name: "Design Engineering" as const,
  url: "#sidebar-action-design" as const,
  icon: "frame" as const
}, {
  name: "Sales & Marketing" as const,
  url: "#sidebar-action-sales" as const,
  icon: "chart-pie" as const
}, {
  name: "Travel" as const,
  url: "#sidebar-action-travel" as const,
  icon: "map" as const
}];
const unread = [{
  name: "Support" as const,
  url: "#sidebar-badge-support" as const,
  icon: "life-buoy" as const,
  badge: "21" as const
}, {
  name: "Feedback" as const,
  url: "#sidebar-badge-feedback" as const,
  icon: "send" as const,
  badge: "8" as const
}, {
  name: "Travel" as const,
  url: "#sidebar-badge-travel" as const,
  icon: "map" as const,
  badge: "3" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="relative h-[380px] w-full overflow-hidden [transform:translateZ(0)]">
      <SidebarProvider class="h-full min-h-0">
        <Sidebar class="h-full" seed="official-menu-action">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projects.map(project => <SidebarMenuItem key={project.name}>
                      <SidebarMenuButton asChild class="group-has-[[data-state=open]]/menu-item:ll-swipe">
                        <a href={project.url}>
                          <Icon name={project.icon} />
                          <span>{project.name}</span>
                        </a>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction>
                            <Icon name="ellipsis" />
                            <span class="sr-only">More</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem>
                            <span>Edit Project</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span>Delete Project</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Unread</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {unread.map(project => <SidebarMenuItem key={project.name}>
                      <SidebarMenuButton asChild>
                        <a href={project.url}>
                          <Icon name={project.icon} />
                          <span>{project.name}</span>
                        </a>
                      </SidebarMenuButton>
                      <SidebarMenuBadge>{project.badge}</SidebarMenuBadge>
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
