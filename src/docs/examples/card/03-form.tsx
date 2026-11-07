// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
export const meta = {
  title: "Guest book" as const,
  description: "A form on a guest check: green ledger paper, a perforated top, a dashed footer. The fields are ordinary labeled inputs; the sheet only changes the paper they are written on." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card stock="check" seed="guest" class="mx-auto w-full max-w-sm">
      <CardHeader class="border-b" rule="dashed">
        <CardTitle>Sign the guest book</CardTitle>
        <CardDescription>Name, and one line for the wall.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <label class="grid gap-1 text-sm font-bold">
          Name
          <input class="h-9 border-b border-pencil-mark bg-transparent px-1 font-normal text-ink-you outline-none focus-visible:border-focus" placeholder="Ada" />
        </label>
        <label class="grid gap-1 text-sm font-bold">
          A line for the wall
          <input class="h-9 border-b border-pencil-mark bg-transparent px-1 font-normal text-ink-you outline-none focus-visible:border-focus" placeholder="Lovely evening." />
        </label>
      </CardContent>
      <CardFooter class="justify-between border-t" rule="dashed">
        <span class="text-sm text-muted-foreground">No. 0042</span>
        <Button size="sm">Sign</Button>
      </CardFooter>
    </Card>;
  };
});
export default Example;
