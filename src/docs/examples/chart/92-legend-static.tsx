// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { LineChart, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { visitors, short, monthOfRow } from "./_data";
export const meta = {
  title: "Legend: a plain key" as const,
  description: "`toggle={false}` makes the legend a plain key: swatches and words, no buttons. Use it where the chart should not change." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
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
  return () => {
    return <Card class="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Legend - Plain Key</CardTitle>
        <CardDescription>A legend that only names the series.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} class="aspect-auto h-64 w-full">
          <LineChart data={visitors} xKey="month" xFormatter={short} showYAxis={false} label="Visitors per month, by device" />
          <ChartTooltip content={<ChartTooltipContent labelFormatter={monthOfRow} />} />
          <ChartLegend toggle={false} />
        </ChartContainer>
      </CardContent>
    </Card>;
  };
});
export default Example;
