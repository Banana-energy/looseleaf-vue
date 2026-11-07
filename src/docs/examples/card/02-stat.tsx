// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export const meta = {
  title: "Stat cards" as const,
  description: "Index cards for one number each. The figures are set in the script font with tabular numerals; the trend says up or down in words, not only in color." as const,
  layout: "stack" as const
};
const stats = [{
  label: "Pages written" as const,
  value: "1,284" as const,
  trend: "up 12% on last week" as const,
  stock: "index-card" as const,
  tone: "text-green" as const
}, {
  label: "Drafts open" as const,
  value: "17" as const,
  trend: "down 3 since Monday" as const,
  stock: "index-card" as const,
  tone: "text-red" as const
}, {
  label: "Words per day" as const,
  value: "640" as const,
  trend: "steady" as const,
  stock: "slip" as const,
  tone: "text-muted-foreground" as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-6 p-2 sm:grid-cols-3">
      {stats.map(s => <Card key={s.label} stock={s.stock} seed={s.label} class="gap-3 py-5">
          <CardHeader>
            <CardDescription>{s.label}</CardDescription>
            <CardTitle class="ll-num text-4xl">{s.value}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class={`text-sm ${s.tone}`}>{s.trend}</p>
          </CardContent>
        </Card>)}
    </div>;
  };
});
export default Example;
