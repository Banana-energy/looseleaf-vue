// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { BarChart, ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export const meta = {
  title: "Bar chart" as const,
  description: "Bars colored in with a marker that misses the outline a little, numbers on top, and the best day circled by hand. Hover or press the arrow keys: a highlighter lights the column and a slip of paper names it." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const sales = [{
  day: "Mon" as const,
  sales: 12
}, {
  day: "Tue" as const,
  sales: 19
}, {
  day: "Wed" as const,
  sales: 8
}, {
  day: "Thu" as const,
  sales: 24
}, {
  day: "Fri" as const,
  sales: 16
}, {
  day: "Sat" as const,
  sales: 21
}, {
  day: "Sun" as const,
  sales: 14
}];
const config = {
  sales: {
    label: "Sales" as const,
    color: "var(--chart-1)" as const
  }
} satisfies ChartConfig;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="mx-auto w-full max-w-lg" seed="bar">
      <CardHeader>
        <CardTitle>Sales this week</CardTitle>
        <CardDescription>Units sold, Monday to Sunday</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} class="aspect-auto h-64 w-full">
          <BarChart data={sales} xKey="day" label="Units sold per day" annotations={[{
            at: "max" as const,
            text: "best day!" as const,
            pen: "blue" as const
          }]} />
          <ChartTooltip content={<ChartTooltipContent hideLabel={false} />} />
        </ChartContainer>
      </CardContent>
    </Card>;
  };
});
export default Example;
