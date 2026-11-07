// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Corkboard, CorkboardNote, type CorkboardValue } from "@/components/ui/corkboard";
export const meta = {
  title: "Saved layout" as const,
  description: "Controlled positions: the board is a JSON value, so a layout can be saved, shared and restored. Move things, then reset." as const,
  layout: "stack" as const,
  height: 470,
  stage: "desk" as const
};
const TASKS = [{
  id: "design" as const,
  text: "Design the header" as const,
  stock: "sticky-yellow" as const,
  x: 20,
  y: 24
}, {
  id: "review" as const,
  text: "Review the PR" as const,
  stock: "sticky-blue" as const,
  x: 210,
  y: 44
}, {
  id: "ship" as const,
  text: "Ship it (Friday)" as const,
  stock: "sticky-green" as const,
  x: 60,
  y: 190
}, {
  id: "bugs" as const,
  text: "Squash the 3 bugs" as const,
  stock: "sticky-pink" as const,
  x: 250,
  y: 200
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const layout = shallowRef<CorkboardValue>(initialState({}));
  const setLayout = stateSetter(layout);
  return () => {
    return <div class="flex w-full max-w-2xl flex-col gap-3">
      <Corkboard class="h-[340px]" value={layout.value} onValueChange={setLayout} label="Sprint board">
        {TASKS.map(t => <CorkboardNote key={t.id} id={t.id} x={t.x} y={t.y} stock={t.stock}>
            {t.text}
          </CorkboardNote>)}
      </Corkboard>
      <div class="flex items-center gap-3">
        <Button size="sm" variant="outline" onClick={() => setLayout({})}>
          Reset layout
        </Button>
        <code class="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">{JSON.stringify(layout.value)}</code>
      </div>
    </div>;
  };
});
export default Example;
