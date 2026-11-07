// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export const meta = {
  title: "Controlled, manual activation" as const,
  description: "`value` and `onValueChange` drive the tabs from outside; `activationMode=\"manual\"` moves focus with the arrow keys and only opens a tab on Enter or Space, which suits panels that are slow to load." as const,
  layout: "center" as const
};
const days = ["Mon", "Tue", "Wed", "Thu"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const day = shallowRef<string>(initialState("Tue"));
  const setDay = stateSetter(day);
  const at = computed(() => days.indexOf(day.value as typeof days[number]));
  return () => {
    return <div class="grid w-full max-w-sm gap-4">
      <Tabs value={day.value} onValueChange={setDay} activationMode="manual">
        <TabsList>
          {days.map(d => <TabsTrigger key={d} value={d}>
              {d}
            </TabsTrigger>)}
        </TabsList>
        {days.map(d => <TabsContent key={d} value={d} class="text-sm text-muted-foreground">
            Nothing planned on {d}. A good day for a very small plan.
          </TabsContent>)}
      </Tabs>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" disabled={at.value === 0} onClick={() => setDay(days[at.value - 1])}>
          Earlier
        </Button>
        <Button variant="outline" size="sm" disabled={at.value === days.length - 1} onClick={() => setDay(days[at.value + 1])}>
          Later
        </Button>
      </div>
    </div>;
  };
});
export default Example;
