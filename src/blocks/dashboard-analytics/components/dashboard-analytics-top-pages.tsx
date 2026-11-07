// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDuration, formatNumber, signed, TOP_PAGES, type Period } from "@/blocks/dashboard-analytics/components/dashboard-analytics-data";
export const TopPages = defineUi<{
  period: Period;
  className?: string;
}>("TopPages", ["period", "class"], (_props, {
  slots: _slots
}) => {
  const period = computed(() => _props["period"]);
  const className = computed(() => _props["class"]);
  return () => {
    return <Card class={cn("min-w-0", className.value)} seed="analytics-pages">
      <CardHeader>
        <CardTitle role="heading" aria-level={2}>
          Top pages
        </CardTitle>
        <CardDescription>What people read the most, and whether they liked it enough to stay</CardDescription>
      </CardHeader>
      <CardContent>
        <Table class="[&_td]:px-2 [&_th]:px-2 sm:[&_td]:px-3 sm:[&_th]:px-3">
          <TableCaption class="sr-only">Top pages by views, with the change since the period before</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead class="text-end">Views</TableHead>
              <TableHead class="hidden text-end md:table-cell">Visitors</TableHead>
              <TableHead class="hidden text-end md:table-cell">Time</TableHead>
              <TableHead class="hidden text-end sm:table-cell">Bounce</TableHead>
              <TableHead class="text-end">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TOP_PAGES.map(p => {
              const views = Math.round(period.value.pageviews * p.share);
              const up = p.trend >= 0;
              return <TableRow key={p.path}>
                  <TableCell class="max-w-32 whitespace-normal sm:max-w-56">
                    <span class="block font-bold">{p.title}</span>
                    <span class="block truncate font-mono text-xs text-muted-foreground">{p.path}</span>
                  </TableCell>
                  <TableCell class="ll-num text-end">{formatNumber(views)}</TableCell>
                  <TableCell class="ll-num hidden text-end md:table-cell">{formatNumber(views / 1.34)}</TableCell>
                  <TableCell class="ll-num hidden text-end md:table-cell">{formatDuration(p.time)}</TableCell>
                  <TableCell class="ll-num hidden text-end sm:table-cell">{p.bounce}%</TableCell>
                  <TableCell class="text-end">
                    <span class={up ? "inline-flex items-center gap-1 font-bold text-green" as const : "inline-flex items-center gap-1 font-bold text-red" as const}>
                      <Icon name={up ? "arrow-up" as const : "arrow-down" as const} size={14} />
                      <span class="ll-num">{signed(p.trend)}</span>
                      <span class="sr-only">{up ? ", up" as const : ", down" as const}</span>
                    </span>
                  </TableCell>
                </TableRow>;
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>;
  };
});
