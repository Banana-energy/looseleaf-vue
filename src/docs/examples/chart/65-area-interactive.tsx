// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { AreaChart, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { daily, dayLabel, dayOfRow } from "./_data";
export const meta = {
  title: "Area: interactive" as const,
  description: "A Select in the card header picks how much of the ninety-one days to draw. The chart redraws with its new data and stays quiet: the wipe-on plays once. Dates are cut from the row's own text, so nothing depends on a locale or a time zone." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const RANGES = {
  "90d": 91,
  "30d": 30,
  "7d": 7
} as const;
const config = {
  desktop: {
    label: "Desktop" as const,
    color: "var(--chart-1)" as const
  },
  mobile: {
    label: "Mobile" as const,
    color: "var(--chart-2)" as const
  }
} satisfies ChartConfig;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const range = shallowRef<keyof typeof RANGES>(initialState("90d"));
  const setRange = stateSetter(range);
  return () => {
    return <Card class="mx-auto w-full max-w-md" fastener="pin">
      <CardHeader>
        <CardTitle>Area Chart - Interactive</CardTitle>
        <CardDescription>Showing total visitors for the last 3 months</CardDescription>
        <CardAction>
          <Select value={range.value} onValueChange={v => setRange(v as keyof typeof RANGES)}>
            <SelectTrigger size="sm" class="w-36" aria-label="Time range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} class="aspect-auto h-64 w-full">
          <AreaChart data={daily.slice(-RANGES[range.value])} xKey="date" xFormatter={dayLabel} series={["mobile", "desktop"]} stacked label="Visitors per day" />
          <ChartTooltip content={<ChartTooltipContent labelFormatter={dayOfRow} />} />
          <ChartLegend />
        </ChartContainer>
      </CardContent>
    </Card>;
  };
});
export default Example;
