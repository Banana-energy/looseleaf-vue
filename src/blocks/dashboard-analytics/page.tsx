// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Funnel } from "@/blocks/dashboard-analytics/components/dashboard-analytics-funnel";
import { SourcesChart, TrafficChart } from "@/blocks/dashboard-analytics/components/dashboard-analytics-charts";
import { StatCards } from "@/blocks/dashboard-analytics/components/dashboard-analytics-stat-cards";
import { TopPages } from "@/blocks/dashboard-analytics/components/dashboard-analytics-top-pages";
import { LIVE, period as periodOf, RANGES, type Period, type RangeId } from "@/blocks/dashboard-analytics/components/dashboard-analytics-data";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Page as Sheet, PageDescription, PageHeader, PageTitle } from "@/components/ui/page";
import { StickyNote, StickyNoteContent, StickyNoteTitle } from "@/components/ui/sticky-note";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
function downloadCsv(p: Period) {
  const lines = ["date,visitors,pageviews,bounce_percent,average_session_seconds", ...p.rows.map(r => `${r[0]},${r[1]},${r[2]},${r[3] / 10},${r[4]}`)];
  const url = URL.createObjectURL(new Blob([lines.join("\n")], {
    type: "text/csv" as const
  }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `traffic-${p.days}-days.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
const DashboardAnalytics = defineUi<{
  as?: "main" | "div";
}>("DashboardAnalytics", ["as"], (_props, {
  slots: _slots
}) => {
  const Root = computed(() => _props["as"] === undefined ? "main" as const : _props["as"]);
  const rangeId = shallowRef<RangeId>(initialState("30d"));
  const setRangeId = stateSetter(rangeId);
  const range = computed(() => RANGES.find(r => r.id === rangeId.value) ?? RANGES[1]);
  const period = computed(() => periodOf(range.value.days));
  return () => {
    return <Sheet as={Root.value} width="full" tilt={false} rules="none" seed="dashboard-analytics" class="gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header class="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <div class="flex min-w-0 flex-col gap-4">
          <PageHeader>
            <p class="font-type text-sm tracking-wide text-ink-muted">Marigold Paper Co.</p>
            <PageTitle seed="analytics-title">Traffic</PageTitle>
            <PageDescription>How people found the studio in {range.value.long}, and what they did once they got here.</PageDescription>
          </PageHeader>
          <div class="flex flex-wrap items-center gap-3">
            <ToggleGroup type="single" variant="outline" value={rangeId.value} onValueChange={v => v && setRangeId(v as RangeId)} aria-label="Date range">
              {RANGES.map(r => <ToggleGroupItem key={r.id} value={r.id}>
                  {r.label}
                </ToggleGroupItem>)}
            </ToggleGroup>
            <Button variant="outline" onClick={() => downloadCsv(period.value)}>
              <Icon name="download" />
              Export CSV
            </Button>
          </div>
        </div>
        <StickyNote role="group" aria-label="Live now" fastener="pin" class="min-h-32 w-full sm:w-48" seed="analytics-live">
          <StickyNoteTitle>Live now</StickyNoteTitle>
          <StickyNoteContent>
            {LIVE.readers} people are reading {LIVE.page}.
          </StickyNoteContent>
        </StickyNote>
      </header>

      <StatCards period={period.value} />

      <div class="grid gap-4 lg:grid-cols-3">
        <TrafficChart period={period.value} longName={range.value.long} class="lg:col-span-2" />
        <SourcesChart period={period.value} />
      </div>

      <div class="grid gap-4 lg:grid-cols-5">
        <TopPages period={period.value} class="lg:col-span-3" />
        <Funnel period={period.value} longName={range.value.long} class="lg:col-span-2" />
      </div>
    </Sheet>;
  };
});
export default DashboardAnalytics;
