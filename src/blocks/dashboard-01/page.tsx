// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { AppSidebar } from "@/blocks/dashboard-01/components/dashboard-01-app-sidebar";
import { ChartAreaInteractive } from "@/blocks/dashboard-01/components/dashboard-01-chart-area-interactive";
import { DataTable } from "@/blocks/dashboard-01/components/dashboard-01-data-table";
import { sections } from "@/blocks/dashboard-01/components/dashboard-01-data";
import { SectionCards } from "@/blocks/dashboard-01/components/dashboard-01-section-cards";
import { SiteHeader } from "@/blocks/dashboard-01/components/dashboard-01-site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { InkTiles } from "@/lib/ink/vue";
import { cn } from "@/lib/utils";
const SHEET = "ll-paper ll-stock-paper ll-tooth-cold before:block min-w-0";
const SHEET_TILES = ["fibre", "relief", "cloud"] as const;
const Page = defineUi<{
  contained?: boolean;
}>("Page", ["contained"], (_props, {
  slots: _slots
}) => {
  const contained = computed(() => _props["contained"] === undefined ? false : _props["contained"]);
  return () => {
    return <SidebarProvider class={cn(contained.value && "h-full min-h-0")} style={cssStyle({
      "--sidebar-width": "calc(var(--spacing) * 72)" as const,
      "--header-height": "calc(var(--spacing) * 12)" as const
    } as UI.CSSProperties)}>
      <AppSidebar variant="inset" class={cn(contained.value && "h-full")} />
      <SidebarInset class={SHEET}>
        <InkTiles tiles={SHEET_TILES} />
        <div class={cn("flex flex-1 flex-col", contained.value && "min-h-0 overflow-x-clip overflow-y-auto")}>
          <SiteHeader />
          <div class="flex flex-1 flex-col">
            <div class="@container/main flex flex-1 flex-col gap-2">
              <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div class="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <DataTable data={sections} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>;
  };
});
export default Page;
