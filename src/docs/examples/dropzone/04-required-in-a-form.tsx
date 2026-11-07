// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dropzone } from "@/components/ui/dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Required, in a form" as const,
  description: "The zone is a plain form field: name puts the files in FormData, required stops the submit until one is chosen (the browser points at the input), and invalid draws the red stitches. Submit empty, then with a file." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 600
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const result = shallowRef<string | null>(initialState(null));
  const setResult = stateSetter(result);
  const touched = shallowRef(initialState(false));
  const setTouched = stateSetter(touched);
  const count = shallowRef(initialState(0));
  const setCount = stateSetter(count);
  return () => {
    return <Card seed="claim" tape="corner" class="w-full max-w-lg">
      <form novalidate onSubmit={(e: SubmitEvent) => {
        e.preventDefault();
        setTouched(true);
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const receipts = data.getAll("receipts").filter((f): f is File => f instanceof File && f.size > 0);
        if (count.value === 0) return setResult(null);
        setResult(`${data.get("who") || "Someone"} sent ${count.value} receipt${count.value === 1 ? "" as const : "s" as const}${receipts.length ? "" as const : " (held by the zone)" as const}.`);
      }}>
        <CardHeader>
          <CardTitle>Expense claim</CardTitle>
          <CardDescription>Attach at least one receipt.</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="who">Your name</Label>
            <Input id="who" name="who" placeholder="Ada Lovelace" />
          </div>
          <div class="grid gap-2">
            <Label for="receipts">Receipts</Label>
            <Dropzone id="receipts" name="receipts" required accept="image/*,.pdf" maxFiles={5} invalid={touched.value && count.value === 0} onFilesChange={f => setCount(f.length)} />
            {touched.value && count.value === 0 && <p role="alert" class="font-hand text-sm text-red">
                Please attach a receipt.
              </p>}
          </div>
        </CardContent>
        <CardFooter class="justify-between gap-3 border-t">
          <p class="font-hand text-sm text-ink-muted" aria-live="polite">
            {result.value ?? "Not sent."}
          </p>
          <Button type="submit">Send claim</Button>
        </CardFooter>
      </form>
    </Card>;
  };
});
export default Example;
