// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { ChartCenterLabel, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, DonutChart, PieChart, type ChartConfig } from "@/components/ui/chart";
export const meta = {
  title: "Pie and donut" as const,
  description: "Slices colored in with a marker, separated by felt lines, each with its own pencil pattern. The donut's hole is DOM text: it shows the total, and the slice under the pointer or the arrow keys." as const,
  layout: "stack" as const
};
const browsers = [{
  browser: "chrome" as const,
  visitors: 275
}, {
  browser: "safari" as const,
  visitors: 200
}, {
  browser: "firefox" as const,
  visitors: 187
}, {
  browser: "edge" as const,
  visitors: 173
}, {
  browser: "other" as const,
  visitors: 90
}];
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
    return <div class="mx-auto grid w-full max-w-3xl gap-6 sm:grid-cols-2">
      <ChartContainer config={config} class="aspect-square h-auto w-full">
        <PieChart data={browsers} nameKey="browser" valueKey="visitors" label="Visitors by browser" />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend />
      </ChartContainer>
      <ChartContainer config={config} class="aspect-square h-auto w-full">
        <DonutChart data={browsers} nameKey="browser" valueKey="visitors" label="Visitors by browser, donut" centerLabel={({
          total,
          active
        }) => <ChartCenterLabel value={active ? active.value : total} label={active ? active.name : "visitors" as const} />} />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend />
      </ChartContainer>
    </div>;
  };
});
export default Example;
