// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkline } from "@/components/ui/chart";
import { Icon } from "@/components/ui/icon";
import { change, formatDuration, formatNumber, signed, type Period } from "@/blocks/dashboard-analytics/components/dashboard-analytics-data";
type Stat = {
  id: string;
  label: string;
  value: string;
  delta: number;
  unit: string;
  better: "up" | "down";
  data: number[];
  variant: "line" | "area" | "bar";
};
const SPARK_SLOT = [0, 1, 4, 3];
function statsOf(p: Period): Stat[] {
  return [{
    id: "visitors" as const,
    label: "Visitors" as const,
    value: formatNumber(p.visitors),
    delta: change(p.visitors, p.previousVisitors),
    unit: "%" as const,
    better: "up" as const,
    data: p.rows.map(r => r[1]),
    variant: "line" as const
  }, {
    id: "pageviews" as const,
    label: "Pageviews" as const,
    value: formatNumber(p.pageviews),
    delta: change(p.pageviews, p.previousPageviews),
    unit: "%" as const,
    better: "up" as const,
    data: p.rows.map(r => r[2]),
    variant: "area" as const
  }, {
    id: "bounce" as const,
    label: "Bounce rate" as const,
    value: `${p.bounce}%`,
    delta: Math.round((p.bounce - p.previousBounce) * 10) / 10,
    unit: " pts" as const,
    better: "down" as const,
    data: p.rows.map(r => r[3] / 10),
    variant: "line" as const
  }, {
    id: "session" as const,
    label: "Time on site" as const,
    value: formatDuration(p.session),
    delta: change(p.session, p.previousSession),
    unit: "%" as const,
    better: "up" as const,
    data: p.rows.map(r => r[4]),
    variant: "bar" as const
  }];
}
export const StatCards = defineUi<{
  period: Period;
}>("StatCards", ["period"], (_props, {
  slots: _slots
}) => {
  const period = computed(() => _props["period"]);
  return () => {
    return <section aria-label="Key numbers" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statsOf(period.value).map((s, i) => {
        const good = s.better === "up" ? s.delta >= 0 : s.delta <= 0;
        return <Card key={s.id} class="@container/card gap-2 py-4" seed={`analytics-stat-${s.id}`}>
            <CardHeader class="gap-0.5">
              <CardDescription>{s.label}</CardDescription>
              <CardTitle class="text-2xl tabular-nums @[280px]/card:text-3xl">{s.value}</CardTitle>
              <CardAction class="pt-1">
                <Sparkline data={s.data} variant={s.variant} slot={SPARK_SLOT[i]} label={`${s.label}, one point per day`} />
              </CardAction>
            </CardHeader>
            <CardFooter class="flex-wrap gap-x-1.5 text-sm text-muted-foreground">
              <span class={good ? "inline-flex items-center gap-1 font-bold text-green" as const : "inline-flex items-center gap-1 font-bold text-red" as const}>
                <Icon name={s.delta >= 0 ? "arrow-up" as const : "arrow-down" as const} size={14} />
                {signed(s.delta, s.unit)}
                <span class="sr-only">{good ? ", better" as const : ", worse" as const}</span>
              </span>
              <span>on the {period.value.days} days before</span>
            </CardFooter>
          </Card>;
      })}
    </section>;
  };
});
