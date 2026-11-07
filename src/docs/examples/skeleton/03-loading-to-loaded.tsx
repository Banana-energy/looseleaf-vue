// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
export const meta = {
  title: "From loading to loaded" as const,
  description: "The skeleton and the content occupy the same room, so nothing moves when the swap happens. The region says it is busy while it waits; press Reload to see it again." as const,
  layout: "stack" as const
};
const notes = [{
  title: "Snail on a leaf" as const,
  body: "Three tries to get the shell to spiral the right way." as const
}, {
  title: "Teapot, three ways" as const,
  body: "The third one leaks. The second one is a hat." as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const loading = shallowRef(initialState(true));
  const setLoading = stateSetter(loading);
  const timer = shallowRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const load = () => {
    setLoading(true);
    clearTimeout(timer.value);
    timer.value = setTimeout(() => setLoading(false), 2200);
  };
  watchDependencies(() => {
    load();
    return () => clearTimeout(timer.value);
  }, () => [load], false);
  return () => {
    return <Card class="mx-auto w-full max-w-sm" seed="loaded">
      <CardHeader>
        <CardTitle>Recent pages</CardTitle>
        <CardDescription>{loading.value ? "Finding your pages..." as const : "Two pages, newest first." as const}</CardDescription>
      </CardHeader>
      <CardContent aria-busy={loading.value}>
        <ul role="list" class="flex flex-col gap-4">
          {notes.map(n => <li key={n.title} class="flex min-h-[3.25rem] flex-col gap-1">
              {loading.value ? <>
                  <Skeleton class="h-4 w-2/5" />
                  <Skeleton class="h-3.5 w-full" />
                </> : <>
                  <span class="font-bold">{n.title}</span>
                  <span class="text-[15px] leading-snug text-muted-foreground">{n.body}</span>
                </>}
            </li>)}
        </ul>
      </CardContent>
      <CardFooter class="border-t">
        <Button variant="outline" size="sm" onClick={load}>
          Reload
        </Button>
      </CardFooter>
    </Card>;
  };
});
export default Example;
