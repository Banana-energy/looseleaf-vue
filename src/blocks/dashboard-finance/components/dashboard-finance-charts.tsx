// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, DonutChart, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { CATEGORIES, cashFlow, money, spentBy, type Transaction } from "@/blocks/dashboard-finance/components/dashboard-finance-data";
const flowConfig = {
  income: {
    label: "Money in" as const,
    color: "var(--chart-3)" as const
  },
  spending: {
    label: "Money out" as const,
    color: "var(--chart-1)" as const
  }
} satisfies ChartConfig;
const dollars = (n: number) => money(Math.round(n) * 100).replace(/\.00$/, "");
export const CashFlow = defineUi<{
  list: readonly Transaction[];
  className?: string;
}>("CashFlow", ["list", "class"], (_props, {
  slots: _slots
}) => {
  const list = computed(() => _props["list"]);
  const className = computed(() => _props["class"]);
  const data = computed(() => cashFlow(list.value));
  return () => {
    return <Card class={cn("min-w-0", className.value)} seed="finance-flow">
      <CardHeader>
        <CardTitle role="heading" aria-level={2}>
          In and out
        </CardTitle>
        <CardDescription>Money in against money out, April to September</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={flowConfig} class="aspect-auto h-64 w-full">
          <BarChart data={data.value} xKey="month" label="Money in and money out per month, April to September" yFormatter={v => dollars(v)} valueFormatter={v => dollars(v)} annotations={[{
            at: "min" as const,
            series: "income" as const,
            text: "a slow month" as const
          }]} />
          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
          <ChartLegend />
        </ChartContainer>
      </CardContent>
    </Card>;
  };
});
const slug = (c: string) => c.toLowerCase().replace(/[^a-z]+/g, "-");
export const Spending = defineUi<{
  list: readonly Transaction[];
  month: string;
  monthName: string;
  className?: string;
}>("Spending", ["list", "month", "monthName", "class"], (_props, {
  slots: _slots
}) => {
  const list = computed(() => _props["list"]);
  const month = computed(() => _props["month"]);
  const monthName = computed(() => _props["monthName"]);
  const className = computed(() => _props["class"]);
  const spent = computed(() => spentBy(list.value, month.value));
  const data = computed(() => CATEGORIES.filter(c => spent.value[c]).map(c => ({
    category: slug(c),
    cents: spent.value[c]
  })));
  const config = computed(() => Object.fromEntries(CATEGORIES.filter(c => spent.value[c]).map(c => [slug(c), {
    label: c
  }])) satisfies ChartConfig);
  const total = computed(() => data.value.reduce((a, d) => a + d.cents, 0));
  return () => {
    return <Card class={cn("min-w-0", className.value)} seed="finance-spending">
      <CardHeader>
        <CardTitle role="heading" aria-level={2}>
          Where it went
        </CardTitle>
        <CardDescription>Money out in {monthName.value}, by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config.value} class="aspect-auto h-64 w-full">
          <DonutChart data={data.value} nameKey="category" valueKey="cents" label={`Money out in ${monthName.value}, by category`} showLabels={false} valueFormatter={v => money(v)} centerLabel={{
            value: dollars(total.value / 100),
            label: "spent" as const
          }} />
          <ChartTooltip />
          <ChartLegend />
        </ChartContainer>
      </CardContent>
    </Card>;
  };
});
