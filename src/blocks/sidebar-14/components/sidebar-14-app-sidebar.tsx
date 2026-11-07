// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { pageOutline } from "@/blocks/sidebar-shared/sidebar-data";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail } from "@/components/ui/sidebar";
export const AppSidebar = defineUi<UI.ComponentProps<typeof Sidebar>>("AppSidebar", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <Sidebar role="navigation" aria-label="On this page" {...domProps(props.value)}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Table of contents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pageOutline.map(heading => <SidebarMenuItem key={heading.title}>
                  <SidebarMenuButton asChild>
                    <a href={heading.url} class="font-bold">
                      {heading.title}
                    </a>
                  </SidebarMenuButton>
                  {heading.items.length ? <SidebarMenuSub>
                      {heading.items.map(item => <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild isActive={item.isActive} class="h-auto min-h-7 py-0.5 leading-snug">
                            <a href={item.url}>{item.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>)}
                    </SidebarMenuSub> : null}
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>;
  };
});
