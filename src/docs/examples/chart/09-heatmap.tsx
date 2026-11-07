// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { ChartContainer, ChartTooltip, Heatmap } from "@/components/ui/chart";
export const meta = {
  title: "Heat map" as const,
  description: "A half year of days, each square colored in a shade of one marker; or any grid of your own. Arrow keys walk it in two dimensions: left and right by week, up and down by day." as const,
  layout: "stack" as const
};
const pages = Array.from({
  length: 180
}, (_, i) => {
  const d = new Date(Date.UTC(2026, 0, 1 + i));
  const wave = Math.sin(i / 9) + Math.sin(i / 3.3) + i * 7 % 5 / 2;
  return {
    date: d.toISOString().slice(0, 10),
    value: wave > 0.6 ? Math.round(wave * 2) : 0
  };
});
const hours = ["9am", "11am", "1pm", "3pm", "5pm"];
const week = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const busy = week.flatMap((day, r) => hours.map((h, c) => ({
  day,
  hour: h,
  orders: (r + 1) * (c + 2) * 3 % 17
})));
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <ChartContainer config={{}} class="aspect-[53/14] w-full">
        <Heatmap data={pages} unit="pages" label="Pages written per day" />
        <ChartTooltip />
      </ChartContainer>
      <ChartContainer config={{}} class="aspect-[16/10] w-full max-w-md">
        <Heatmap variant="grid" data={busy} rowKey="day" colKey="hour" valueKey="orders" unit="orders" slot={0} label="Orders by hour" rows={week} cols={hours} showLegend={false} />
        <ChartTooltip />
      </ChartContainer>
    </div>;
  };
});
export default Example;
