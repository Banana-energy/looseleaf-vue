// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, DonutChart, type ChartConfig } from "@/components/ui/chart";
import { formatDay, formatNumber, SOURCES, type Period } from "@/blocks/dashboard-analytics/components/dashboard-analytics-data";
const trafficConfig = {
  visitors: {
    label: "This period" as const,
    color: "var(--chart-1)" as const
  },
  previous: {
    label: "Period before" as const,
    color: "var(--chart-2)" as const
  }
} satisfies ChartConfig;
export const TrafficChart = defineUi<{
  period: Period;
  longName: string;
  className?: string;
}>("TrafficChart", ["period", "longName", "class"], (_props, {
  slots: _slots
}) => {
  const period = computed(() => _props["period"]);
  const longName = computed(() => _props["longName"]);
  const className = computed(() => _props["class"]);
  const data = computed(() => period.value.rows.map((r, i) => ({
    day: r[0],
    visitors: r[1],
    previous: period.value.previous[i]?.[1] ?? null
  })));
  return () => {
    return <Card class={cn("min-w-0", className.value)} seed="analytics-traffic" tape="top" tapeKind="washi-stripes">
      <CardHeader>
        <CardTitle role="heading" aria-level={2}>
          Visitors, day by day
        </CardTitle>
        <CardDescription>Every day in {longName.value}, against the days just before</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={trafficConfig} class="aspect-auto h-64 w-full">
          <AreaChart data={data.value} xKey="day" kinds={{
            visitors: "area" as const,
            previous: "line" as const
          }} xFormatter={v => formatDay(String(v))} label={`Visitors per day in ${longName.value}, compared with the period before`} annotations={[{
            at: "max" as const,
            text: "best day" as const,
            series: "visitors" as const
          }]} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" labelFormatter={v => formatDay(String(v))} />} />
          <ChartLegend />
        </ChartContainer>
      </CardContent>
    </Card>;
  };
});
const sourceConfig = {
  search: {
    label: "Search" as const,
    color: "var(--chart-1)" as const
  },
  direct: {
    label: "Direct" as const,
    color: "var(--chart-2)" as const
  },
  social: {
    label: "Social" as const,
    color: "var(--chart-3)" as const
  },
  referral: {
    label: "Referral" as const,
    color: "var(--chart-4)" as const
  },
  email: {
    label: "Email" as const,
    color: "var(--chart-5)" as const
  }
} satisfies ChartConfig;
export const SourcesChart = defineUi<{
  period: Period;
  className?: string;
}>("SourcesChart", ["period", "class"], (_props, {
  slots: _slots
}) => {
  const period = computed(() => _props["period"]);
  const className = computed(() => _props["class"]);
  const data = computed(() => SOURCES.map(s => ({
    source: s.source.toLowerCase(),
    visitors: Math.round(period.value.visitors * s.share)
  })));
  const total = computed(() => data.value.reduce((a, d) => a + d.visitors, 0));
  return () => {
    return <Card class={cn("min-w-0", className.value)} seed="analytics-sources">
      <CardHeader>
        <CardTitle role="heading" aria-level={2}>
          Where they came from
        </CardTitle>
        <CardDescription>Visitors by the door they used</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={sourceConfig} class="aspect-auto h-64 w-full">
          <DonutChart data={data.value} nameKey="source" valueKey="visitors" label="Visitors by source" showLabels={false} centerLabel={{
            value: formatNumber(total.value),
            label: "visitors" as const
          }} />
          <ChartTooltip />
          <ChartLegend />
        </ChartContainer>
      </CardContent>
    </Card>;
  };
});
