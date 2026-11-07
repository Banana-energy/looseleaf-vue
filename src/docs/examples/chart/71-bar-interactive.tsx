// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { BarChart, ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { daily, dayLabel, thousands, dayOfRow } from "./_data";
export const meta = {
  title: "Bar: interactive" as const,
  description: "Two big buttons total the columns and choose which one the chart draws. They are ordinary toggle buttons with `aria-pressed`; the chart takes the chosen key as its only series." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const KEYS = ["desktop", "mobile"] as const;
const totals = {
  desktop: daily.reduce((sum, d) => sum + d.desktop, 0),
  mobile: daily.reduce((sum, d) => sum + d.mobile, 0)
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
  const active = shallowRef<typeof KEYS[number]>(initialState("desktop"));
  const setActive = stateSetter(active);
  return () => {
    return <Card class="mx-auto w-full max-w-md" tape="top">
      <CardHeader>
        <CardTitle>Bar Chart - Interactive</CardTitle>
        <CardDescription>Showing total visitors for the last 3 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="mb-4 grid grid-cols-2 gap-2">
          {KEYS.map(key => <Button key={key} variant={active.value === key ? "default" as const : "outline" as const} aria-pressed={active.value === key} onClick={() => setActive(key)} class="h-auto flex-col items-start gap-1 py-2">
              <span class="text-xs">{config[key].label}</span>
              <span class="font-script text-2xl leading-none font-bold">{thousands(totals[key])}</span>
            </Button>)}
        </div>
        <ChartContainer config={config} class="aspect-auto h-64 w-full">
          <BarChart data={daily} xKey="date" xFormatter={dayLabel} series={[active.value]} label={`${config[active.value].label} visitors per day`} />
          <ChartTooltip content={<ChartTooltipContent labelFormatter={dayOfRow} />} />
        </ChartContainer>
      </CardContent>
    </Card>;
  };
});
export default Example;
