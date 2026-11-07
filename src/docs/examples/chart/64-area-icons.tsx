// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { AreaChart, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { visitors, short, monthOfRow } from "./_data";
export const meta = {
  title: "Area: icons" as const,
  description: "A config `icon` stands in for the swatch in the legend and the tooltip. Here they are the two hand-drawn trend arrows." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const TrendingDownIcon = defineUi<{}>("TrendingDownIcon", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Icon name="trending-down" />;
  };
});
const TrendingUpIcon = defineUi<{}>("TrendingUpIcon", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Icon name="trending-up" />;
  };
});
const config = {
  desktop: {
    label: "Desktop" as const,
    color: "var(--chart-1)" as const,
    icon: TrendingDownIcon
  },
  mobile: {
    label: "Mobile" as const,
    color: "var(--chart-2)" as const,
    icon: TrendingUpIcon
  }
} satisfies ChartConfig;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Area Chart - Icons</CardTitle>
        <CardDescription>Showing total visitors for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} class="aspect-auto h-64 w-full">
          <AreaChart data={visitors} xKey="month" xFormatter={short} series={["mobile", "desktop"]} stacked showYAxis={false} label="Visitors per month, stacked" />
          <ChartTooltip content={<ChartTooltipContent indicator="line" labelFormatter={monthOfRow} />} />
          <ChartLegend />
        </ChartContainer>
      </CardContent>
      <CardFooter class="flex-col items-start gap-2 text-sm">
        <div class="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <Icon name="trending-up" size={16} />
        </div>
        <div class="leading-none text-muted-foreground">January - June 2024</div>
      </CardFooter>
    </Card>;
  };
});
export default Example;
