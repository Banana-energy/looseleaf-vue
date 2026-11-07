// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export const meta = {
  title: "Reserve a table" as const,
  description: "In a real form: the date is a named field (the hidden input submits 2026-09-17), Mondays are closed, and the summary reads the submitted FormData." as const,
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
    return <Card seed="reserve" tape="corner" class="w-full max-w-sm">
      <form onSubmit={(e: SubmitEvent) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget as HTMLFormElement);
        setSent(`${data.get("date") || "no date"} at ${data.get("time") || "no time"}`);
      }}>
        <CardHeader>
          <CardTitle>Reserve a table</CardTitle>
          <CardDescription>We are closed on Mondays.</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="res-date">Day</Label>
            <DatePicker id="res-date" name="date" required min={new Date(2026, 8, 15)} disabledDates={{
              dayOfWeek: [1]
            }} calendarProps={{
              today: new Date(2026, 8, 15),
              defaultMonth: new Date(2026, 8)
            }} />
          </div>
          <div class="grid gap-2">
            <Label for="res-time">Time</Label>
            <Select name="time" defaultValue="19:00">
              <SelectTrigger id="res-time" class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {["18:00", "19:00", "20:00", "21:00"].map(t => <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter class="justify-between gap-3 border-t">
          <p class="font-hand text-sm text-ink-muted" aria-live="polite">
            {sent.value ? `Sent: ${sent.value}` : "Nothing sent yet." as const}
          </p>
          <Button type="submit">Reserve</Button>
        </CardFooter>
      </form>
    </Card>;
  };
});
export default Example;
