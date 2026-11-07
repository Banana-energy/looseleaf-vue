// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { user } from "@/blocks/dashboard-01/components/dashboard-01-data";
const navMain = [{
  title: "Dashboard" as const,
  icon: "layout-dashboard" as const,
  active: true
}, {
  title: "Lifecycle" as const,
  icon: "list" as const
}, {
  title: "Analytics" as const,
  icon: "chart-column" as const
}, {
  title: "Projects" as const,
  icon: "folder" as const
}, {
  title: "Team" as const,
  icon: "users" as const
}];
const documents = [{
  name: "Data library" as const,
  icon: "archive" as const
}, {
  name: "Reports" as const,
  icon: "file-text" as const
}, {
  name: "Writing helper" as const,
  icon: "bot" as const
}];
const navSecondary = [{
  title: "Settings" as const,
  icon: "settings" as const
}, {
  title: "Get help" as const,
  icon: "life-buoy" as const
}, {
  title: "Search" as const,
  icon: "search" as const
}];
const NavMain = defineUi<{}>("NavMain", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <SidebarGroup>
      <SidebarGroupContent class="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem class="flex items-center gap-2">
            <Button class="min-w-0 flex-1 justify-start">
              <Icon name="circle-plus" />
              Quick create
            </Button>
            <Button size="icon" variant="outline" class="shrink-0">
              <Icon name="mail" />
              <span class="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <nav aria-label="Main">
          <SidebarMenu>
            {navMain.map(item => <SidebarMenuItem key={item.title}>
                <SidebarMenuButton isActive={item.active} aria-current={item.active ? "page" as const : undefined}>
                  <Icon name={item.icon} />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>)}
          </SidebarMenu>
        </nav>
      </SidebarGroupContent>
    </SidebarGroup>;
  };
});
const NavDocuments = defineUi<{}>("NavDocuments", [], (_props, {
  slots: _slots
}) => {
  const _hook0 = useSidebar();
  const isMobile = computed(() => _hook0.value.isMobile);
  return () => {
    return <SidebarGroup>
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarMenu>
        {documents.map(item => <SidebarMenuItem key={item.name}>
            <SidebarMenuButton>
              <Icon name={item.icon} />
              <span>{item.name}</span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover aria-label={`More for ${item.name}`}>
                  <Icon name="ellipsis" />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-40" side={isMobile.value ? "bottom" as const : "right" as const} align={isMobile.value ? "end" as const : "start" as const}>
                <DropdownMenuItem>
                  <Icon name="folder-open" />
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon name="share" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Icon name="trash" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>)}
        <SidebarMenuItem>
          <SidebarMenuButton class="text-sidebar-foreground/80">
            <Icon name="ellipsis" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>;
  };
});
const NavSecondary = defineUi<{
  className?: string;
}>("NavSecondary", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  return () => {
    return <SidebarGroup class={className.value}>
      <SidebarGroupContent>
        <nav aria-label="Secondary">
          <SidebarMenu>
            {navSecondary.map(item => <SidebarMenuItem key={item.title}>
                <SidebarMenuButton>
                  <Icon name={item.icon} />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>)}
          </SidebarMenu>
        </nav>
      </SidebarGroupContent>
    </SidebarGroup>;
  };
});
const NavUser = defineUi<{}>("NavUser", [], (_props, {
  slots: _slots
}) => {
  const _hook0 = useSidebar();
  const isMobile = computed(() => _hook0.value.isMobile);
  return () => {
    return <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar aria-hidden="true">
                <AvatarFallback name={user.name} />
              </Avatar>
              <span class="grid flex-1 text-start leading-tight">
                <span class="truncate font-bold">{user.name}</span>
                <span class="truncate text-sm text-muted-foreground">{user.email}</span>
              </span>
              <Icon name="ellipsis-vertical" class="ms-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="min-w-56" side={isMobile.value ? "bottom" as const : "right" as const} align="end" sideOffset={4}>
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Icon name="circle-user" />
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
export const AppSidebar = defineUi<UI.ComponentProps<typeof Sidebar>>("AppSidebar", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <Sidebar collapsible="offcanvas" class={className.value} {...domProps(props.value)}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <span class="grid size-8 shrink-0 place-items-center bg-marker/80 text-ink">
                <Icon name="pencil" />
              </span>
              <span class="grid flex-1 text-start leading-tight">
                <span class="truncate font-script text-xl font-semibold">Inkwell &amp; Co.</span>
                <span class="truncate text-sm text-muted-foreground">Proposal desk</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavDocuments />
        <NavSecondary class="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>;
  };
});
