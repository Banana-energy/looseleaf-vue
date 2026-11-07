// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { DonutChart, ChartCenterLabel, ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { monthSlices, thousands } from "./_data";
export const meta = {
  title: "Pie: interactive" as const,
  description: "A Select in the header chooses the month whose slice is lit (`defaultIndex`); the number in the hole follows. `defaultIndex` is read when the chart mounts, so the chart is keyed on the month and draws itself again. Hovering any slice still takes over." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const config = {
  january: {
    label: "January" as const,
    color: "var(--chart-1)" as const
  },
  february: {
    label: "February" as const,
    color: "var(--chart-2)" as const
  },
  march: {
    label: "March" as const,
    color: "var(--chart-3)" as const
  },
  april: {
    label: "April" as const,
    color: "var(--chart-4)" as const
  },
  may: {
    label: "May" as const,
    color: "var(--chart-5)" as const
  }
} satisfies ChartConfig;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const month = shallowRef(initialState("january"));
  const setMonth = stateSetter(month);
  const index = computed(() => monthSlices.findIndex(s => s.month === month.value));
  return () => {
    return <Card class="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Pie Chart - Interactive</CardTitle>
        <CardDescription>January - May 2024, desktop visitors</CardDescription>
        <CardAction>
          <Select value={month.value} onValueChange={setMonth}>
            <SelectTrigger size="sm" class="w-36" aria-label="Month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              {monthSlices.map(s => <SelectItem key={s.month} value={s.month}>
                  {config[s.month as keyof typeof config].label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer key={month.value} config={config} class="mx-auto aspect-square h-auto w-full max-w-[280px]">
          <DonutChart data={monthSlices} nameKey="month" valueKey="desktop" showLabels={false} label="Desktop visitors by month" centerLabel={({
            active
          }) => {
            const shown = active ?? {
              value: monthSlices[index.value].desktop,
              name: String(config[month.value as keyof typeof config].label)
            };
            return <ChartCenterLabel value={thousands(shown.value)} label={shown.name} />;
          }} />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} defaultIndex={index.value} />
        </ChartContainer>
      </CardContent>
    </Card>;
  };
});
export default Example;
