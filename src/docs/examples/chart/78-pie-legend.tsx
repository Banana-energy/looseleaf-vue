// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { PieChart, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { browsers } from "./_data";
export const meta = {
  title: "Pie: legend" as const,
  description: "`<ChartLegend />` names the slices with the swatches the drawing uses, and each entry switches its slice off; the pie redraws from the rest." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const config = {
  chrome: {
    label: "Chrome" as const,
    color: "var(--chart-1)" as const
  },
  safari: {
    label: "Safari" as const,
    color: "var(--chart-2)" as const
  },
  firefox: {
    label: "Firefox" as const,
    color: "var(--chart-3)" as const
  },
  edge: {
    label: "Edge" as const,
    color: "var(--chart-4)" as const
  },
  other: {
    label: "Other" as const,
    color: "var(--chart-5)" as const
  }
} satisfies ChartConfig;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Pie Chart - Legend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} class="mx-auto aspect-square h-auto w-full max-w-[280px]">
          <PieChart data={browsers} nameKey="browser" valueKey="visitors" showLabels={false} label="Visitors by browser" />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <ChartLegend />
        </ChartContainer>
      </CardContent>
    </Card>;
  };
});
export default Example;
