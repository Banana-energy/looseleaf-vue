// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarProvider } from "@/components/ui/sidebar";
export const meta = {
  title: "Controlled and loading" as const,
  description: "Official `sidebar-controlled` and `sidebar-rsc` in one pad. Controlled: `open` and `onOpenChange` on the provider, with the state kept in the page so any button can open and close the pad. Loading: `SidebarMenuSkeleton` rows (with icons) stand in while the projects load, then are swapped for the list. The original's loading is a Vue Server Component behind Suspense, which a client-only page cannot show, so a timer stands in for the fetch. Reload runs it again." as const,
  layout: "full" as const,
  height: 360,
  stage: "desk" as const
};
const projects = [{
  name: "Design Engineering" as const,
  url: "#sidebar-loading-design" as const,
  icon: "frame" as const
}, {
  name: "Sales & Marketing" as const,
  url: "#sidebar-loading-sales" as const,
  icon: "chart-pie" as const
}, {
  name: "Travel" as const,
  url: "#sidebar-loading-travel" as const,
  icon: "map" as const
}, {
  name: "Support" as const,
  url: "#sidebar-loading-support" as const,
  icon: "life-buoy" as const
}, {
  name: "Feedback" as const,
  url: "#sidebar-loading-feedback" as const,
  icon: "send" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const open = shallowRef(initialState(true));
  const setOpen = stateSetter(open);
  const loaded = shallowRef(initialState(false));
  const setLoaded = stateSetter(loaded);
  const round = shallowRef(initialState(0));
  const setRound = stateSetter(round);
  watchDependencies(() => {
    setLoaded(false);
    const timer = setTimeout(() => setLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, () => [round.value], false);
  return () => {
    return <div class="relative h-[360px] w-full overflow-hidden [transform:translateZ(0)]">
      <SidebarProvider open={open.value} onOpenChange={setOpen} class="h-full min-h-0">
        <Sidebar class="h-full" seed="official-controlled">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupContent aria-busy={!loaded.value}>
                <SidebarMenu>
                  {loaded.value ? projects.map(project => <SidebarMenuItem key={project.name}>
                          <SidebarMenuButton asChild>
                            <a href={project.url}>
                              <Icon name={project.icon} />
                              <span>{project.name}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>) : projects.map(project => <SidebarMenuItem key={project.name}>
                          <SidebarMenuSkeleton showIcon seed={project.name} />
                        </SidebarMenuItem>)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header class="flex h-12 items-center justify-between px-4">
            <Button onClick={() => setOpen(o => !o)} size="sm" variant="ghost">
              {open.value ? <Icon name="panel-left-close" /> : <Icon name="panel-left-open" />}
              <span>{open.value ? "Close" as const : "Open" as const} Sidebar</span>
            </Button>
            <Button onClick={() => setRound(r => r + 1)} size="sm" variant="outline" disabled={!loaded.value}>
              <Icon name="rotate-cw" />
              Reload
            </Button>
          </header>
        </SidebarInset>
      </SidebarProvider>
    </div>;
  };
});
export default Example;
