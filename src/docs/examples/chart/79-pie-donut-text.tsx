// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { DonutChart, ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { browsersBig, thousands } from "./_data";
export const meta = {
  title: "Pie: donut, text" as const,
  description: "The hole is real DOM text: a number in the script hand and a caption. Here it is the total; a function of `{ total, active }` can show the slice under the pointer instead." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const total = browsersBig.reduce((sum, b) => sum + b.visitors, 0);
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
    return <Card class="mx-auto w-full max-w-md" fastener="pin">
      <CardHeader>
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} class="mx-auto aspect-square h-auto w-full max-w-[280px]">
          <DonutChart data={browsersBig} nameKey="browser" valueKey="visitors" showLabels={false} label="Visitors by browser" centerLabel={{
            value: thousands(total),
            label: "Visitors" as const
          }} />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
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
