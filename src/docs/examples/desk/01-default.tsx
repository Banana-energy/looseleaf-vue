// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Desk } from "@/components/ui/desk";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "The bare desk" as const,
  description: "Sage bookcloth under a lamp. Paper lies on it with a short umber shadow and the light from the upper left." as const,
  layout: "full" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Desk class="grid min-h-72 place-items-center gap-6 p-10 sm:grid-cols-2" seed="bare">
      <Card seed="a" class="w-full max-w-xs">
        <CardHeader>
          <CardTitle>On the desk</CardTitle>
          <CardDescription>A card, casting a card-sized shadow.</CardDescription>
        </CardHeader>
        <CardContent class="text-sm">The blotter is a shade darker than the paper so cream glows against it.</CardContent>
      </Card>
      <Paper stock="sticky-yellow" seed="b" class="size-40 p-4">
        <p class="font-script text-2xl leading-none font-bold">call mum</p>
        <p class="mt-2 text-sm">before six</p>
      </Paper>
    </Desk>;
  };
});
export default Example;
