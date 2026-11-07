// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
export const meta = {
  title: "Book a call" as const,
  description: "A calendar on a card with time slots beside it: the chosen day drives the slots, the chosen slot drives the button. Weekends are closed, so they are hatched." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 520
};
const SLOTS = ["09:00", "09:30", "10:30", "11:00", "13:30", "14:00", "15:30", "16:00"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const date = shallowRef<Date | undefined>(initialState(new Date(2026, 8, 17)));
  const setDate = stateSetter(date);
  const slot = shallowRef<string | undefined>(initialState("10:30"));
  const setSlot = stateSetter(slot);
  return () => {
    return <Card seed="book" tape="top" class="w-fit max-w-full">
      <CardHeader>
        <CardTitle>Book a call</CardTitle>
        <CardDescription>Thirty minutes, on the phone or in the studio.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4 md:flex-row">
        <Calendar mode="single" selected={date.value} onSelect={d => {
          setDate(d);
          setSlot(undefined);
        }} defaultMonth={new Date(2026, 8)} today={new Date(2026, 8, 15)} disabled={[{
          dayOfWeek: [0, 6]
        }, {
          before: new Date(2026, 8, 15)
        }]} class="p-0" seed="book" />
        <div role="group" aria-label="Available times" class="grid w-full grid-cols-2 content-start gap-2 md:w-36">
          {SLOTS.map(t => <Button key={t} size="sm" variant={slot.value === t ? "default" as const : "outline" as const} aria-pressed={slot.value === t} disabled={!date.value} onClick={() => setSlot(t)}>
              {t}
            </Button>)}
        </div>
      </CardContent>
      <CardFooter class="justify-between gap-3 border-t">
        <p class="font-hand text-sm text-ink-muted">{date.value && slot.value ? `${date.value.toDateString()} at ${slot.value}` : "Choose a day and a time." as const}</p>
        <Button disabled={!date.value || !slot.value}>Confirm</Button>
      </CardFooter>
    </Card>;
  };
});
export default Example;
