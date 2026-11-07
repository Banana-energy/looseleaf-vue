// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { SidebarLeft } from "@/blocks/sidebar-15/components/sidebar-15-sidebar-left";
import { SidebarRight } from "@/blocks/sidebar-15/components/sidebar-15-sidebar-right";
import { containedClasses } from "@/blocks/sidebar-shared/sidebar-contained";
import { formatDay } from "@/blocks/sidebar-shared/sidebar-data";
import { PageBody, PageHeader, PageNote, PageSheet } from "@/blocks/sidebar-shared/sidebar-page";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
const START = new Date(2026, 8, 25);
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
    return <SidebarProvider class={cn("overflow-clip", c.value.provider)}>
      <SidebarLeft class={c.value.sidebar} />
      <PageSheet class={c.value.inset}>
        <PageHeader crumbs={["Project plan & to-dos"]} sticky />
        <PageBody title="Project plan & to-dos" kicker={formatDay(date.value)}>
          <PageNote title="Two pads, one page" pose="carry">
            Notes on the left, your week on the right. <span class="max-lg:hidden">Pick a day in the month and the kicker above follows.</span>
            <span class="lg:hidden">Widen the window and the week pad opens.</span>
          </PageNote>
        </PageBody>
      </PageSheet>
      <SidebarRight contained={contained.value} date={date.value} onDateChange={setDate} visible={visible.value} onVisibleChange={setVisible} />
    </SidebarProvider>;
  };
});
export default Page;
