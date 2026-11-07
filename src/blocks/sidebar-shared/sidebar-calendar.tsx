// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, Fragment } from "vue";
import type { CalendarGroup } from "@/blocks/sidebar-shared/sidebar-data";
import { Calendar } from "@/components/ui/calendar";
import { Collapsible, CollapsibleContent, CollapsibleIndicator, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/icon";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
export const DatePicker = defineUi<{
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  defaultMonth?: Date;
}>("DatePicker", ["selected", "onSelect", "defaultMonth"], (_props, {
  slots: _slots
}) => {
  const selected = computed(() => _props["selected"]);
  const onSelect = computed(() => _props["onSelect"]);
  const defaultMonth = computed(() => _props["defaultMonth"]);
  return () => {
    return <SidebarGroup class="px-0">
      <SidebarGroupContent>
        <Calendar mode="single" required={false} selected={selected.value} onSelect={onSelect.value} defaultMonth={defaultMonth.value ?? selected.value} class="mx-auto p-0 [--cell:2rem] compact:[--cell:1.875rem]" />
      </SidebarGroupContent>
    </SidebarGroup>;
  };
});
export const Calendars = defineUi<{
  groups: CalendarGroup[];
  value: string[];
  onValueChange: (next: string[]) => void;
}>("Calendars", ["groups", "value", "onValueChange"], (_props, {
  slots: _slots
}) => {
  const groups = computed(() => _props["groups"]);
  const value = computed(() => _props["value"]);
  const onValueChange = computed(() => _props["onValueChange"]);
  const toggle = computed(() => (name: string) => onValueChange.value(value.value.includes(name) ? value.value.filter(v => v !== name) : [...value.value, name]));
  return () => {
    return <>
      {groups.value.map((group, index) => <Fragment key={group.name}>
          <SidebarGroup class="py-0">
            <Collapsible defaultOpen={index === 0}>
              <SidebarGroupLabel asChild class="w-full text-sm text-sidebar-foreground hover:ll-swipe focus-visible:ll-swipe">
                <CollapsibleTrigger>
                  {group.name}
                  <CollapsibleIndicator class="ms-auto" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map(item => {
                    const on = value.value.includes(item.name);
                    return <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton role="checkbox" aria-checked={on} onClick={() => toggle.value(item.name)}>
                            <Icon name={on ? "square-check" as const : "square" as const} class={cn(item.tone, !on && "opacity-70")} />
                            <span>{item.name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>;
                  })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
          <SidebarSeparator class="mx-0" />
        </Fragment>)}
    </>;
  };
});
