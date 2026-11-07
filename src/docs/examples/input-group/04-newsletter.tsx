// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Subscribe form" as const,
  description: "A real-world use: a labeled group in a form. The label points at the control, the marker button is part of the same box, and a bad address turns the whole group red." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const email = shallowRef(initialState(""));
  const setEmail = stateSetter(email);
  const state = shallowRef<"idle" | "bad" | "ok">(initialState("idle"));
  const setState = stateSetter(state);
  return () => {
    return <form class="grid w-full max-w-sm gap-2" novalidate onSubmit={(e: SubmitEvent) => {
      e.preventDefault();
      setState(/^\S+@\S+\.\S+$/.test(email.value) ? "ok" as const : "bad" as const);
    }}>
      <Label for="news-email">Field notes, twice a month</Label>
      <InputGroup>
        <InputGroupAddon>
          <Icon name="mail" />
        </InputGroupAddon>
        <InputGroupInput id="news-email" type="email" placeholder="you@example.com" value={email.value} aria-invalid={state.value === "bad"} aria-describedby="news-help" onChange={(e: Event) => {
          setEmail((e.target as HTMLInputElement).value);
          setState("idle");
        }} />
        <InputGroupAddon align="inline-end">
          <InputGroupButton type="submit" variant="default">
            Subscribe
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <p id="news-help" role="status" class={state.value === "bad" ? "text-sm text-red" as const : "text-sm text-ink-muted" as const}>
        {state.value === "bad" ? "That does not look like an address." as const : state.value === "ok" ? "Thank you. Watch your inbox." as const : "No spam, and you can leave with one click." as const}
      </p>
    </form>;
  };
});
export default Example;
