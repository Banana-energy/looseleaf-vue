// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
export const meta = {
  title: "Settings card" as const,
  description: "The whole family: a title and description, an action tucked into the header, content, and a footer with a pencil rule above it." as const,
  layout: "stack" as const
};
const ROWS = [{
  id: "comments" as const,
  label: "Comments on your notes" as const,
  on: true
}, {
  id: "replies" as const,
  label: "Replies to your questions" as const,
  on: true
}, {
  id: "weekly" as const,
  label: "The weekly summary, Fridays" as const,
  on: false
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card seed="settings" class="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what lands in your inbox.</CardDescription>
        <CardAction>
          <Button variant="link" size="sm">
            Reset
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent class="grid gap-3">
        {ROWS.map(row => <div key={row.id} class="flex items-center justify-between gap-4">
            <Label for={`card-${row.id}`}>{row.label}</Label>
            <Switch id={`card-${row.id}`} defaultChecked={row.on} />
          </div>)}
      </CardContent>
      <CardFooter class="justify-end gap-2 border-t">
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>;
  };
});
export default Example;
