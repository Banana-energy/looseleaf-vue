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
import { cn } from "@/lib/utils";
export const AppSidebar = defineUi<UI.ComponentProps<typeof Sidebar> & {
  contained?: boolean;
}>("AppSidebar", ["contained", "class"], (_props, {
  slots: _slots
}) => {
  const contained = computed(() => _props["contained"] === undefined ? false : _props["contained"]);
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["contained", "class"]));
  return () => {
    return <Sidebar role="navigation" aria-label="Studio" class={cn("top-(--header-height)", contained.value ? "h-[calc(100%-var(--header-height))]!" as const : "h-[calc(100svh-var(--header-height))]!" as const, className.value)} {...domProps(props.value)}>
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
      <SidebarContent>
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
