// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
export const meta = {
  title: "Errors and validation" as const,
  description: "`FieldError` takes children or an `errors` array: one message is text, several are a list, duplicates collapse. It is announced as an alert and wears a wavy red pencil underline; `data-invalid` on the Field turns the label red, `aria-invalid` on the control draws its box red." as const,
  layout: "stack" as const
};
type Errs = {
  email?: string[];
  pass?: string[];
};
function check(email: string, pass: string): Errs {
  const e: Errs = {};
  if (!/^\S+@\S+\.\S+$/.test(email)) e.email = ["Enter an address like ada@notes.dev."];
  const p: string[] = [];
  if (pass.length < 8) p.push("Use at least 8 characters.");
  if (!/\d/.test(pass)) p.push("Add a number.");
  if (p.length) e.pass = p;
  return e;
}
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const email = shallowRef(initialState("ada"));
  const setEmail = stateSetter(email);
  const pass = shallowRef(initialState("pencil"));
  const setPass = stateSetter(pass);
  const shown = shallowRef(initialState(true));
  const setShown = stateSetter(shown);
  const errs = computed(() => shown.value ? check(email.value, pass.value) : {});
  return () => {
    return <form class="w-full max-w-sm" novalidate onSubmit={(e: SubmitEvent) => {
      e.preventDefault();
      setShown(true);
    }}>
      <FieldGroup>
        <Field data-invalid={!!errs.value.email}>
          <FieldLabel for="er-email">Email</FieldLabel>
          <Input id="er-email" type="email" value={email.value} aria-invalid={!!errs.value.email} aria-describedby="er-email-err" onChange={(e: Event) => setEmail((e.target as HTMLInputElement).value)} />
          <FieldError id="er-email-err" errors={errs.value.email?.map(message => ({
            message
          }))} />
        </Field>
        <Field data-invalid={!!errs.value.pass}>
          <FieldLabel for="er-pass">Password</FieldLabel>
          <Input id="er-pass" type="password" value={pass.value} aria-invalid={!!errs.value.pass} aria-describedby="er-pass-err" onChange={(e: Event) => setPass((e.target as HTMLInputElement).value)} />
          <FieldDescription>Eight characters and a number.</FieldDescription>
          <FieldError id="er-pass-err" errors={errs.value.pass?.map(message => ({
            message
          }))} />
        </Field>
        <FieldSeparator>then</FieldSeparator>
        <Field orientation="horizontal">
          <Button type="submit">Create account</Button>
          <Button type="button" variant="outline" onClick={() => setShown(false)}>
            Hide errors
          </Button>
        </Field>
      </FieldGroup>
    </form>;
  };
});
export default Example;
