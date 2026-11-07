// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { SidebarBrand } from "@/blocks/sidebar-shared/sidebar-brand";
import { docsNav } from "@/blocks/sidebar-shared/sidebar-data";
import { SearchForm } from "@/blocks/sidebar-shared/sidebar-search-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/icon";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail } from "@/components/ui/sidebar";
export const AppSidebar = defineUi<UI.ComponentProps<typeof Sidebar>>("AppSidebar", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <Sidebar role="navigation" aria-label="Field guide" {...domProps(props.value)}>
      <SidebarHeader>
        <SidebarBrand title="Field guide" subtitle="v1.0.0" icon="book-open" />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {docsNav.map((section, index) => <Collapsible key={section.title} asChild defaultOpen={index === 1}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {section.title}
                      <Icon name="plus" class="ms-auto group-data-[state=open]/collapsible:hidden" />
                      <Icon name="minus" class="ms-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {section.items.length ? <CollapsibleContent>
                      <SidebarMenuSub>
                        {section.items.map(item => <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild isActive={item.isActive}>
                              <a href={item.url}>{item.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>)}
                      </SidebarMenuSub>
                    </CollapsibleContent> : null}
                </SidebarMenuItem>
              </Collapsible>)}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>;
  };
});
