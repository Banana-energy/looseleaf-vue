// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper, StepperDecrement, StepperIncrement, StepperInput, StepperTally } from "@/components/ui/stepper";
export const meta = {
  title: "Cart lines with tally marks" as const,
  description: "The stepper in a cart: each line counts its quantity in tally marks next to the number, the total follows, and a line at zero says so. The tally is decoration; the number is the truth." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 520
};
const LINES = [{
  id: "pencils" as const,
  name: "Beeswax pencils" as const,
  price: 4.5,
  qty: 7
}, {
  id: "tape" as const,
  name: "Washi tape" as const,
  price: 3,
  qty: 2
}, {
  id: "paper" as const,
  name: "Graph paper pad" as const,
  price: 6.25,
  qty: 1
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const qty = shallowRef<Record<string, number | undefined>>(initialState(Object.fromEntries(LINES.map(l => [l.id, l.qty]))));
  const setQty = stateSetter(qty);
  const total = computed(() => LINES.reduce((sum, l) => sum + (qty.value[l.id] ?? 0) * l.price, 0));
  return () => {
    return <Card seed="cart" tape="top" class="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Your basket</CardTitle>
        <CardDescription>Hold the plus to run up a big order.</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4 py-4">
        {LINES.map(l => <div key={l.id} class="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1">
            <div>
              <p class="font-hand text-base font-bold">{l.name}</p>
              <p class="font-hand text-sm text-ink-muted">${l.price.toFixed(2)} each{(qty.value[l.id] ?? 0) === 0 ? " (none)" as const : "" as const}</p>
            </div>
            <div class="flex items-center gap-3">
              <StepperTally value={qty.value[l.id]} class="hidden sm:inline-block" />
              <Stepper aria-label={`${l.name} quantity`} value={qty.value[l.id]} onValueChange={v => setQty(q => ({
              ...q,
              [l.id]: v
            }))} min={0} max={99}>
                <StepperDecrement aria-label={`Fewer ${l.name}`} />
                <StepperInput />
                <StepperIncrement aria-label={`More ${l.name}`} />
              </Stepper>
            </div>
          </div>)}
      </CardContent>
      <CardFooter class="justify-between gap-3 border-t">
        <p class="font-script text-2xl font-bold" aria-live="polite">
          Total ${total.value.toFixed(2)}
        </p>
        <Button disabled={total.value === 0}>Check out</Button>
      </CardFooter>
    </Card>;
  };
});
export default Example;
