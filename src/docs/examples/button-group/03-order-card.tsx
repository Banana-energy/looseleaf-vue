// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "A sourdough order" as const,
  description: "The group doing a job: a quantity stepper whose number is a printed cell, a size chooser that is a row of buttons, and a primary action to finish. The status line says what the stepper did." as const,
  layout: "stack" as const
};
const sizes = ["Small", "Loaf", "Big"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const qty = shallowRef(initialState(2));
  const setQty = stateSetter(qty);
  const size = shallowRef<typeof sizes[number]>(initialState("Loaf"));
  const setSize = stateSetter(size);
  return () => {
    return <Card class="mx-auto w-full max-w-sm" seed="order">
      <CardHeader>
        <CardTitle>Sourdough</CardTitle>
        <CardDescription>Baked this morning, gone by noon.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <ButtonGroup aria-label="Size">
          {sizes.map(s => <Button key={s} variant={s === size.value ? "secondary" as const : "outline" as const} aria-pressed={s === size.value} onClick={() => setSize(s)}>
              {s}
            </Button>)}
        </ButtonGroup>
        <div class="flex items-center gap-3">
          <ButtonGroup aria-label="Quantity">
            <Button variant="outline" size="icon" aria-label="One fewer" disabled={qty.value <= 1} onClick={() => setQty(qty.value - 1)}>
              <Icon name="minus" />
            </Button>
            <ButtonGroupText class="ll-num min-w-12 justify-center" aria-live="polite">
              {qty.value}
            </ButtonGroupText>
            <Button variant="outline" size="icon" aria-label="One more" disabled={qty.value >= 6} onClick={() => setQty(qty.value + 1)}>
              <Icon name="plus" />
            </Button>
          </ButtonGroup>
          <span class="text-sm text-muted-foreground">
            {qty.value} × {size.value.toLowerCase()}
          </span>
        </div>
      </CardContent>
      <CardFooter class="border-t">
        <Button class="w-full">Add {qty.value} to the basket</Button>
      </CardFooter>
    </Card>;
  };
});
export default Example;
