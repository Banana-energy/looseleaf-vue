// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { BarChart, ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
export const meta = {
  title: "Tooltip content" as const,
  description: "ChartTooltipContent keeps shadcn's props: indicator (dot, line, dashed), hideLabel, hideIndicator, labelFormatter and formatter. Or pass any element as content: it is cloned with active, payload and label. defaultIndex opens a tooltip on load." as const,
  layout: "stack" as const
};
const rows = [{
  month: "January" as const,
  desktop: 186,
  mobile: 80
}, {
  month: "February" as const,
  desktop: 305,
  mobile: 200
}, {
  month: "March" as const,
  desktop: 237,
  mobile: 120
}, {
  month: "April" as const,
  desktop: 73,
  mobile: 190
}];
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
    return <div class="mx-auto grid w-full max-w-3xl gap-6 sm:grid-cols-2">
      <ChartContainer config={config} class="aspect-auto h-56 w-full">
        <BarChart data={rows} xKey="month" xFormatter={m => String(m).slice(0, 3)} label="Indicator: line" />
        <ChartTooltip content={<ChartTooltipContent indicator="line" labelFormatter={l => `In ${String(l)}`} />} defaultIndex={1} />
      </ChartContainer>
      <ChartContainer config={config} class="aspect-auto h-56 w-full">
        <BarChart data={rows} xKey="month" xFormatter={m => String(m).slice(0, 3)} label="Formatter" />
        <ChartTooltip content={<ChartTooltipContent hideIndicator formatter={(value, name) => <span class="flex w-full justify-between gap-4">
                  <span class="text-muted-foreground">{name}</span>
                  <span class="font-script text-lg leading-none font-bold">{`${value} visits`}</span>
                </span>} />} defaultIndex={2} />
      </ChartContainer>
    </div>;
  };
});
export default Example;
