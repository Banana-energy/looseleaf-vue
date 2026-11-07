// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SidebarInput } from "@/components/ui/sidebar";
export const SidebarOptInForm = defineUi<{
  onSubmit?: (email: string) => void;
}>("SidebarOptInForm", ["onSubmit"], (_props, {
  slots: _slots
}) => {
  const onSubmit = computed(() => _props["onSubmit"]);
  const id = useId();
  const sent = shallowRef(initialState(false));
  const setSent = stateSetter(sent);
  const error = shallowRef<string | null>(initialState(null));
  const setError = stateSetter(error);
  return () => {
    return <Card class="gap-2 py-4">
      <CardHeader class="px-4">
        <CardTitle class="text-xl">Get the postcard</CardTitle>
        <CardDescription>A short note on new pens and papers, every other Friday. Only ink, no spam.</CardDescription>
      </CardHeader>
      <CardContent class="px-4">
        {sent.value ? <p role="status" class="font-hand text-sm text-green">
            Thank you! Watch your mailbox on Friday.
          </p> : <form class="grid gap-2.5" novalidate onSubmit={(event: SubmitEvent) => {
          event.preventDefault();
          const value = new FormData(event.currentTarget as HTMLFormElement).get("email");
          const email = typeof value === "string" ? value.trim() : "" as const;
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("That does not look like an email address yet.");
            return;
          }
          setError(null);
          onSubmit.value?.(email);
          setSent(true);
        }}>
            <Label for={id} class="sr-only">
              Email address
            </Label>
            <SidebarInput id={id} name="email" type="email" autoComplete="email" required placeholder="you@example.com" aria-invalid={error.value ? true : undefined} aria-describedby={error.value ? `${id}-error` : undefined} onChange={() => error.value && setError(null)} />
            {error.value ? <p id={`${id}-error`} role="alert" class="font-hand text-sm text-red">
                {error.value}
              </p> : null}
            <Button size="sm" class="w-full" type="submit">
              Subscribe
            </Button>
          </form>}
      </CardContent>
    </Card>;
  };
});
