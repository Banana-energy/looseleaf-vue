// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider } from "@/components/ui/sidebar";
export const meta = {
  title: "Menu sub" as const,
  description: "Official `sidebar-menu-sub`: a table of contents, each section a button over an indented `SidebarMenuSub` that is always open. A pencil line runs down the start of each sub-list. The content scrolls inside the pad when it is taller than the pad. The data is the original's, written as strings." as const,
  layout: "full" as const,
  height: 420,
  stage: "desk" as const
};
const active = "Data Fetching";
const items = [{
  title: "Getting Started" as const,
  items: ["Installation", "Project Structure"]
}, {
  title: "Build Your Application" as const,
  items: ["Routing", "Data Fetching", "Rendering", "Caching", "Styling", "Optimizing", "Configuring", "Testing", "Authentication", "Deploying", "Upgrading", "Examples"]
}, {
  title: "API Reference" as const,
  items: ["Components", "File Conventions", "Functions", "next.config.js Options", "CLI", "Edge Runtime"]
}, {
  title: "Architecture" as const,
  items: ["Accessibility", "Fast Refresh", "Next.js Compiler", "Supported Browsers", "Turbopack"]
}];
const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="relative h-[420px] w-full overflow-hidden [transform:translateZ(0)]">
      <SidebarProvider class="h-full min-h-0">
        <Sidebar class="h-full" seed="official-menu-sub">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map(item => <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={`#sidebar-sub-${slug(item.title)}`}>
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      <SidebarMenuSub>
                        {item.items.map(subItem => <SidebarMenuSubItem key={subItem}>
                            <SidebarMenuSubButton asChild isActive={subItem === active}>
                              <a href={`#sidebar-sub-${slug(subItem)}`} aria-current={subItem === active ? "page" as const : undefined}>
                                <span>{subItem}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>)}
                      </SidebarMenuSub>
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
