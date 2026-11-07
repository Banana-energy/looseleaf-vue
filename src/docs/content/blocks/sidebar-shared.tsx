// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { appNav, appProjects, appSecondary, appTeams, appUser } from "@/blocks/sidebar-shared/sidebar-data";
import { NavMainFolds, NavProjects, NavSecondary } from "@/blocks/sidebar-shared/sidebar-nav-app";
import { PageBody, PageHeader, PageNote, PageSheet } from "@/blocks/sidebar-shared/sidebar-page";
import { SearchForm } from "@/blocks/sidebar-shared/sidebar-search-form";
import { TeamSwitcher } from "@/blocks/sidebar-shared/sidebar-team-switcher";
import { NavUser } from "@/blocks/sidebar-shared/sidebar-user-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { SidebarFrame } from "./_sidebar-frame";
const SidebarSharedPreview = defineUi<{}>("SidebarSharedPreview", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <SidebarFrame>
      <SidebarProvider class="h-full min-h-0">
        <Sidebar role="navigation" aria-label="Studio" class="h-full">
          <SidebarHeader>
            <TeamSwitcher teams={appTeams} />
            <SearchForm placeholder="Search the studio..." />
          </SidebarHeader>
          <SidebarContent>
            <NavMainFolds items={appNav} />
            <NavProjects projects={appProjects} />
            <NavSecondary items={appSecondary} small class="mt-auto" />
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={appUser} />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <PageSheet class="overflow-y-auto">
          <PageHeader crumbs={["Parts", "Sidebar kit"]} bordered />
          <PageBody title="Sidebar kit" kicker="Shared by sidebar-01 to sidebar-16">
            <PageNote title="Take what you need" pose="carry">
              Team switcher, search box, account menu, project and secondary lists, calendar, page header, this note. They come with any sidebar block; copy them into your app as they are.
            </PageNote>
          </PageBody>
        </PageSheet>
      </SidebarProvider>
    </SidebarFrame>;
  };
});
export default SidebarSharedPreview;
