// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleIndicator, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
export const meta = {
  title: "App sidebar" as const,
  description: "The real thing: a team switcher in the header, a group with a collapsible sub-menu, projects with per-row actions and a count, and the account menu in the footer. The current page has the highlighter and the bracket in the margin. Try Ctrl/Cmd+B." as const,
  layout: "full" as const,
  height: 600,
  stage: "desk" as const
};
const PLATFORM = [{
  title: "Playground" as const,
  icon: "square-terminal" as const,
  url: "#" as const,
  isActive: false
}, {
  title: "Models" as const,
  icon: "bot" as const,
  url: "#" as const,
  isActive: false
}, {
  title: "Documentation" as const,
  icon: "book-open" as const,
  url: "#" as const,
  isActive: true,
  items: [{
    title: "Introduction" as const,
    url: "#" as const
  }, {
    title: "Get started" as const,
    url: "#" as const,
    isActive: true
  }, {
    title: "Tutorials" as const,
    url: "#" as const
  }]
}, {
  title: "Settings" as const,
  icon: "settings" as const,
  url: "#" as const,
  isActive: false
}];
const PROJECTS = [{
  name: "Design engineering" as const,
  icon: "frame" as const
}, {
  name: "Sales & marketing" as const,
  icon: "chart-pie" as const,
  count: "12" as const
}, {
  name: "Travel" as const,
  icon: "map" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="relative h-[600px] w-full overflow-hidden [transform:translateZ(0)]">
      <SidebarProvider class="h-full min-h-0">
        <Sidebar class="h-full" seed="app">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg">
                      <span class="grid size-8 shrink-0 place-items-center bg-marker/80 text-ink">
                        <Icon name="book-open" />
                      </span>
                      <span class="grid flex-1 text-start leading-tight">
                        <span class="truncate font-bold">Looseleaf</span>
                        <span class="truncate text-xs text-muted-foreground">Notebook</span>
                      </span>
                      <Icon name="chevrons-up-down" class="ms-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent class="w-56" align="start">
                    <DropdownMenuLabel>Notebooks</DropdownMenuLabel>
                    <DropdownMenuItem>
                      Looseleaf <DropdownMenuShortcut>⌘1</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Field notes <DropdownMenuShortcut>⌘2</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Icon name="plus" /> Add notebook
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {PLATFORM.map(item => item.items ? <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton isActive={item.isActive} tooltip={item.title}>
                              <Icon name={item.icon} />
                              <span>{item.title}</span>
                              <CollapsibleIndicator class="ms-auto" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items.map(sub => <SidebarMenuSubItem key={sub.title}>
                                  <SidebarMenuSubButton asChild isActive={sub.isActive}>
                                    <a href={sub.url} aria-current={sub.isActive ? "page" as const : undefined}>
                                      <span>{sub.title}</span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>)}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible> : <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton tooltip={item.title}>
                          <Icon name={item.icon} />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {PROJECTS.map(p => <SidebarMenuItem key={p.name}>
                      <SidebarMenuButton tooltip={p.name}>
                        <Icon name={p.icon} />
                        <span>{p.name}</span>
                      </SidebarMenuButton>
                      {p.count ? <SidebarMenuBadge>{p.count}</SidebarMenuBadge> : <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction showOnHover aria-label={`Actions for ${p.name}`}>
                              <Icon name="ellipsis" />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right" align="start" class="w-48">
                            <DropdownMenuItem>
                              <Icon name="folder" /> View project
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Icon name="share" /> Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive">
                              <Icon name="trash" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>}
                    </SidebarMenuItem>)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg" tooltip="Account">
                      <Avatar class="size-8">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <span class="grid flex-1 text-start leading-tight">
                        <span class="truncate font-bold">Jo Delacroix</span>
                        <span class="truncate text-xs text-muted-foreground">jo@looseleaf.example</span>
                      </span>
                      <Icon name="chevrons-up-down" class="ms-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="end" class="w-56">
                    <DropdownMenuItem>
                      <Icon name="credit-card" /> Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Icon name="bell" /> Notifications
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      <Icon name="log-out" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset class="p-4">
          <div class="flex items-center gap-2">
            <SidebarTrigger />
            <h2 class="font-script text-2xl leading-none font-semibold">Get started</h2>
          </div>
          <p class="mt-3 max-w-md text-sm text-muted-foreground">
            The page beside the pad. Collapse it with the button, with Ctrl/Cmd+B, or by clicking the strip on its edge.
          </p>
          <Button variant="secondary" size="sm" class="mt-4 w-fit">
            <Icon name="sparkles" /> Continue
          </Button>
        </SidebarInset>
      </SidebarProvider>
    </div>;
  };
});
export default Example;
