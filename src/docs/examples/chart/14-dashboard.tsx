// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { InkProvider } from "@/lib/ink/vue";
import { AreaChart, BarChart, ChartContainer, ChartLegend, ChartTooltip, DonutChart, Sparkline, type ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
export const meta = {
  title: "Dashboard" as const,
  description: "A page of cards: stat tiles with sparklines, an area chart, a bar chart and a donut, drawn by hand. Press \"calm\" for the dense-screen version: hairline rules, no fill offset, no jitter, a busy page that stays quiet." as const,
  layout: "full" as const,
  height: 640,
  stage: "desk" as const
};
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const revenue = months.map((month, i) => ({
  month,
  revenue: [18, 26, 22, 31, 29, 38][i] * 100,
  costs: [12, 15, 14, 18, 17, 21][i] * 100
}));
const signups = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
  day,
  signups: [42, 58, 35, 71, 64, 30, 22][i]
}));
const plans = [{
  plan: "free" as const,
  users: 640
}, {
  plan: "pro" as const,
  users: 310
}, {
  plan: "team" as const,
  users: 120
}];
const revenueConfig = {
  revenue: {
    label: "Revenue" as const,
    color: "var(--chart-1)" as const
  },
  costs: {
    label: "Costs" as const,
    color: "var(--chart-2)" as const
  }
} satisfies ChartConfig;
const signupConfig = {
  signups: {
    label: "Signups" as const,
    color: "var(--chart-3)" as const
  }
} satisfies ChartConfig;
const planConfig = {
  free: {
    label: "Free" as const,
    color: "var(--chart-2)" as const
  },
  pro: {
    label: "Pro" as const,
    color: "var(--chart-1)" as const
  },
  team: {
    label: "Team" as const,
    color: "var(--chart-4)" as const
  }
} satisfies ChartConfig;
const stats = [{
  label: "Revenue" as const,
  value: "$3,800" as const,
  delta: "+12%" as const,
  data: [18, 26, 22, 31, 29, 38]
}, {
  label: "Active users" as const,
  value: "1,070" as const,
  delta: "+4%" as const,
  data: [900, 940, 930, 990, 1010, 1070]
}, {
  label: "Churn" as const,
  value: "2.1%" as const,
  delta: "-0.3" as const,
  data: [3.1, 2.8, 2.9, 2.5, 2.4, 2.1]
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const calm = shallowRef(initialState(false));
  const setCalm = stateSetter(calm);
  return () => {
    return <InkProvider density={calm.value ? "calm" as const : "comfortable" as const}>
      <div class="p-4">
        <div class="mb-4 flex justify-end">
          <Button size="sm" variant={calm.value ? "default" as const : "outline" as const} aria-pressed={calm.value} onClick={() => setCalm(c => !c)}>
            calm
          </Button>
        </div>
        <div class="grid w-full gap-4 lg:grid-cols-3">
          {stats.map((s, i) => <Card key={s.label} class="gap-2 py-4" seed={`stat${i}`}>
              <CardHeader class="gap-0.5">
                <CardDescription>{s.label}</CardDescription>
                <CardTitle class="text-3xl">{s.value}</CardTitle>
                <CardAction>
                  <Sparkline class="w-20" data={s.data} variant="area" label={`${s.label}, last six months`} slot={i} />
                </CardAction>
              </CardHeader>
              <CardFooter class="gap-1 text-sm text-muted-foreground">
                <Icon name={s.delta.startsWith("-") ? "arrow-down" as const : "arrow-up" as const} size={14} class={s.delta.startsWith("-") && s.label !== "Churn" ? "text-red" as const : "text-green" as const} />
                {s.delta} on last month
              </CardFooter>
            </Card>)}
          <Card class="lg:col-span-2" seed="rev">
            <CardHeader>
              <CardTitle>Revenue and costs</CardTitle>
              <CardDescription>Dollars per month</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueConfig} class="aspect-auto h-52 w-full">
                <AreaChart data={revenue} xKey="month" label="Revenue and costs per month" yFormatter={v => `$${v / 1000}k`} />
                <ChartTooltip />
                <ChartLegend />
              </ChartContainer>
            </CardContent>
          </Card>
          <Card seed="plans">
            <CardHeader>
              <CardTitle>Plans</CardTitle>
              <CardDescription>Users by plan</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={planConfig} class="aspect-auto h-52 w-full">
                <DonutChart data={plans} nameKey="plan" valueKey="users" label="Users by plan" showLabels={false} centerLabel={{
                  value: "1,070" as const,
                  label: "users" as const
                }} />
                <ChartTooltip />
              </ChartContainer>
            </CardContent>
          </Card>
          <Card class="lg:col-span-3" seed="signups">
            <CardHeader>
              <CardTitle>Signups this week</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={signupConfig} class="aspect-auto h-40 w-full">
                <BarChart data={signups} xKey="day" label="Signups per day" />
                <ChartTooltip />
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </InkProvider>;
  };
});
export default Example;
