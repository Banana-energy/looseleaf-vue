// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { BarChart, ChartContainer, ChartLegend, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
export const meta = {
  title: "Grouped, stacked, sideways" as const,
  description: "One dataset, four ways to lay it out. Each series keeps its color and its pencil pattern (hatching, dots, cross-hatching), so the bars stay apart in grayscale. Negative values hang below the line." as const,
  layout: "stack" as const
};
const rows = [{
  quarter: "Q1" as const,
  income: 120,
  costs: -60,
  tax: -12
}, {
  quarter: "Q2" as const,
  income: 150,
  costs: -90,
  tax: -18
}, {
  quarter: "Q3" as const,
  income: 90,
  costs: -40,
  tax: -9
}, {
  quarter: "Q4" as const,
  income: 180,
  costs: -110,
  tax: -22
}];
const config = {
  income: {
    label: "Income" as const,
    color: "var(--chart-1)" as const
  },
  costs: {
    label: "Costs" as const,
    color: "var(--chart-2)" as const
  },
  tax: {
    label: "Tax" as const,
    color: "var(--chart-3)" as const
  }
} satisfies ChartConfig;
const modes = ["grouped", "stacked", "sideways"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const mode = shallowRef<typeof modes[number]>(initialState("grouped"));
  const setMode = stateSetter(mode);
  return () => {
    return <div class="mx-auto flex w-full max-w-xl flex-col gap-3">
      <div class="flex gap-2" role="group" aria-label="Layout">
        {modes.map(m => <Button key={m} size="sm" variant={m === mode.value ? "default" as const : "outline" as const} aria-pressed={m === mode.value} onClick={() => setMode(m)}>
            {m}
          </Button>)}
      </div>
      <ChartContainer config={config} class="aspect-auto h-72 w-full">
        <BarChart data={rows} xKey="quarter" stacked={mode.value === "stacked"} horizontal={mode.value === "sideways"} label="Income, costs and tax by quarter" />
        <ChartTooltip />
        <ChartLegend />
      </ChartContainer>
    </div>;
  };
});
export default Example;
