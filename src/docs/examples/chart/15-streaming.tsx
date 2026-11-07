// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { AreaChart, ChartContainer, ChartTooltip, Sparkline, type ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
export const meta = {
  title: "Streaming data" as const,
  description: "New points arrive every second and the chart is drawn again, not reflowed: the hand stays the same, so the line seems to move by itself. The wipe-on animation plays once; a redraw is silent. Pause to read the tooltip." as const,
  layout: "stack" as const
};
const config = {
  rps: {
    label: "Requests / s" as const,
    color: "var(--chart-2)" as const
  }
} satisfies ChartConfig;
const sample = (t: number) => Math.round(120 + 50 * Math.sin(t / 5) + 22 * Math.sin(t / 1.7) + t * 37 % 9);
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const tick = shallowRef(initialState(40));
  const setTick = stateSetter(tick);
  const running = shallowRef(initialState(true));
  const setRunning = stateSetter(running);
  watchDependencies(() => {
    if (!running.value) return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, () => [running.value], false);
  const data = computed(() => Array.from({
    length: 30
  }, (_, i) => ({
    t: `${tick.value - 29 + i}s`,
    rps: sample(tick.value - 29 + i)
  })));
  return () => {
    return <div class="mx-auto flex w-full max-w-xl flex-col gap-3">
      <div class="flex items-center gap-4">
        <Button size="sm" variant={running.value ? "outline" as const : "default" as const} onClick={() => setRunning(r => !r)}>
          {running.value ? "pause" as const : "resume" as const}
        </Button>
        <span class="font-script text-2xl tabular-nums">{data.value[data.value.length - 1].rps}</span>
        <Sparkline data={data.value} dataKey="rps" label="Requests per second, last 30 seconds" class="h-8 w-24" />
      </div>
      <ChartContainer config={config} class="aspect-auto h-56 w-full">
        <AreaChart data={data.value} xKey="t" curve="smooth" label="Requests per second" yDomain={[0, 240]} />
        <ChartTooltip />
      </ChartContainer>
    </div>;
  };
});
export default Example;
