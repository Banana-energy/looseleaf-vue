// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { BarChart, ChartContainer, ChartTooltip, LineChart, type ChartAnnotation, type ChartConfig, type ChartHighlight } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
export const meta = {
  title: "Annotations and goal lines" as const,
  description: "A note is a hand-drawn loop, an arrow and a line of script; a highlight marks a stretch of days with a highlighter, written after the chart appears. Point it at max, min, first, last, a category or an index; underline instead of circling; add a dashed goal line. Text is real DOM text and the note is part of the chart's spoken summary." as const,
  layout: "stack" as const
};
const week = [{
  day: "Mon" as const,
  sales: 12
}, {
  day: "Tue" as const,
  sales: 19
}, {
  day: "Wed" as const,
  sales: 8
}, {
  day: "Thu" as const,
  sales: 24
}, {
  day: "Fri" as const,
  sales: 16
}, {
  day: "Sat" as const,
  sales: 21
}, {
  day: "Sun" as const,
  sales: 14
}];
const config = {
  sales: {
    label: "Sales" as const,
    color: "var(--chart-1)" as const
  }
} satisfies ChartConfig;
const highlights: Record<string, ChartHighlight[]> = {
  "best day": [],
  "rainy day": [{
    from: "Tue" as const,
    to: "Wed" as const,
    text: "storm" as const
  }],
  "both ends": [{
    from: "Fri" as const,
    to: "Sun" as const,
    text: "weekend" as const
  }]
};
const notes: Record<string, ChartAnnotation[]> = {
  "best day": [{
    at: "max" as const,
    text: "best day!" as const,
    pen: "blue" as const
  }],
  "rainy day": [{
    at: "Wed" as const,
    text: "rainy day" as const,
    pen: "ink" as const,
    shape: "underline" as const,
    dx: 44,
    dy: -56
  }],
  "both ends": [{
    at: "first" as const,
    text: "slow start" as const,
    pen: "red" as const,
    shape: "loop" as const
  }, {
    at: "last" as const,
    text: "still going" as const,
    pen: "green" as const,
    shape: "loop" as const
  }]
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const which = shallowRef(initialState("best day"));
  const setWhich = stateSetter(which);
  return () => {
    return <div class="mx-auto flex w-full max-w-xl flex-col gap-3">
      <div class="flex flex-wrap gap-2" role="group" aria-label="Annotation">
        {Object.keys(notes).map(k => <Button key={k} size="sm" variant={k === which.value ? "default" as const : "outline" as const} aria-pressed={k === which.value} onClick={() => setWhich(k)}>
            {k}
          </Button>)}
      </div>
      <ChartContainer config={config} class="aspect-auto h-64 w-full">
        <BarChart data={week} xKey="day" label="Sales per day" annotations={notes[which.value]} highlights={highlights[which.value]} references={[{
          y: 18,
          label: "goal" as const,
          pen: "red" as const
        }]} />
        <ChartTooltip />
      </ChartContainer>
      <ChartContainer config={config} class="aspect-auto h-48 w-full">
        <LineChart data={week} xKey="day" label="Sales per day, as a line" annotations={[{
          at: "min" as const,
          text: "dip" as const,
          pen: "red" as const,
          dx: -60,
          dy: -8
        }, {
          at: "max" as const,
          text: "peak" as const,
          pen: "blue" as const,
          dx: 60,
          dy: -8
        }]} />
      </ChartContainer>
    </div>;
  };
});
export default Example;
