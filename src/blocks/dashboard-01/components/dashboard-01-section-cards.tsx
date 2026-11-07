// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
const cards = [{
  label: "Total revenue" as const,
  value: "$48,230" as const,
  delta: "+12.5%" as const,
  up: true,
  line: "A busy month, thank goodness" as const,
  note: "Sales for the last six months" as const
}, {
  label: "New customers" as const,
  value: "1,234" as const,
  delta: "-20%" as const,
  up: false,
  line: "A quiet stretch for sign-ups" as const,
  note: "Worth a nudge in the newsletter" as const
}, {
  label: "Active accounts" as const,
  value: "45,678" as const,
  delta: "+12.5%" as const,
  up: true,
  line: "People keep coming back" as const,
  note: "Ahead of what we pencilled in" as const
}, {
  label: "Growth rate" as const,
  value: "4.5%" as const,
  delta: "+4.5%" as const,
  up: true,
  line: "Slow and steady" as const,
  note: "Right on the plan" as const
}];
export const SectionCards = defineUi<{}>("SectionCards", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <section aria-label="Key numbers" class="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((c, i) => <Card key={c.label} class="@container/card" seed={`s01-card-${i}`}>
          <CardHeader>
            <CardDescription>{c.label}</CardDescription>
            <CardTitle class="text-3xl tabular-nums @[250px]/card:text-4xl">{c.value}</CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Icon name={c.up ? "trending-up" as const : "trending-down" as const} />
                {c.delta}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter class="flex-col items-start gap-1 text-sm">
            <div class="flex gap-2 font-bold">
              {c.line} <Icon name={c.up ? "trending-up" as const : "trending-down" as const} class="size-4" />
            </div>
            <div class="text-muted-foreground">{c.note}</div>
          </CardFooter>
        </Card>)}
    </section>;
  };
});
