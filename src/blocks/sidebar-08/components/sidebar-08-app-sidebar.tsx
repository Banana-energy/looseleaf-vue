// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { BrandTile, BrandText } from "@/blocks/sidebar-shared/sidebar-brand";
import { appNav, appProjects, appSecondary, appUser } from "@/blocks/sidebar-shared/sidebar-data";
import { NavMainFolds, NavProjects, NavSecondary } from "@/blocks/sidebar-shared/sidebar-nav-app";
import { NavUser } from "@/blocks/sidebar-shared/sidebar-user-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
export const AppSidebar = defineUi<UI.ComponentProps<typeof Sidebar>>("AppSidebar", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <Sidebar variant="inset" role="navigation" aria-label="Studio" {...domProps(props.value)}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#studio">
                <BrandTile icon="book-open" />
                <BrandText title="Looseleaf Studio" subtitle="Notebook" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent class="[&_[data-slot=sidebar-menu-button-mark]]:overflow-visible!">
        <NavMainFolds items={appNav} />
        <NavProjects projects={appProjects} />
        <NavSecondary items={appSecondary} small class="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={appUser} />
      </SidebarFooter>
    </Sidebar>;
  };
});
