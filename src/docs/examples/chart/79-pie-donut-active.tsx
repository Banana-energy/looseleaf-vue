// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { DonutChart, ChartCenterLabel, ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { browsers } from "./_data";
export const meta = {
  title: "Pie: donut, active slice" as const,
  description: "`defaultIndex` lights the first slice before anyone hovers, and the hole tells its story. Move over another slice, or use the arrow keys, and the light and the text follow." as const,
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
        <CardTitle>Pie Chart - Donut Active</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} class="mx-auto aspect-square h-auto w-full max-w-[280px]">
          <DonutChart data={browsers} nameKey="browser" valueKey="visitors" showLabels={false} label="Visitors by browser" centerLabel={({
            active
          }) => <ChartCenterLabel value={active?.value ?? ""} label={active?.name ?? ""} />} />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} defaultIndex={0} />
        </ChartContainer>
      </CardContent>
      <CardFooter class="flex-col items-start gap-2 text-sm">
        <div class="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <Icon name="trending-up" size={16} />
        </div>
        <div class="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
      </CardFooter>
    </Card>;
  };
});
export default Example;
