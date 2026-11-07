// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { docsNav, docsVersions } from "@/blocks/sidebar-shared/sidebar-data";
import { SearchForm } from "@/blocks/sidebar-shared/sidebar-search-form";
import { VersionSwitcher } from "@/blocks/sidebar-shared/sidebar-version-switcher";
import { Collapsible, CollapsibleContent, CollapsibleIndicator, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";
export const AppSidebar = defineUi<UI.ComponentProps<typeof Sidebar>>("AppSidebar", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <Sidebar role="navigation" aria-label="Field guide" {...domProps(props.value)}>
      <SidebarHeader>
        <VersionSwitcher versions={docsVersions} defaultVersion={docsVersions[0]!} />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent class="gap-0 [&_[data-slot=sidebar-menu-button-mark]]:overflow-visible!">
        {docsNav.map(section => <Collapsible key={section.title} defaultOpen>
            <SidebarGroup>
              <SidebarGroupLabel asChild class="w-full text-sm text-sidebar-foreground hover:ll-swipe focus-visible:ll-swipe">
                <CollapsibleTrigger>
                  {section.title}
                  <CollapsibleIndicator class="ms-auto" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map(item => <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>)}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>)}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>;
  };
});
