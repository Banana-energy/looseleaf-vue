// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Strike } from "@/components/ui/strike";
export const meta = {
  title: "A price that dropped" as const,
  description: "The old price stays in the text (and in the accessibility tree as <s>), so nothing is lost to a screen reader; the card says what changed." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="w-full max-w-xs" stock="index-card" tilt>
      <CardHeader>
        <CardTitle class="font-script text-2xl">Field notebook</CardTitle>
        <CardDescription>Dot grid, stitched spine</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-1">
        <p class="ll-num font-script text-4xl">
          <Strike weight="brush" class="text-muted-foreground">$24</Strike> <span class="text-red">$16</span>
        </p>
        <p class="text-sm text-muted-foreground">Was $24. Now $16 until Sunday.</p>
      </CardContent>
    </Card>;
  };
});
export default Example;
