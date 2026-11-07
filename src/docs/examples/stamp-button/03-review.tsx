// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StampButton, StampSurface, type StampImpression } from "@/components/ui/stamp-button";
export const meta = {
  title: "An approval" as const,
  description: "A real review step: the stamps are the state. Approving or rejecting leaves its impression on the expense report (a second decision replaces the first), the status badge follows it, and Reset clears the page." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const marks = shallowRef<StampImpression[]>(initialState([]));
  const setMarks = stateSetter(marks);
  const tools = shallowRef<HTMLDivElement | null>(null);
  const last = computed(() => marks.value[marks.value.length - 1]);
  const status = computed(() => !last.value ? "Waiting for review" as const : last.value.name === "stamp-approved" ? "Approved" as const : "Rejected" as const);
  return () => {
    return <StampSurface value={marks.value} onValueChange={setMarks} class="w-full max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Expense report 118</CardTitle>
          <CardDescription>Maya Chen, felt tips and washi tape for the March workshop.</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <span class="ll-num text-2xl font-bold">$ 148.00</span>
            <Badge variant={last.value ? "default" as const : "outline" as const} aria-live="polite">
              {status.value}
            </Badge>
          </div>
          <div ref={tools} class="mt-20 flex flex-wrap items-end gap-4">
            <StampButton stamp="stamp-approved" impressionId="decision" place={{
              x: 0.68,
              y: 0.44
            }}>
              Approve
            </StampButton>
            <StampButton stamp="stamp-void" text="Rejected" impressionId="decision" place={{
              x: 0.46,
              y: 0.5
            }}>
              Reject
            </StampButton>
            <Button variant="ghost" class="ms-auto" onClick={() => {
              setMarks([]);
              tools.value?.querySelector("button")?.focus();
            }} disabled={marks.value.length === 0}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </StampSurface>;
  };
});
export default Example;
