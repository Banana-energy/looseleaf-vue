// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { ChartContainer, ChartTooltip, ChartTooltipContent, Gauge, RadialChart, type ChartConfig } from "@/components/ui/chart";
export const meta = {
  title: "Radial bars and gauge" as const,
  description: "Concentric arcs in pale tracks, one ring per row, and a dial with marker zones and a red felt needle. The gauge is a role=meter: assistive tech reads its value, minimum and maximum." as const,
  layout: "stack" as const
};
const rings = [{
  name: "move" as const,
  value: 78
}, {
  name: "exercise" as const,
  value: 52
}, {
  name: "stand" as const,
  value: 91
}];
const config = {
  move: {
    label: "Move" as const,
    color: "var(--chart-1)" as const
  },
  exercise: {
    label: "Exercise" as const,
    color: "var(--chart-2)" as const
  },
  stand: {
    label: "Stand" as const,
    color: "var(--chart-3)" as const
  }
} satisfies ChartConfig;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-auto grid w-full max-w-3xl items-center gap-8 sm:grid-cols-2">
      <ChartContainer config={config} class="aspect-square h-auto w-full">
        <RadialChart data={rings} nameKey="name" valueKey="value" label="Daily rings" centerLabel={{
          value: "78%" as const,
          label: "of goal" as const
        }} />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
      </ChartContainer>
      <Gauge value={68} label="Server load" zones={[{
        to: 40,
        tone: "good" as const
      }, {
        to: 75,
        tone: "warn" as const
      }, {
        to: 100,
        tone: "bad" as const
      }]} valueFormatter={v => `${v}%`} />
    </div>;
  };
});
export default Example;
