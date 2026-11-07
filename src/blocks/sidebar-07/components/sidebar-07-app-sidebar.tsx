// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { NavMain } from "@/blocks/sidebar-07/components/sidebar-07-nav-main";
import { appNav, appProjects, appTeams, appUser } from "@/blocks/sidebar-shared/sidebar-data";
import { NavProjects } from "@/blocks/sidebar-shared/sidebar-nav-app";
import { TeamSwitcher } from "@/blocks/sidebar-shared/sidebar-team-switcher";
import { NavUser } from "@/blocks/sidebar-shared/sidebar-user-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
const nav = appNav.map(item => ({
  ...item,
  items: item.items?.map(sub => ({
    ...sub,
    isActive: sub.title === "Recent"
  }))
}));
export const AppSidebar = defineUi<UI.ComponentProps<typeof Sidebar>>("AppSidebar", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <Sidebar collapsible="icon" role="navigation" aria-label="Studio" {...domProps(props.value)}>
      <SidebarHeader>
        <TeamSwitcher teams={appTeams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={nav} />
        <NavProjects projects={appProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={appUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>;
  };
});
