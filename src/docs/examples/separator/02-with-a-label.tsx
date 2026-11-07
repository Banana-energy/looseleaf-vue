// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
export const meta = {
  title: "Or continue with" as const,
  description: "Children turn the separator into a labeled divider: two rules and a word. Here it splits a sign-in card in two, the way every sign-in card does." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="mx-auto w-full max-w-sm" seed="signin">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Pick up where you left off.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <Input type="email" placeholder="you@example.com" aria-label="Email" />
        <Button>Send me a link</Button>
        <Separator variant="dashed">or continue with</Separator>
        <div class="grid grid-cols-2 gap-3">
          <Button variant="outline">Notebook</Button>
          <Button variant="outline">Sketchpad</Button>
        </div>
      </CardContent>
      <CardFooter class="justify-center text-sm text-muted-foreground">No password. The link lasts an hour.</CardFooter>
    </Card>;
  };
});
export default Example;
