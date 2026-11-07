// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export const meta = {
  title: "Create a project" as const,
  description: "The shadcn demo: a card around a small form. A text field, a Select (its list opens in `position=\"popper\"` so it lines up with the trigger) and a footer with the two answers pushed apart. Deploy reports what it would do." as const,
  layout: "stack" as const,
  height: 460
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const status = shallowRef(initialState(""));
  const setStatus = stateSetter(status);
  return () => {
    return <Card seed="create" class="mx-auto w-full max-w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="card-create-form" onSubmit={(e: SubmitEvent) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget as HTMLFormElement);
          setStatus(`Deploying "${String(data.get("name") || "untitled")}" on ${String(data.get("framework") || "no framework")}`);
        }}>
          <div class="grid w-full items-center gap-6">
            <div class="flex flex-col gap-3">
              <Label for="card-create-name">Name</Label>
              <Input id="card-create-name" name="name" placeholder="Name of your project" />
            </div>
            <div class="flex flex-col gap-3">
              <Label for="card-create-framework">Framework</Label>
              <Select name="framework">
                <SelectTrigger id="card-create-framework" class="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <p role="status" class="mt-4 min-h-6 text-sm text-muted-foreground">
          {status.value}
        </p>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button variant="outline" type="button" onClick={() => setStatus("Nothing deployed.")}>
          Cancel
        </Button>
        <Button type="submit" form="card-create-form">
          Deploy
        </Button>
      </CardFooter>
    </Card>;
  };
});
export default Example;
