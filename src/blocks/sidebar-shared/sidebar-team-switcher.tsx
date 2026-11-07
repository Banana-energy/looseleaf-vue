// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { BrandTile, BrandText } from "@/blocks/sidebar-shared/sidebar-brand";
import type { Team } from "@/blocks/sidebar-shared/sidebar-data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
export const TeamSwitcher = defineUi<{
  teams: Team[];
  compact?: boolean;
}>("TeamSwitcher", ["teams", "compact"], (_props, {
  slots: _slots
}) => {
  const teams = computed(() => _props["teams"]);
  const compact = computed(() => _props["compact"] === undefined ? false : _props["compact"]);
  const _hook2 = useSidebar();
  const isMobile = computed(() => _hook2.value.isMobile);
  const activeName = shallowRef(initialState(teams.value[0]?.name));
  const setActiveName = stateSetter(activeName);
  const active = computed(() => teams.value.find(team => team.name === activeName.value) ?? teams.value[0]);
  return () => {
    if (!active.value) return null;
    return <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {compact.value ? <SidebarMenuButton class="w-fit px-1.5 data-[state=open]:ll-swipe" aria-label={`Team: ${active.value.name}`}>
                <BrandTile icon={active.value.icon} small />
                <span class="truncate font-bold">{active.value.name}</span>
                <Icon name="chevron-down" class="opacity-60" />
              </SidebarMenuButton> : <SidebarMenuButton size="lg" tooltip={isMobile.value ? undefined : active.value.name} class="data-[state=open]:ll-swipe">
                <BrandTile icon={active.value.icon} />
                <BrandText title={active.value.name} subtitle={active.value.plan} />
                <Icon name="chevrons-up-down" class="ms-auto group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>}
          </DropdownMenuTrigger>
          <DropdownMenuContent class={compact.value ? "w-64" as const : "w-(--reka-dropdown-menu-trigger-width) min-w-56" as const} align="start" side={compact.value || isMobile.value ? "bottom" as const : "right" as const} sideOffset={4}>
            <DropdownMenuLabel>Teams</DropdownMenuLabel>
            {teams.value.map(team => <DropdownMenuItem key={team.name} onSelect={() => setActiveName(team.name)}>
                <Icon name={team.icon} />
                {team.name}
                {team.name === active.value.name ? <Icon name="check" class="ms-auto" label="Current team" /> : null}
              </DropdownMenuItem>)}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Icon name="plus" />
              Add team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>;
  };
});
