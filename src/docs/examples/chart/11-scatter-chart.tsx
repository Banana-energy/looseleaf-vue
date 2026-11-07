// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { ChartContainer, ChartLegend, ChartTooltip, ScatterChart, type ChartConfig } from "@/components/ui/chart";
export const meta = {
  title: "Scatter and bubbles" as const,
  description: "Points on two number lines, each series with its own marker shape (circle, square, triangle). Give a size key and the points grow into bubbles. Long point clouds are thinned so the drawing stays light." as const,
  layout: "stack" as const
};
const cloud = Array.from({
  length: 36
}, (_, i) => {
  const x = 20 + i * 2.2 + i * 13 % 7;
  return {
    height: Math.round(x),
    cats: 30 + i * 1.1 + i * 29 % 19,
    dogs: 24 + i * 0.7 + i * 17 % 23,
    age: 2 + i * 5 % 14
  };
});
const config = {
  cats: {
    label: "Cats" as const,
    color: "var(--chart-1)" as const
  },
  dogs: {
    label: "Dogs" as const,
    color: "var(--chart-2)" as const
  }
} satisfies ChartConfig;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-auto grid w-full max-w-3xl gap-6 sm:grid-cols-2">
      <ChartContainer config={config} class="aspect-auto h-64 w-full">
        <ScatterChart data={cloud} xKey="height" series={["cats", "dogs"]} xLabel="Height" label="Weight by height for cats and dogs" />
        <ChartTooltip />
        <ChartLegend />
      </ChartContainer>
      <ChartContainer config={{
        cats: {
          label: "Cats" as const,
          color: "var(--chart-3)" as const
        }
      }} class="aspect-auto h-64 w-full">
        <ScatterChart data={cloud} xKey="height" series={["cats"]} sizeKey="age" xLabel="Height" label="Weight by height, sized by age" />
        <ChartTooltip />
      </ChartContainer>
    </div>;
  };
});
export default Example;
