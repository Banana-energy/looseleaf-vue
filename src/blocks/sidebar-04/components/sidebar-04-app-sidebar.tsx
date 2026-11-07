// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { SidebarBrand } from "@/blocks/sidebar-shared/sidebar-brand";
import { docsNav } from "@/blocks/sidebar-shared/sidebar-data";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
export const AppSidebar = defineUi<UI.ComponentProps<typeof Sidebar>>("AppSidebar", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <Sidebar variant="floating" role="navigation" aria-label="Field guide" {...domProps(props.value)}>
      <SidebarHeader>
        <SidebarBrand title="Field guide" subtitle="v1.0.0" icon="book-open" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu class="gap-2">
            {docsNav.map(section => <SidebarMenuItem key={section.title}>
                <SidebarMenuButton asChild>
                  <a href={section.url} class="font-bold">
                    {section.title}
                  </a>
                </SidebarMenuButton>
                {section.items.length ? <SidebarMenuSub>
                    {section.items.map(item => <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>)}
                  </SidebarMenuSub> : null}
              </SidebarMenuItem>)}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
  };
});
