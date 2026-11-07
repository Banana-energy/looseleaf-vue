// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Login" as const,
  description: "The shadcn demo: a title, a description, a link tucked into CardAction, a form of two labeled fields with a \"forgot\" link beside the second label, and a footer of two full-width buttons. Nothing is drawn but the paper, the fields and the buttons." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card seed="login" class="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
        <CardAction>
          <Button variant="link">Sign up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="card-login-form" onSubmit={(e: SubmitEvent) => e.preventDefault()}>
          <div class="flex flex-col gap-6">
            <div class="grid gap-2">
              <Label for="card-login-email">Email</Label>
              <Input id="card-login-email" type="email" placeholder="m@example.com" required />
            </div>
            <div class="grid gap-2">
              <div class="flex items-center">
                <Label for="card-login-password">Password</Label>
                <a href="#forgot" class="ms-auto inline-block text-sm text-link underline-offset-4 hover:text-link-hover hover:underline">
                  Forgot your password?
                </a>
              </div>
              <Input id="card-login-password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex-col gap-3">
        <Button type="submit" form="card-login-form" class="w-full">
          Login
        </Button>
        <Button variant="outline" class="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>;
  };
});
export default Example;
