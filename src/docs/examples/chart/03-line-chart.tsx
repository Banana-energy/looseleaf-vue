// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, LineChart, type ChartConfig } from "@/components/ui/chart";
export const meta = {
  title: "Line chart" as const,
  description: "A felt line per series, with a marker shape and a dash pattern for each so lines survive black-and-white print. The legend switches series off; the tooltip follows the pointer and the arrow keys." as const,
  layout: "stack" as const
};
const visitors = [{
  month: "Jan" as const,
  desktop: 186,
  mobile: 80,
  tablet: 40
}, {
  month: "Feb" as const,
  desktop: 305,
  mobile: 200,
  tablet: 66
}, {
  month: "Mar" as const,
  desktop: 237,
  mobile: 120,
  tablet: 90
}, {
  month: "Apr" as const,
  desktop: 73,
  mobile: 190,
  tablet: 84
}, {
  month: "May" as const,
  desktop: 209,
  mobile: 130,
  tablet: 72
}, {
  month: "Jun" as const,
  desktop: 214,
  mobile: 140,
  tablet: 110
}];
const config = {
  desktop: {
    label: "Desktop" as const,
    color: "var(--chart-1)" as const
  },
  mobile: {
    label: "Mobile" as const,
    color: "var(--chart-2)" as const
  },
  tablet: {
    label: "Tablet" as const,
    color: "var(--chart-3)" as const
  }
} satisfies ChartConfig;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <ChartContainer config={config} class="mx-auto aspect-auto h-72 w-full max-w-xl">
      <LineChart data={visitors} xKey="month" label="Visitors by device, January to June" annotations={[{
        at: "max" as const,
        series: "desktop" as const,
        text: "launch" as const,
        pen: "red" as const
      }]} />
      <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
      <ChartLegend />
    </ChartContainer>;
  };
});
export default Example;
