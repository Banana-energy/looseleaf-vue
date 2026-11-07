// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Account settings" as const,
  description: "A controlled accordion in a card: the open row lives in state, a button opens the next one, and the fields inside keep their rings and hover lines." as const,
  layout: "center" as const,
  height: 520
};
const steps = ["profile", "notifications", "security"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const open = shallowRef<string>(initialState("profile"));
  const setOpen = stateSetter(open);
  const next = computed(() => steps[Math.min(steps.indexOf(open.value as typeof steps[number]) + 1, steps.length - 1)]);
  return () => {
    return <Card seed="acc-settings" class="w-full max-w-md">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Three short pages. Open them in any order.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible value={open.value} onValueChange={setOpen}>
          <AccordionItem value="profile">
            <AccordionTrigger>Profile</AccordionTrigger>
            <AccordionContent class="grid gap-3">
              <div class="grid gap-2">
                <Label for="acc-name">Name</Label>
                <Input id="acc-name" defaultValue="Ada Lovelace" />
              </div>
              <div class="grid gap-2">
                <Label for="acc-bio">One line about you</Label>
                <Input id="acc-bio" placeholder="Mathematician, mostly" />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="notifications">
            <AccordionTrigger>Notifications</AccordionTrigger>
            <AccordionContent>We send a summary on Fridays and nothing else. Change that here whenever you like.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="security">
            <AccordionTrigger>Security</AccordionTrigger>
            <AccordionContent>Passkeys are on. Two devices are signed in.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter class="justify-between">
        <span class="text-sm text-muted-foreground">Open: {open.value || "none"}</span>
        <Button size="sm" onClick={() => setOpen(next.value)}>
          Next page
        </Button>
      </CardFooter>
    </Card>;
  };
});
export default Example;
