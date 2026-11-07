// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { BarChart, ChartContainer, ChartLegend, ChartTooltip, LineChart, type ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
export const meta = {
  title: "Color is not the only channel" as const,
  description: "Every series carries a pencil pattern (hatching, dots, cross-hatching, rules, scribble) on its marks, and a marker shape and a dash pattern on its lines. Switch to grayscale to see the chart still reads; switch the patterns off (`patterns={false}`) to see what plain color would have left you." as const,
  layout: "stack" as const
};
const rows = [{
  quarter: "Q1" as const,
  north: 120,
  south: 90,
  east: 60,
  west: 40
}, {
  quarter: "Q2" as const,
  north: 150,
  south: 70,
  east: 80,
  west: 55
}, {
  quarter: "Q3" as const,
  north: 110,
  south: 100,
  east: 95,
  west: 30
}, {
  quarter: "Q4" as const,
  north: 180,
  south: 120,
  east: 70,
  west: 65
}];
const config = {
  north: {
    label: "North" as const,
    color: "var(--chart-1)" as const
  },
  south: {
    label: "South" as const,
    color: "var(--chart-2)" as const
  },
  east: {
    label: "East" as const,
    color: "var(--chart-3)" as const
  },
  west: {
    label: "West" as const,
    color: "var(--chart-4)" as const
  }
} satisfies ChartConfig;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const grey = shallowRef(initialState(true));
  const setGrey = stateSetter(grey);
  const patterns = shallowRef(initialState(true));
  const setPatterns = stateSetter(patterns);
  return () => {
    return <div class="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div class="flex flex-wrap gap-2">
        <Button size="sm" variant={grey.value ? "default" as const : "outline" as const} aria-pressed={grey.value} onClick={() => setGrey(g => !g)}>
          grayscale
        </Button>
        <Button size="sm" variant={patterns.value ? "default" as const : "outline" as const} aria-pressed={patterns.value} onClick={() => setPatterns(p => !p)}>
          patterns
        </Button>
      </div>
      <div class={`grid gap-6 sm:grid-cols-2 ${grey.value ? "grayscale" as const : "" as const}`}>
        <ChartContainer config={config} patterns={patterns.value ? "auto" as const : false} class="aspect-auto h-64 w-full">
          <BarChart data={rows} xKey="quarter" label="Sales by region, bars" showValues={false} />
          <ChartTooltip />
          <ChartLegend />
        </ChartContainer>
        <ChartContainer config={config} patterns={patterns.value ? "auto" as const : false} class="aspect-auto h-64 w-full">
          <LineChart data={rows} xKey="quarter" label="Sales by region, lines" dots />
          <ChartTooltip />
          <ChartLegend />
        </ChartContainer>
      </div>
    </div>;
  };
});
export default Example;
