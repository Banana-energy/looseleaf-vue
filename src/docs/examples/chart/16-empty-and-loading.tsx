// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { BarChart, ChartContainer, DonutChart, LineChart, type ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
export const meta = {
  title: "Empty and loading" as const,
  description: "A chart with nothing to draw sketches its axes and a wandering pencil line and says so; a loading chart pulses dashed ghost bars and is aria-busy. Neither is interactive, and both keep their name and a spoken summary." as const,
  layout: "stack" as const
};
const rows = [{
  day: "Mon" as const,
  n: 12
}, {
  day: "Tue" as const,
  n: 19
}, {
  day: "Wed" as const,
  n: 8
}, {
  day: "Thu" as const,
  n: 24
}];
const config = {
  n: {
    label: "Orders" as const,
    color: "var(--chart-1)" as const
  }
} satisfies ChartConfig;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const state = shallowRef<"ready" | "loading" | "empty">(initialState("loading"));
  const setState = stateSetter(state);
  return () => {
    return <div class="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div class="flex gap-2" role="group" aria-label="State">
        {(["loading", "empty", "ready"] as const).map(s => <Button key={s} size="sm" variant={s === state.value ? "default" as const : "outline" as const} aria-pressed={s === state.value} onClick={() => setState(s)}>
            {s}
          </Button>)}
      </div>
      <div class="grid gap-6 sm:grid-cols-3">
        <ChartContainer config={config} class="aspect-auto h-48 w-full">
          <BarChart data={state.value === "empty" ? [] : rows} xKey="day" series={["n"]} loading={state.value === "loading"} emptyText="No orders yet" label="Orders" />
        </ChartContainer>
        <ChartContainer config={config} class="aspect-auto h-48 w-full">
          <LineChart data={state.value === "empty" ? [] : rows} xKey="day" series={["n"]} loading={state.value === "loading"} emptyText="Nothing to plot" label="Orders, as a line" />
        </ChartContainer>
        <ChartContainer config={{}} class="aspect-auto h-48 w-full">
          <DonutChart data={state.value === "empty" ? [] : rows} nameKey="day" valueKey="n" loading={state.value === "loading"} emptyText="No data" label="Orders by day" showLabels={false} />
        </ChartContainer>
      </div>
    </div>;
  };
});
export default Example;
