// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { calendarGroups, appUser } from "@/blocks/sidebar-shared/sidebar-data";
import { Calendars, DatePicker } from "@/blocks/sidebar-shared/sidebar-calendar";
import { NavUser } from "@/blocks/sidebar-shared/sidebar-user-menu";
import { Icon } from "@/components/ui/icon";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarSeparator } from "@/components/ui/sidebar";
export const AppSidebar = defineUi<UI.ComponentProps<typeof Sidebar> & {
  date: Date;
  onDateChange: (date: Date) => void;
  visible: string[];
  onVisibleChange: (next: string[]) => void;
}>("AppSidebar", ["date", "onDateChange", "visible", "onVisibleChange"], (_props, {
  slots: _slots
}) => {
  const date = computed(() => _props["date"]);
  const onDateChange = computed(() => _props["onDateChange"]);
  const visible = computed(() => _props["visible"]);
  const onVisibleChange = computed(() => _props["onVisibleChange"]);
  const props = computed(() => omitProps(_props, ["date", "onDateChange", "visible", "onVisibleChange"]));
  return () => {
    return <Sidebar role="navigation" aria-label="Calendars" {...domProps(props.value)}>
      <SidebarHeader class="h-16 border-b border-sidebar-border">
        <NavUser user={appUser} align="start" />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker selected={date.value} onSelect={next => next && onDateChange.value(next)} />
        <SidebarSeparator class="mx-0" />
        <Calendars groups={calendarGroups} value={visible.value} onValueChange={onVisibleChange.value} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Icon name="plus" />
              <span>New calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>;
  };
});
