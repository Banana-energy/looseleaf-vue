// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { ChartContainer, ChartLegend, ChartTooltip, LineChart, type ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
export const meta = {
  title: "Legend and hidden series" as const,
  description: "Every legend entry is a button with aria-pressed: switch a series off (struck through) and on again. A series keeps its color, marker and dash while it is away. Control it from outside with hiddenSeries." as const,
  layout: "stack" as const
};
const rows = [{
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
  const hidden = shallowRef<string[]>(initialState(["tablet"]));
  const setHidden = stateSetter(hidden);
  return () => {
    return <div class="mx-auto flex w-full max-w-xl flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setHidden([])}>
          all
        </Button>
        <Button size="sm" variant="outline" onClick={() => setHidden(["desktop", "tablet"])}>
          only mobile
        </Button>
        <Button size="sm" variant="outline" onClick={() => setHidden(["mobile", "tablet"])}>
          only desktop
        </Button>
      </div>
      <ChartContainer config={config} hiddenSeries={hidden.value} onHiddenSeriesChange={setHidden} class="aspect-auto h-64 w-full">
        <LineChart data={rows} xKey="month" label="Visitors by device" />
        <ChartTooltip />
        <ChartLegend />
      </ChartContainer>
    </div>;
  };
});
export default Example;
