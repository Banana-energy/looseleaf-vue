// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { Collapsible, CollapsibleContent, CollapsibleIndicator, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar";
import { Link } from "../core/router";
import { cn } from "@/lib/utils";
const NestedContext = createContext(false);
export interface NavItemProps {
  to: string;
  active?: boolean;
  count?: number;
  className?: string;
  children: UI.VueNode;
}
export const NavItem = defineUi<NavItemProps>("NavItem", ["to", "active", "count", "class"], (_props, {
  slots: _slots
}) => {
  const to = computed(() => _props["to"]);
  const active = computed(() => _props["active"]);
  const count = computed(() => _props["count"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const nested = useContext(NestedContext);
  return () => {
    return <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={!!active.value} size={nested.value ? "sm" as const : "default" as const} class={cn(count.value !== undefined && "pe-9", className.value)}>
        <Link to={to.value} aria-current={active.value ? "page" as const : undefined}>
          <span>{readSlot(_slots.default)}</span>
        </Link>
      </SidebarMenuButton>
      {count.value !== undefined ? <SidebarMenuBadge>{count.value}</SidebarMenuBadge> : null}
    </SidebarMenuItem>;
  };
});
export interface NavGroupProps {
  label: string;
  count?: number;
  open: boolean;
  onToggle: () => void;
  containsActive?: boolean;
  children: UI.VueNode;
}
export const NavGroup = defineUi<NavGroupProps>("NavGroup", ["label", "count", "open", "onToggle", "containsActive"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const count = computed(() => _props["count"]);
  const open = computed(() => _props["open"]);
  const onToggle = computed(() => _props["onToggle"]);
  const containsActive = computed(() => _props["containsActive"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <Collapsible asChild open={open.value} onOpenChange={() => onToggle.value()}>
      <SidebarMenuItem data-contains-active={containsActive.value || undefined}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton class={cn("pe-9", containsActive.value && "font-bold")}>
            <CollapsibleIndicator size={14} class="-rotate-90 group-data-[state=open]/collapsible-trigger:rotate-0" />
            <span>{label.value}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {count.value !== undefined ? <SidebarMenuBadge>{count.value}</SidebarMenuBadge> : null}
        <CollapsibleContent>
          <NestedContext.Provider value>
            <SidebarMenuSub>{readSlot(_slots.default)}</SidebarMenuSub>
          </NestedContext.Provider>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>;
  };
});
export interface NavSectionProps {
  label: string;
  to?: string;
  active?: boolean;
  count?: number;
  children: UI.VueNode;
}
export const NavSection = defineUi<NavSectionProps>("NavSection", ["label", "to", "active", "count"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const to = computed(() => _props["to"]);
  const active = computed(() => _props["active"]);
  const count = computed(() => _props["count"]);
  const children = renderValue(() => readSlot(_slots.default));
  const id = useId();
  return () => {
    return <SidebarGroup>
      <SidebarGroupLabel id={id} class="justify-between pe-1">
        {to.value ? <Link to={to.value} aria-current={active.value ? "page" as const : undefined} class="ll-ink-room -mx-1 px-1 hover:ll-swipe hover:text-ink aria-[current=page]:font-bold aria-[current=page]:text-ink">
            {label.value}
          </Link> : <span>{label.value}</span>}
        {count.value !== undefined ? <span class="ll-num font-script text-xl leading-none font-semibold text-ink-you">{count.value}</span> : null}
      </SidebarGroupLabel>
      <SidebarMenu aria-labelledby={id}>{readSlot(_slots.default)}</SidebarMenu>
    </SidebarGroup>;
  };
});
