// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { AreaChart, ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { desktopOnly, short, monthOfRow } from "./_data";
export const meta = {
  title: "Area: default" as const,
  description: "One series washed in marker and shaded in pencil, a felt line along the top. Hover or use the arrow keys: the tooltip's `indicator=\"line\"` gives it a bar instead of a chip, and a hand-drawn note points at the peak. The axis says Jan; `labelFormatter` reads the whole month from the row for the slip." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const config = {
  desktop: {
    label: "Desktop" as const,
    color: "var(--chart-1)" as const
  }
} satisfies ChartConfig;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Area Chart</CardTitle>
        <CardDescription>Showing total visitors for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} class="aspect-auto h-64 w-full">
          <AreaChart data={desktopOnly} xKey="month" xFormatter={short} showYAxis={false} label="Desktop visitors per month" annotations={[{
            at: "max" as const,
            text: "peak!" as const,
            pen: "blue" as const
          }]} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" labelFormatter={monthOfRow} />} />
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
