// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, RadarChart, type ChartConfig } from "@/components/ui/chart";
export const meta = {
  title: "Radar chart" as const,
  description: "A pencil web with a washed and shaded shape per series. The spokes are the keyboard stops: arrow keys walk from axis to axis and the tooltip reads every series on that spoke." as const,
  layout: "stack" as const
};
const skills = [{
  skill: "Speed" as const,
  ada: 80,
  bo: 50
}, {
  skill: "Power" as const,
  ada: 60,
  bo: 85
}, {
  skill: "Range" as const,
  ada: 90,
  bo: 45
}, {
  skill: "Craft" as const,
  ada: 70,
  bo: 80
}, {
  skill: "Wit" as const,
  ada: 55,
  bo: 90
}, {
  skill: "Luck" as const,
  ada: 65,
  bo: 40
}];
const config = {
  ada: {
    label: "Ada" as const,
    color: "var(--chart-1)" as const
  },
  bo: {
    label: "Bo" as const,
    color: "var(--chart-2)" as const
  }
} satisfies ChartConfig;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <ChartContainer config={config} class="mx-auto aspect-auto h-80 w-full max-w-md">
      <RadarChart data={skills} xKey="skill" max={100} label="Skills of Ada and Bo" />
      <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
      <ChartLegend />
    </ChartContainer>;
  };
});
export default Example;
