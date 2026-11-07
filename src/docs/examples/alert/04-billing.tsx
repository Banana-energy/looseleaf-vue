// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "In a billing card" as const,
  description: "A real use: the alert leads the card's content, carries an action button of its own (a separate host, with its own ring and hover) and goes away once it is dealt with. It is a live region, so screen readers hear it when it appears." as const,
  layout: "center" as const,
  height: 420
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const failed = shallowRef(initialState(true));
  const setFailed = stateSetter(failed);
  return () => {
    return <Card seed="billing" class="w-full max-w-md">
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>Your plan renews on the first of the month.</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        {failed.value ? <Alert variant="destructive">
            <Icon name="circle-alert" />
            <AlertTitle>Your last payment did not go through</AlertTitle>
            <AlertDescription>
              <p>The card ending 4242 was declined. We will try again in three days.</p>
              <Button size="sm" variant="outline" class="mt-2" onClick={() => setFailed(false)}>
                Update card
              </Button>
            </AlertDescription>
          </Alert> : <Alert variant="success">
            <Icon name="circle-check" />
            <AlertTitle>Card updated</AlertTitle>
            <AlertDescription>The next payment will use the new card.</AlertDescription>
          </Alert>}
        <p class="text-sm text-muted-foreground">Team plan, 5 seats, $250.00 a month.</p>
      </CardContent>
      <CardFooter class="justify-end">
        <Button variant="ghost" size="sm" onClick={() => setFailed(true)}>
          Reset the demo
        </Button>
      </CardFooter>
    </Card>;
  };
});
export default Example;
