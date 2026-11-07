// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { AreaChart, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export const meta = {
  title: "Area chart" as const,
  description: "The space under the line is washed with the series color and shaded in pencil: hatching, dots, cross-hatching. Stacked areas add up; the tooltip lists every layer." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const traffic = [{
  month: "Jan" as const,
  direct: 186,
  search: 80,
  social: 40
}, {
  month: "Feb" as const,
  direct: 305,
  search: 200,
  social: 66
}, {
  month: "Mar" as const,
  direct: 237,
  search: 120,
  social: 90
}, {
  month: "Apr" as const,
  direct: 73,
  search: 190,
  social: 84
}, {
  month: "May" as const,
  direct: 209,
  search: 130,
  social: 72
}, {
  month: "Jun" as const,
  direct: 214,
  search: 140,
  social: 110
}];
const config = {
  direct: {
    label: "Direct" as const,
    color: "var(--chart-1)" as const
  },
  search: {
    label: "Search" as const,
    color: "var(--chart-2)" as const
  },
  social: {
    label: "Social" as const,
    color: "var(--chart-3)" as const
  }
} satisfies ChartConfig;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="mx-auto w-full max-w-xl" seed="area">
      <CardHeader>
        <CardTitle>Traffic by source</CardTitle>
        <CardDescription>Visits per month, stacked</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} class="aspect-auto h-64 w-full">
          <AreaChart data={traffic} xKey="month" stacked label="Visits by source, January to June" />
          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
          <ChartLegend />
        </ChartContainer>
      </CardContent>
    </Card>;
  };
});
export default Example;
