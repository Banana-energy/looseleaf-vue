// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SignaturePad } from "@/components/ui/signature-pad";
export const meta = {
  title: "Agreement form" as const,
  description: "A real form: the signature is a required field that posts as a data URL. Submit it empty to see the red baseline; sign and it goes through." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const sent = shallowRef<string | null>(initialState(null));
  const setSent = stateSetter(sent);
  return () => {
    return <Card class="w-full max-w-lg" tilt={false}>
      <form onSubmit={(e: SubmitEvent) => {
        e.preventDefault();
        const sig = String(new FormData(e.currentTarget as HTMLFormElement).get("signature"));
        setSent(`${sig.length.toLocaleString()} characters of image`);
      }}>
        <CardHeader>
          <CardTitle>Studio rental agreement</CardTitle>
          <CardDescription>Three hours, one kettle, no glitter.</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4 pt-4">
          <div class="flex items-center gap-2">
            <Checkbox id="glitter" required />
            <Label for="glitter">I promise, no glitter</Label>
          </div>
          <SignaturePad name="signature" required penColor="ink-you" />
        </CardContent>
        <CardFooter class="justify-between gap-3 pt-4">
          <span class="text-sm text-muted-foreground">{sent.value ?? "Not sent yet"}</span>
          <Button type="submit">Sign and send</Button>
        </CardFooter>
      </form>
    </Card>;
  };
});
export default Example;
