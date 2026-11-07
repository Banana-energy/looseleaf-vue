// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ribbon } from "@/components/ui/ribbon";
export const meta = {
  title: "On cards and as links" as const,
  description: "A flag pinned to a card edge, a banner as a section heading, and a ribbon that is a link: `asChild` puts the drawing on your element, which lifts on hover and takes the drawn focus ring." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-3xl gap-8 md:grid-cols-2">
      <Card class="relative mt-3 overflow-visible">
        <Ribbon variant="flag" tone="tangerine" size="sm" class="absolute -top-3 -left-3 z-(--ll-z-prop)">
          New
        </Ribbon>
        <CardHeader>
          <CardTitle>Twelve felt tips</CardTitle>
          <CardDescription>Assorted, water based, no bleed.</CardDescription>
        </CardHeader>
        <CardContent class="flex items-center justify-between">
          <span class="ll-num text-xl font-bold">$ 14.00</span>
          <Ribbon asChild variant="swallow" tone="lemon" size="sm">
            <a href="#felt-tips">See details</a>
          </Ribbon>
        </CardContent>
      </Card>
      <div class="flex flex-col items-start gap-3">
        <Ribbon size="lg" tone="teal">
          Spring stationery
        </Ribbon>
        <p class="max-w-xs text-foreground">Notebooks, washi tape and the good pencils, in the shop until the end of April.</p>
        <Ribbon asChild tone="sky">
          <button type="button">Shop the collection</button>
        </Ribbon>
      </div>
    </div>;
  };
});
export default Example;
