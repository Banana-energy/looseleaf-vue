// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Stepper } from "@/components/ui/stepper";
export const meta = {
  title: "In a form" as const,
  description: "name puts the number in FormData; required refuses an empty field (a blank is put back); Reset returns an uncontrolled stepper to its default. The third one is invalid, the fourth disabled." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 560
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const sent = shallowRef<string | null>(initialState(null));
  const setSent = stateSetter(sent);
  return () => {
    return <Card seed="party" tape="corner" class="w-full max-w-sm">
      <form onSubmit={(e: SubmitEvent) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget as HTMLFormElement);
        setSent(`${d.get("adults")} adults, ${d.get("kids")} kids`);
      }} onReset={() => setSent(null)}>
        <CardHeader>
          <CardTitle>Party of ...</CardTitle>
          <CardDescription>How many are coming?</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4 py-4">
          <div class="flex items-center justify-between gap-3">
            <Label for="adults">Adults</Label>
            <Stepper id="adults" name="adults" defaultValue={2} min={1} max={12} required />
          </div>
          <div class="flex items-center justify-between gap-3">
            <Label for="kids">Kids</Label>
            <Stepper id="kids" name="kids" defaultValue={0} min={0} max={12} />
          </div>
          <div class="flex items-center justify-between gap-3">
            <Label for="highchairs">High chairs (we have two)</Label>
            <Stepper id="highchairs" defaultValue={3} min={0} max={5} invalid aria-describedby="hc-msg" />
          </div>
          <p id="hc-msg" role="alert" class="-mt-2 text-end font-hand text-sm text-red">
            We only have two.
          </p>
          <div class="flex items-center justify-between gap-3">
            <Label for="closed">Rooftop seats</Label>
            <Stepper id="closed" defaultValue={0} disabled />
          </div>
        </CardContent>
        <CardFooter class="justify-between gap-3 border-t">
          <p class="font-hand text-sm text-ink-muted" aria-live="polite">
            {sent.value ?? "Nothing sent yet."}
          </p>
          <div class="flex gap-2">
            <Button type="reset" variant="ghost">
              Reset
            </Button>
            <Button type="submit">Book</Button>
          </div>
        </CardFooter>
      </form>
    </Card>;
  };
});
export default Example;
