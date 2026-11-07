// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { Person } from "@/blocks/sidebar-shared/sidebar-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
const Face = defineUi<{
  user: Person;
}>("Face", ["user"], (_props, {
  slots: _slots
}) => {
  const user = computed(() => _props["user"]);
  const initials = computed(() => user.value.name.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase());
  return () => {
    return <Avatar aria-hidden="true" class="size-8">
      <AvatarFallback tone="sky">{initials.value}</AvatarFallback>
    </Avatar>;
  };
});
const Who = defineUi<{
  user: Person;
}>("Who", ["user"], (_props, {
  slots: _slots
}) => {
  const user = computed(() => _props["user"]);
  return () => {
    return <span class="grid flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden">
      <span class="truncate font-bold">{user.value.name}</span>{" "}
      <span class="truncate text-sm text-muted-foreground">{user.value.email}</span>
    </span>;
  };
});
export const NavUser = defineUi<{
  user: Person;
  align?: "start" | "end";
  iconOnly?: boolean;
}>("NavUser", ["user", "align", "iconOnly"], (_props, {
  slots: _slots
}) => {
  const user = computed(() => _props["user"]);
  const align = computed(() => _props["align"] === undefined ? "end" as const : _props["align"]);
  const iconOnly = computed(() => _props["iconOnly"] === undefined ? false : _props["iconOnly"]);
  const _hook3 = useSidebar();
  const isMobile = computed(() => _hook3.value.isMobile);
  return () => {
    return <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {iconOnly.value ? <SidebarMenuButton tooltip={isMobile.value ? undefined : user.value.name} aria-label={user.value.name} class="h-8 justify-center p-0 data-[state=open]:ll-swipe">
                <Face user={user.value} />
              </SidebarMenuButton> : <SidebarMenuButton size="lg" tooltip={isMobile.value ? undefined : user.value.name} class="data-[state=open]:ll-swipe">
                <Face user={user.value} />
                <Who user={user.value} />
                <Icon name="chevrons-up-down" class="ms-auto group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>}
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-(--reka-dropdown-menu-trigger-width) min-w-56" side={isMobile.value ? "bottom" as const : "right" as const} align={align.value} sideOffset={4}>
            <DropdownMenuLabel class="flex items-center gap-2 py-1.5 font-normal">
              <Face user={user.value} />
              <Who user={user.value} />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Icon name="sparkles" />
                Upgrade to Studio
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Icon name="badge-check" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon name="credit-card" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon name="bell" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Icon name="log-out" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>;
  };
});
