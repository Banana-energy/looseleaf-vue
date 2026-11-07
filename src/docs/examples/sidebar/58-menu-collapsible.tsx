// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/icon";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider } from "@/components/ui/sidebar";
export const meta = {
  title: "Menu collapsible" as const,
  description: "Official `sidebar-menu-collapsible`: the same table of contents with each section folding open and shut. The first section starts open. The original wraps each item in a `div`, which is not valid inside a `ul`; `Collapsible asChild` here lets the `li` itself be the collapsible, so the list markup stays valid and the chevron still turns from `group-data-[state=open]/collapsible`." as const,
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
        <Sidebar class="h-full" seed="official-menu-collapsible">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item, index) => <Collapsible key={item.title} asChild class="group/collapsible" defaultOpen={index === 0}>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            <span>{item.title}</span>
                            <Icon name="chevron-right" class="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map(subItem => <SidebarMenuSubItem key={subItem}>
                                <SidebarMenuSubButton asChild isActive={subItem === active}>
                                  <a href={`#sidebar-collapsible-${slug(subItem)}`} aria-current={subItem === active ? "page" as const : undefined}>
                                    <span>{subItem}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>)}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>)}
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
