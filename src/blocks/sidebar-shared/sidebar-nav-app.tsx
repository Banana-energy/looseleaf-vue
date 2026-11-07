// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { AppNavItem, Project } from "@/blocks/sidebar-shared/sidebar-data";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar";
export const NavMainFolds = defineUi<{
  items: AppNavItem[];
  label?: string;
}>("NavMainFolds", ["items", "label"], (_props, {
  slots: _slots
}) => {
  const items = computed(() => _props["items"]);
  const label = computed(() => _props["label"] === undefined ? "Studio" as const : _props["label"]);
  return () => {
    return <SidebarGroup>
      <SidebarGroupLabel>{label.value}</SidebarGroupLabel>
      <SidebarMenu>
        {items.value.map(item => <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                <a href={item.url}>
                  <Icon name={item.icon} />
                  <span class="truncate">{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.items?.length ? <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction class="data-[state=open]:rotate-90 rtl:data-[state=open]:-rotate-90">
                      <Icon name="chevron-right" />
                      <span class="sr-only">Show pages in {item.title}</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map(sub => <SidebarMenuSubItem key={sub.title}>
                          <SidebarMenuSubButton asChild isActive={sub.isActive}>
                            <a href={sub.url}>
                              <span>{sub.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>)}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </> : null}
            </SidebarMenuItem>
          </Collapsible>)}
      </SidebarMenu>
    </SidebarGroup>;
  };
});
export const NavProjects = defineUi<{
  projects: Project[];
}>("NavProjects", ["projects"], (_props, {
  slots: _slots
}) => {
  const projects = computed(() => _props["projects"]);
  const _hook1 = useSidebar();
  const isMobile = computed(() => _hook1.value.isMobile);
  return () => {
    return <SidebarGroup class="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.value.map(item => <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
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
              <DropdownMenuContent class="w-48" side={isMobile.value ? "bottom" as const : "right" as const} align={isMobile.value ? "end" as const : "start" as const}>
                <DropdownMenuItem>
                  <Icon name="folder" />
                  <span>View project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon name="share" />
                  <span>Share project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Icon name="trash" />
                  <span>Delete project</span>
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
export const NavSecondary = defineUi<{
  items: {
    title: string;
    url: string;
    icon: string;
    badge?: string;
  }[];
  small?: boolean;
} & Omit<UI.ComponentProps<typeof SidebarGroup>, "children">>("NavSecondary", ["items", "small", "class"], (_props, {
  slots: _slots
}) => {
  const items = computed(() => _props["items"]);
  const small = computed(() => _props["small"] === undefined ? false : _props["small"]);
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["items", "small", "class"]));
  return () => {
    return <SidebarGroup class={className.value} {...domProps(props.value)}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.value.map(item => <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size={small.value ? "sm" as const : "default" as const} tooltip={item.title} class="group-has-data-[sidebar=menu-badge]/menu-item:pe-8">
                <a href={item.url}>
                  <Icon name={item.icon} />
                  <span class="truncate">{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
            </SidebarMenuItem>)}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>;
  };
});
