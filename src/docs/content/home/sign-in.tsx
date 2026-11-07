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
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const SignIn = defineUi<{}>("SignIn", [], (_props, {
  slots: _slots
}) => {
  const done = shallowRef(initialState(false));
  const setDone = stateSetter(done);
  const timer = shallowRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  watchDependencies(() => () => clearTimeout(timer.value), () => [], false);
  return () => {
    function submit(event: SubmitEvent) {
      event.preventDefault();
      setDone(true);
      clearTimeout(timer.value);
      timer.value = setTimeout(() => setDone(false), 2400);
    }
    return <Card data-home="sign-in" stock="paper" tape="both" tapeKind="masking" seed="home-sign-in" class="relative w-full max-w-md gap-5 py-7 @4xl:justify-self-end">
      <CardHeader>
        <CardTitle class="text-4xl">Welcome back</CardTitle>
        <CardDescription>sign in to pick up where you left off.</CardDescription>
      </CardHeader>
      <form onSubmit={submit} class="flex flex-col gap-5" aria-label="Sign in">
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="home-email">Email</Label>
            <Input id="home-email" name="demo-email" type="email" autocomplete="off" defaultValue="ada@looseleaf.dev" />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center justify-between gap-3">
              <Label for="home-password">Password</Label>
              <Button type="button" variant="link" size="xs">
                Forgot password?
              </Button>
            </div>
            <Input id="home-password" name="demo-password" type="password" autocomplete="off" defaultValue="pencil-case" />
          </div>
          <div class="flex items-center gap-2">
            <Checkbox id="home-remember" defaultChecked />
            <Label for="home-remember">Remember me on this desk</Label>
          </div>
        </CardContent>
        <CardFooter class="flex-col items-stretch gap-3">
          <Button type="submit" size="lg">
            {done.value ? <Icon name="check" /> : null}
            {done.value ? "Signed in" as const : "Sign in" as const}
          </Button>
          <p class="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            New here?
            <Button type="button" variant="link" size="sm">
              Make an account
            </Button>
          </p>
          <span role="status" class="sr-only">
            {done.value ? "Signed in as ada@looseleaf.dev (a demo: nothing was sent)" as const : "" as const}
          </span>
        </CardFooter>
      </form>
    </Card>;
  };
});
export default SignIn;
