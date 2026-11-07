// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { AppNavItem, NotesPage, NotesWorkspace } from "@/blocks/sidebar-shared/sidebar-data";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar";
export const NavLinks = defineUi<{
  items: AppNavItem[];
}>("NavLinks", ["items"], (_props, {
  slots: _slots
}) => {
  const items = computed(() => _props["items"]);
  return () => {
    return <SidebarMenu>
      {items.value.map(item => <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.isActive} class="group-has-data-[sidebar=menu-badge]/menu-item:pe-8">
            <a href={item.url}>
              <Icon name={item.icon} />
              <span class="truncate">{item.title}</span>
            </a>
          </SidebarMenuButton>
          {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
        </SidebarMenuItem>)}
    </SidebarMenu>;
  };
});
export const NavFavorites = defineUi<{
  favorites: NotesPage[];
}>("NavFavorites", ["favorites"], (_props, {
  slots: _slots
}) => {
  const favorites = computed(() => _props["favorites"]);
  const _hook1 = useSidebar();
  const isMobile = computed(() => _hook1.value.isMobile);
  return () => {
    return <SidebarGroup class="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      <SidebarMenu>
        {favorites.value.map(item => <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url} title={item.name}>
                <Icon name={item.icon} />
                <span class="truncate">{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover aria-label={`Actions for ${item.name}`}>
                  <Icon name="ellipsis" />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-56" side={isMobile.value ? "bottom" as const : "right" as const} align={isMobile.value ? "end" as const : "start" as const}>
                <DropdownMenuItem>
                  <Icon name="star" />
                  <span>Remove from favorites</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Icon name="link" />
                  <span>Copy link</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon name="arrow-up-right" />
                  <span>Open in new tab</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Icon name="trash" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>)}
        <SidebarMenuItem>
          <SidebarMenuButton class="text-ink-soft">
            <Icon name="ellipsis" />
            <span class="truncate">More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>;
  };
});
export const NavWorkspaces = defineUi<{
  workspaces: NotesWorkspace[];
}>("NavWorkspaces", ["workspaces"], (_props, {
  slots: _slots
}) => {
  const workspaces = computed(() => _props["workspaces"]);
  return () => {
    return <SidebarGroup class="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {workspaces.value.map(workspace => <Collapsible key={workspace.name} asChild>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href={`#${workspace.name.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Icon name={workspace.icon} />
                    <span class="truncate">{workspace.name}</span>
                  </a>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction showOnHover class="start-1 bg-sidebar data-[state=open]:rotate-90 rtl:data-[state=open]:-rotate-90">
                    <Icon name="chevron-right" />
                    <span class="sr-only">Show pages in {workspace.name}</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <SidebarMenuAction showOnHover aria-label={`Add a page to ${workspace.name}`}>
                  <Icon name="plus" />
                </SidebarMenuAction>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {workspace.pages.map(page => <SidebarMenuSubItem key={page.name}>
                        <SidebarMenuSubButton asChild>
                          <a href={page.url}>
                            <Icon name={page.icon} />
                            <span class="truncate">{page.name}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>)}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>)}
          <SidebarMenuItem>
            <SidebarMenuButton class="text-ink-soft">
              <Icon name="ellipsis" />
              <span class="truncate">More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>;
  };
});
