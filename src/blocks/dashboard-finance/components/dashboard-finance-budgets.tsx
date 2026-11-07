// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { StickyNote, StickyNoteContent, StickyNoteTitle } from "@/components/ui/sticky-note";
import { cn } from "@/lib/utils";
import { BUDGETS, CATEGORY_ICON, money } from "@/blocks/dashboard-finance/components/dashboard-finance-data";
type Tone = "green" | "hi" | "marker";
function toneOf(spent: number, budget: number): Tone {
  if (spent > budget) return "marker";
  return spent / budget >= 0.85 ? "hi" as const : "green" as const;
}
export const Budgets = defineUi<{
  spent: Record<string, number>;
  monthName: string;
  className?: string;
}>("Budgets", ["spent", "monthName", "class"], (_props, {
  slots: _slots
}) => {
  const spent = computed(() => _props["spent"]);
  const monthName = computed(() => _props["monthName"]);
  const className = computed(() => _props["class"]);
  return () => {
    return <Card class={cn("min-w-0", className.value)} seed="finance-budgets">
      <CardHeader>
        <CardTitle role="heading" aria-level={2}>
          Budgets
        </CardTitle>
        <CardDescription>What each pot has left in {monthName.value}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul role="list" class="flex flex-col gap-5">
          {BUDGETS.map((b, i) => {
            const used = spent.value[b.category] ?? 0;
            const left = b.cents - used;
            const over = left < 0;
            return <li key={b.category} class="flex flex-col gap-1.5">
                <div class="flex items-baseline justify-between gap-3">
                  <span class="flex items-center gap-2 font-bold">
                    <Icon name={CATEGORY_ICON[b.category]} />
                    {b.category}
                  </span>
                  <span class="ll-num text-sm text-muted-foreground">
                    {money(used)} of {money(b.cents)}
                  </span>
                </div>
                <Progress value={Math.min(100, used / b.cents * 100)} tone={toneOf(used, b.cents)} seed={`finance-budget-${i}`} aria-label={`${b.category}: ${money(used)} spent of ${money(b.cents)}`} />
                {over ? <p class="flex items-center gap-1.5 text-sm font-bold text-red">
                    <Icon name="triangle-alert" size={14} />
                    Over by {money(-left)}
                  </p> : <p class="text-sm text-muted-foreground">{left === 0 ? "All of it spent, exactly" as const : `${money(left)} left`}</p>}
              </li>;
          })}
        </ul>
      </CardContent>
    </Card>;
  };
});
export const HeadsUp = defineUi<{
  spent: Record<string, number>;
  className?: string;
}>("HeadsUp", ["spent", "class"], (_props, {
  slots: _slots
}) => {
  const spent = computed(() => _props["spent"]);
  const className = computed(() => _props["class"]);
  const lines = computed(() => BUDGETS.flatMap(b => {
    const used = spent.value[b.category] ?? 0;
    if (used > b.cents) return [`${b.category} is ${money(used - b.cents)} over.`];
    if (used === b.cents) return [`${b.category} is all spent.`];
    if (used / b.cents >= 0.85) return [`${b.category}: ${money(b.cents - used)} to go.`];
    return [];
  }));
  return () => {
    return <StickyNote role="group" aria-label="Heads up" fastener="pin" seed="finance-headsup" class={cn("min-h-0 w-64 max-w-full self-center", className.value)}>
      <StickyNoteTitle>Heads up</StickyNoteTitle>
      <StickyNoteContent>
        {lines.value.length ? <ul role="list" class="text-[1.15rem] leading-tight">
            {lines.value.map(l => <li key={l}>{l}</li>)}
          </ul> : <p class="text-[1.15rem] leading-tight">Every pot has room this month.</p>}
      </StickyNoteContent>
    </StickyNote>;
  };
});
