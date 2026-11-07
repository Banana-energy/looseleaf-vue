// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { BarChart, ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { activity, weekday } from "./_data";
export const meta = {
  title: "Tooltip: label from the config" as const,
  description: "`labelKey` looks the label up in the chart config instead of using the category: here the config's `activities` entry titles the slip." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const config = {
  running: {
    label: "Running" as const,
    color: "var(--chart-1)" as const
  },
  swimming: {
    label: "Swimming" as const,
    color: "var(--chart-2)" as const
  },
  activities: {
    label: "Activities" as const
  }
} satisfies ChartConfig;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Tooltip - Custom Label</CardTitle>
        <CardDescription>Tooltip with custom label from chartConfig.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} class="aspect-auto h-64 w-full">
          <BarChart data={activity} xKey="date" xFormatter={weekday} stacked showYAxis={false} label="Calories burned per session" />
          <ChartTooltip content={<ChartTooltipContent labelKey="activities" indicator="line" />} defaultIndex={1} />
        </ChartContainer>
      </CardContent>
    </Card>;
  };
});
export default Example;
