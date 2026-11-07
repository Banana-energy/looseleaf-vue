// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Squiggle } from "@/components/ui/squiggle";
export const meta = {
  title: "Between sections of a card" as const,
  description: "A real separator (decorative={false}) that draws itself on when the card scrolls into view." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="w-full max-w-sm" tilt>
      <CardHeader>
        <CardTitle class="font-script text-2xl">Weekend</CardTitle>
        <CardDescription>Two plans and a maybe</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-3 text-[17px]">
        <p>Saturday: the market, then the long way home.</p>
        <Squiggle kind="scallops" tone="blue" decorative={false} animate />
        <p>Sunday: nothing, carefully.</p>
      </CardContent>
    </Card>;
  };
});
export default Example;
