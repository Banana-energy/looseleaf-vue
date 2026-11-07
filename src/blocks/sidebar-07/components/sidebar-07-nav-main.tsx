// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { AppNavItem } from "@/blocks/sidebar-shared/sidebar-data";
import { Collapsible, CollapsibleContent, CollapsibleIndicator, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/icon";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
export const NavMain = defineUi<{
  items: AppNavItem[];
  label?: string;
}>("NavMain", ["items", "label"], (_props, {
  slots: _slots
}) => {
  const items = computed(() => _props["items"]);
  const label = computed(() => _props["label"] === undefined ? "Studio" as const : _props["label"]);
  return () => {
    return <SidebarGroup>
      <SidebarGroupLabel>{label.value}</SidebarGroupLabel>
      <SidebarMenu>
        {items.value.map(item => <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  <Icon name={item.icon} />
                  <span class="truncate">{item.title}</span>
                  <CollapsibleIndicator class="ms-auto group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map(sub => <SidebarMenuSubItem key={sub.title}>
                      <SidebarMenuSubButton asChild isActive={sub.isActive}>
                        <a href={sub.url}>
                          <span>{sub.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>)}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>)}
      </SidebarMenu>
    </SidebarGroup>;
  };
});
