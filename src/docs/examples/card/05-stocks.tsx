// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export const meta = {
  title: "On every stock" as const,
  description: "A card is a sheet of paper, so it takes any stock, edge and printed rules: graph paper, a dot grid, kraft, an index card with a torn top." as const,
  layout: "stack" as const
};
const cards = [{
  stock: "graph" as const,
  rules: "graph" as const,
  title: "Graph" as const,
  edge: "cut" as const
}, {
  stock: "dot-grid" as const,
  rules: "dots" as const,
  title: "Dot grid" as const,
  edge: "cut" as const
}, {
  stock: "kraft" as const,
  rules: "none" as const,
  title: "Kraft" as const,
  edge: "cut" as const
}, {
  stock: "index-card" as const,
  rules: "none" as const,
  title: "Torn index card" as const,
  edge: {
    top: "torn" as const
  }
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-7 p-2 sm:grid-cols-2">
      {cards.map(c => <Card key={c.title} stock={c.stock} rules={c.rules} edge={c.edge} seed={c.title} class="gap-2 py-5">
          <CardHeader>
            <CardTitle>{c.title}</CardTitle>
            <CardDescription>{c.stock}</CardDescription>
          </CardHeader>
          <CardContent class="text-sm">pencil, ink and a little tea</CardContent>
        </Card>)}
    </div>;
  };
});
export default Example;
