// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Paper } from "@/components/ui/paper";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
export const meta = {
  title: "A view switcher" as const,
  description: "The group in a card header, driving what the card shows. Every item has a name; the current view is also written out in the description." as const,
  layout: "stack" as const
};
const sketches = ["Snail on a leaf", "Teapot, three ways", "The corner of the desk", "Rain at 7 a.m."];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const view = shallowRef(initialState("list"));
  const setView = stateSetter(view);
  return () => {
    return <Card class="mx-auto w-full max-w-md" seed="views">
      <CardHeader>
        <CardTitle>Sketchbook</CardTitle>
        <CardDescription>Showing {view.value === "grid" ? "a grid" as const : view.value === "menu" ? "compact rows" as const : "a list" as const} of four pages.</CardDescription>
        <CardAction>
          <ToggleGroup type="single" variant="outline" size="sm" value={view.value} onValueChange={v => v && setView(v)} aria-label="View">
            <ToggleGroupItem value="list" aria-label="List">
              <Icon name="list" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid">
              <Icon name="layout-grid" />
            </ToggleGroupItem>
            <ToggleGroupItem value="menu" aria-label="Compact">
              <Icon name="menu" />
            </ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul class={view.value === "grid" ? "grid grid-cols-2 gap-3" as const : view.value === "menu" ? "flex flex-col gap-1 text-[15px]" as const : "flex flex-col gap-3" as const}>
          {sketches.map((s, i) => <li key={s} class={view.value === "grid" ? "" as const : "flex items-baseline gap-3" as const}>
              {view.value === "grid" ? <Paper stock="slip" seed={s} class="flex h-16 items-end p-2 text-sm leading-tight">
                  {s}
                </Paper> : <>
                  <span class="ll-num w-5 text-muted-foreground">{i + 1}</span>
                  {s}
                </>}
            </li>)}
        </ul>
      </CardContent>
    </Card>;
  };
});
export default Example;
