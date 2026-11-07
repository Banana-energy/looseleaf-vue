// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
export const meta = {
  title: "Team billing" as const,
  description: "A real screen: a card holding a table of people with faces, roles, a presence dot and what each seat costs, a highlighted row for the person you are looking at, a row button, and a footer with the total." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const seats = [{
  name: "Ada Lovelace" as const,
  email: "ada@looseleaf.dev" as const,
  role: "Owner" as const,
  status: "online" as const,
  price: 25
}, {
  name: "Jo Okafor" as const,
  email: "jo@looseleaf.dev" as const,
  role: "Admin" as const,
  status: "busy" as const,
  price: 25
}, {
  name: "Mika Kobayashi" as const,
  email: "mika@looseleaf.dev" as const,
  role: "Member" as const,
  status: "away" as const,
  price: 12
}, {
  name: "Sam Reyes" as const,
  email: "sam@looseleaf.dev" as const,
  role: "Member" as const,
  status: "offline" as const,
  price: 12
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const total = computed(() => seats.reduce((sum, s) => sum + s.price, 0));
  return () => {
    return <Card seed="team-billing" class="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Seats</CardTitle>
        <CardDescription>Everyone who can open the notebook, and what they cost this month.</CardDescription>
        <CardAction>
          <Button size="sm">
            <Icon name="plus" />
            Add a seat
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Person</TableHead>
              <TableHead>Role</TableHead>
              <TableHead class="text-end">Per month</TableHead>
              <TableHead class="w-10">
                <span class="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seats.map((s, i) => <TableRow key={s.email} data-state={i === 1 ? "selected" as const : undefined} class="h-14">
                <TableCell>
                  <div class="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback name={s.name} />
                      <AvatarBadge status={s.status}>
                        <span class="sr-only">{s.status}</span>
                      </AvatarBadge>
                    </Avatar>
                    <div class="grid leading-tight">
                      <span class="font-bold">{s.name}</span>
                      <span class="text-sm text-muted-foreground">{s.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{s.role}</TableCell>
                <TableCell class="ll-num text-end">${s.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-sm" aria-label={`More for ${s.name}`}>
                    <Icon name="ellipsis" />
                  </Button>
                </TableCell>
              </TableRow>)}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colspan={2}>Total</TableCell>
              <TableCell class="ll-num text-end">${total.value.toFixed(2)}</TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
      <CardFooter class="justify-between text-sm text-muted-foreground">
        <span>Billed on the first of the month.</span>
        <Button variant="link" size="sm">
          View invoices
        </Button>
      </CardFooter>
    </Card>;
  };
});
export default Example;
