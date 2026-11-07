// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Seal } from "@/components/ui/seal";
export const meta = {
  title: "Verified, awarded, sealed" as const,
  description: "In ordinary UI: a verified mark beside a name at 20 px, a best-seller seal pinned to a card corner, and a certificate with a rosette, a ringed seal and a wax seal." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-3xl gap-6 md:grid-cols-2">
      <div class="flex flex-col gap-6">
        <Card class="gap-3 p-4">
          <div class="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <div>
              <p class="flex items-center gap-1.5 text-lg font-bold">
                Maya Chen
                <Seal mark="check" tone="sky" size={20} label="Verified" shadow={false} />
              </p>
              <p class="text-muted-foreground">Illustrator, Lisbon</p>
            </div>
          </div>
        </Card>
        <Card class="relative">
          <Seal variant="rosette" text="Best" tone="lemon" ribbon="tomato" size={72} tilt={8} class="absolute -top-5 -right-3" />
          <CardHeader>
            <CardTitle>Twelve felt tips</CardTitle>
            <CardDescription>Assorted, water based, no bleed.</CardDescription>
          </CardHeader>
          <CardContent class="ll-num">$ 14.00</CardContent>
        </Card>
      </div>
      <Card class="relative items-center gap-2 p-6 text-center">
        <p class="font-type text-xs text-pencil-text">Certificate of</p>
        <h3 class="font-script text-4xl">Good Handwriting</h3>
        <p class="max-w-[16rem] text-muted-foreground">Awarded to Maya Chen for lettering that stays on the line, mostly.</p>
        <div class="mt-3 flex items-end gap-4">
          <Seal variant="ring" text="Signed" tone="sky" ring="Official seal" size={112} label="Official seal" />
          <Seal variant="wax" text="M" tone="red" size={84} tilt={-6} label="Wax seal" />
        </div>
      </Card>
    </div>;
  };
});
export default Example;
