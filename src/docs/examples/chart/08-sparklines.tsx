// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkline } from "@/components/ui/chart";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Sparklines" as const,
  description: "One felt pull and a red dot at the end, a shaded area, or a row of marker bars. A sparkline is a picture with a spoken summary; set interactive to make it a chart you can hover." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const tiles = [{
  title: "Visitors" as const,
  value: "12,840" as const,
  note: "up 12% on last week" as const,
  up: true,
  data: [4, 6, 5, 8, 7, 11, 9, 12, 10, 15, 13, 17],
  variant: "line" as const
}, {
  title: "Revenue" as const,
  value: "$4,320" as const,
  note: "steady" as const,
  up: true,
  data: [8, 7, 9, 8, 10, 9, 11, 10, 12, 11, 12, 13],
  variant: "area" as const
}, {
  title: "Signups" as const,
  value: "318" as const,
  note: "down 3 since Monday" as const,
  up: false,
  data: [9, 12, 8, 10, 7, 9, 6, 8, 5, 7, 6, 4],
  variant: "bar" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-auto grid w-full max-w-3xl gap-4 sm:grid-cols-3">
      {tiles.map((t, i) => <Card key={t.title} seed={`spark${i}`} class="gap-3 py-4">
          <CardHeader class="gap-1">
            <CardDescription>{t.title}</CardDescription>
            <CardTitle class="text-3xl">{t.value}</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-3">
            <Sparkline class="h-10 w-full" data={t.data} variant={t.variant} label={`${t.title}, last twelve days`} slot={i === 2 ? 1 : 0} />
            <div class="flex items-center gap-1 text-sm text-muted-foreground">
              <Icon name={t.up ? "arrow-up" as const : "arrow-down" as const} size={14} class={t.up ? "text-green" as const : "text-red" as const} />
              {t.note}
            </div>
          </CardContent>
        </Card>)}
    </div>;
  };
});
export default Example;
