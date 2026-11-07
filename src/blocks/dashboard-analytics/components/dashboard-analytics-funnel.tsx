// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { Circled } from "@/components/ui/circled";
import { FUNNEL, formatNumber, type Period } from "@/blocks/dashboard-analytics/components/dashboard-analytics-data";
const config = {
  people: {
    label: "People" as const,
    color: "var(--chart-3)" as const
  }
} satisfies ChartConfig;
function biggestDrop() {
  let worst = {
    from: FUNNEL[0].step,
    to: FUNNEL[1].step,
    kept: 1
  };
  for (let i = 1; i < FUNNEL.length; i++) {
    const kept = FUNNEL[i].share / FUNNEL[i - 1].share;
    if (kept < worst.kept) worst = {
      from: FUNNEL[i - 1].step,
      to: FUNNEL[i].step,
      kept
    };
  }
  return worst;
}
export const Funnel = defineUi<{
  period: Period;
  longName: string;
  className?: string;
}>("Funnel", ["period", "longName", "class"], (_props, {
  slots: _slots
}) => {
  const period = computed(() => _props["period"]);
  const longName = computed(() => _props["longName"]);
  const className = computed(() => _props["class"]);
  const data = computed(() => FUNNEL.map(f => ({
    step: f.step,
    people: Math.round(period.value.visitors * f.share)
  })));
  const drop = computed(() => biggestDrop());
  const last = computed(() => FUNNEL[FUNNEL.length - 1]);
  return () => {
    return <Card class={cn("min-w-0", className.value)} seed="analytics-funnel">
      <CardHeader>
        <CardTitle role="heading" aria-level={2}>
          From hello to paid
        </CardTitle>
        <CardDescription>Everyone who visited in {longName.value}, step by step</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} class="aspect-auto h-64 w-full lg:h-88">
          <BarChart data={data.value} xKey="step" horizontal showValues valueFormatter={formatNumber} label={`Shoppers at each step of the checkout, ${longName.value}`} />
          <ChartTooltip />
        </ChartContainer>
      </CardContent>
      <CardFooter class="flex-col items-start gap-1 text-sm">
        <p>
          Most people slip away between <strong>{drop.value.from.toLowerCase()}</strong> and <strong>{drop.value.to.toLowerCase()}</strong>: only{" "}
          <Circled tone="red" class="mx-1.5">{Math.round(drop.value.kept * 100)}%</Circled> go on.
        </p>
        <p class="text-muted-foreground">{Math.round(last.value.share * 1000) / 10}% of visitors end up paying.</p>
      </CardFooter>
    </Card>;
  };
});
