// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { AppSidebar } from "@/blocks/sidebar-12/components/sidebar-12-app-sidebar";
import { containedClasses } from "@/blocks/sidebar-shared/sidebar-contained";
import { calendarGroups, formatDay, formatMonth } from "@/blocks/sidebar-shared/sidebar-data";
import { PageBody, PageHeader, PageNote, PageSheet } from "@/blocks/sidebar-shared/sidebar-page";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
const START = new Date(2026, 8, 25);
const ALL = calendarGroups.flatMap(group => group.items.map(item => item.name));
const DEFAULT_VISIBLE = ["Personal", "Work", "Holidays"];
const Page = defineUi<{
  contained?: boolean;
}>("Page", ["contained"], (_props, {
  slots: _slots
}) => {
  const contained = computed(() => _props["contained"] === undefined ? false : _props["contained"]);
  const c = computed(() => containedClasses(contained.value));
  const date = shallowRef(initialState(START));
  const setDate = stateSetter(date);
  const visible = shallowRef(initialState(DEFAULT_VISIBLE));
  const setVisible = stateSetter(visible);
  return () => {
    return <SidebarProvider class={cn("overflow-x-clip", c.value.provider)}>
      <AppSidebar class={c.value.sidebar} date={date.value} onDateChange={setDate} visible={visible.value} onVisibleChange={setVisible} />
      <PageSheet class={c.value.inset}>
        <PageHeader crumbs={[formatMonth(date.value)]} sticky bordered />
        <PageBody title={formatDay(date.value)} kicker="Calendar">
          <PageNote title="A quiet day" pose="sleep">
            Nothing pencilled in. Showing {visible.value.length} of {ALL.length} calendars, so it may be busier elsewhere.
          </PageNote>
        </PageBody>
      </PageSheet>
    </SidebarProvider>;
  };
});
export default Page;
