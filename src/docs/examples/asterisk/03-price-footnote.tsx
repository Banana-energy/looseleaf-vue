// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Asterisk } from "@/components/ui/asterisk";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export const meta = {
  title: "A price with a footnote" as const,
  description: "The mark is a link (with a name) to the footnote at the foot of the card, sized to the 36 px price it follows." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="w-full max-w-xs" stock="index-card" tilt>
      <CardHeader>
        <CardTitle class="font-script text-2xl">Studio plan</CardTitle>
        <CardDescription>Everything, for one desk</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-2">
        <p class="ll-num font-script text-5xl">
          $16
          <Asterisk label="Footnote 1" href="#price-note" class="text-5xl" />
          <span class="ms-2 font-hand text-base text-muted-foreground">per month</span>
        </p>
        <p id="price-note" class="text-sm text-muted-foreground">
          * Introductory price for the first twelve months.
        </p>
      </CardContent>
    </Card>;
  };
});
export default Example;
