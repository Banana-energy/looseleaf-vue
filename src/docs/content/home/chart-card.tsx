// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { BarChart, ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
const DATA = [{
  day: "Mon" as const,
  signups: 42
}, {
  day: "Tue" as const,
  signups: 58
}, {
  day: "Wed" as const,
  signups: 35
}, {
  day: "Thu" as const,
  signups: 71
}, {
  day: "Fri" as const,
  signups: 64
}, {
  day: "Sat" as const,
  signups: 30
}, {
  day: "Sun" as const,
  signups: 22
}];
const CONFIG = {
  signups: {
    label: "Signups" as const,
    color: "var(--chart-3)" as const
  }
} satisfies ChartConfig;
const ChartCard = defineUi<{}>("ChartCard", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card data-home="chart" fastener="clip" seed="home-chart" class="w-full gap-3 py-6">
      <CardHeader>
        <CardTitle>Signups</CardTitle>
        <CardDescription>This week. The record is circled.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={CONFIG} class="aspect-auto h-56 w-full">
          <BarChart data={DATA} xKey="day" label="Signups per day this week" annotations={[{
            at: "max" as const,
            text: "launch day!" as const,
            pen: "blue" as const
          }]} />
          <ChartTooltip />
        </ChartContainer>
      </CardContent>
    </Card>;
  };
});
export default ChartCard;
