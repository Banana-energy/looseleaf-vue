// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/icon";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
export const meta = {
  title: "Collapsible group" as const,
  description: "Official `sidebar-group-collapsible`: the group label becomes the trigger of a Collapsible (`SidebarGroupLabel asChild` around `CollapsibleTrigger`), with a chevron that turns over as it opens. The label wears the highlighter on hover, where shadcn tints it with the accent color." as const,
  layout: "full" as const,
  height: 230,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="relative h-[230px] w-full overflow-hidden [transform:translateZ(0)]">
      <SidebarProvider class="h-full min-h-0">
        <Sidebar class="h-full" seed="official-group-collapsible">
          <SidebarContent>
            <Collapsible defaultOpen class="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel asChild class="cursor-pointer text-sm hover:ll-swipe">
                  <CollapsibleTrigger>
                    Help
                    <Icon name="chevron-down" class="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Icon name="life-buoy" />
                          Support
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Icon name="send" />
                          Feedback
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>;
  };
});
export default Example;
