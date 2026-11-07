// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { REFERENCE_DAY, visitors } from "@/blocks/dashboard-01/components/dashboard-01-data";
const chartConfig = {
  desktop: {
    label: "Desktop" as const,
    color: "var(--chart-1)" as const
  },
  mobile: {
    label: "Mobile" as const,
    color: "var(--chart-2)" as const
  }
} satisfies ChartConfig;
const RANGES = [{
  value: "90d" as const,
  label: "Last 3 months" as const,
  days: 90
}, {
  value: "30d" as const,
  label: "Last 30 days" as const,
  days: 30
}, {
  value: "7d" as const,
  label: "Last 7 days" as const,
  days: 7
}] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatDay(iso: string): string {
  const [, month, day] = iso.split("-");
  return `${MONTHS[Number(month) - 1] ?? month} ${Number(day)}`;
}
function cutoff(days: number): string {
  const d = new Date(`${REFERENCE_DAY}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}
export const ChartAreaInteractive = defineUi<{}>("ChartAreaInteractive", [], (_props, {
  slots: _slots
}) => {
  const isMobile = useIsMobile();
  const range = shallowRef<string>(initialState("90d"));
  const setRange = stateSetter(range);
  watchDependencies(() => {
    if (isMobile.value) setRange("7d");
  }, () => [isMobile.value], false);
  const days = computed(() => RANGES.find(r => r.value === range.value)?.days ?? 90);
  const start = computed(() => cutoff(days.value));
  const data = computed(() => visitors.filter(row => row.date >= start.value));
  const current = computed(() => RANGES.find(r => r.value === range.value)?.label ?? "Last 3 months");
  return () => {
    return <Card class="@container/card [&>[data-slot=fastener]]:left-10 @[400px]/card:[&>[data-slot=fastener]]:left-1/2" fastener="pin" seed="s01-visitors">
      <CardHeader>
        <CardTitle role="heading" aria-level={2}>
          Total visitors
        </CardTitle>
        <CardDescription>
          <span class="hidden @[540px]/card:block">Total for the {current.value.toLowerCase()}</span>
          <span class="@[540px]/card:hidden">{current.value}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup type="single" value={range.value} onValueChange={v => v && setRange(v)} variant="outline" aria-label="Time range" class="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex">
            {RANGES.map(r => <ToggleGroupItem key={r.value} value={r.value}>
                {r.label}
              </ToggleGroupItem>)}
          </ToggleGroup>
          <Select value={range.value} onValueChange={setRange}>
            <SelectTrigger class="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden" size="sm" aria-label="Time range">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent>
              {RANGES.map(r => <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent class="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} class="aspect-auto h-[250px] w-full">
          <AreaChart data={data.value} xKey="date" stacked xFormatter={v => formatDay(String(v))} label={`Visitors per day, ${current.value.toLowerCase()}`} annotations={[{
            at: "max" as const,
            text: "best day" as const,
            series: "desktop" as const
          }]} />
          <ChartTooltip content={<ChartTooltipContent indicator="dot" labelFormatter={v => formatDay(String(v))} />} />
          <ChartLegend />
        </ChartContainer>
      </CardContent>
    </Card>;
  };
});
