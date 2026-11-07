// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { notesFavorites, notesNav, notesSecondary, notesWorkspaces, appTeams } from "@/blocks/sidebar-shared/sidebar-data";
import { NavSecondary } from "@/blocks/sidebar-shared/sidebar-nav-app";
import { NavFavorites, NavLinks, NavWorkspaces } from "@/blocks/sidebar-shared/sidebar-nav-notes";
import { TeamSwitcher } from "@/blocks/sidebar-shared/sidebar-team-switcher";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
export const AppSidebar = defineUi<UI.ComponentProps<typeof Sidebar>>("AppSidebar", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <Sidebar role="navigation" aria-label="Notes" {...domProps(props.value)}>
      <SidebarHeader>
        <TeamSwitcher teams={appTeams} compact />
        <NavLinks items={notesNav} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={notesFavorites} />
        <NavWorkspaces workspaces={notesWorkspaces} />
        <NavSecondary items={notesSecondary} class="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>;
  };
});
