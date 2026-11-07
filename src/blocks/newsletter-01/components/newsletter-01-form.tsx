// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
type Newsletter01Status = "idle" | "invalid" | "sending" | "failed" | "done";
type Newsletter01FormProps = {
  status: Newsletter01Status;
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
  onReset: () => void;
};
const Newsletter01Form = defineUi<Newsletter01FormProps>("Newsletter01Form", ["status", "email", "onEmailChange", "onSubmit", "onReset"], (_props, {
  slots: _slots
}) => {
  const status = computed(() => _props["status"]);
  const email = computed(() => _props["email"]);
  const onEmailChange = computed(() => _props["onEmailChange"]);
  const onSubmit = computed(() => _props["onSubmit"]);
  const onReset = computed(() => _props["onReset"]);
  const id = useId();
  const inputRef = shallowRef<HTMLInputElement | null>(null);
  const doneRef = shallowRef<HTMLDivElement | null>(null);
  const bad = computed(() => status.value === "invalid" || status.value === "failed");
  watchDependencies(() => {
    if (status.value === "done") doneRef.value?.focus();
    if (status.value === "invalid" || status.value === "failed") inputRef.value?.focus();
  }, () => [status.value], false);
  return () => {
    if (status.value === "done") {
      return <div ref={doneRef} tabindex={-1} role="status" class="rounded-none outline-none">
        <p class="font-script text-3xl leading-none font-bold text-ink">You&rsquo;re on the list.</p>
        <p class="mt-2 text-lg/7 text-ink-soft">
          We sent a note to <strong class="font-bold text-ink">{email.value}</strong>. Click the link inside to confirm, and the first letter lands on Sunday.
        </p>
        <Button type="button" variant="link" size="sm" onClick={onReset.value} class="-ms-3 mt-1">
          Use a different address
        </Button>
      </div>;
    }
    return <form novalidate onSubmit={(e: SubmitEvent) => {
      e.preventDefault();
      onSubmit.value();
    }}>
      <Field data-invalid={bad.value || undefined}>
        <FieldLabel for={`${id}-email`}>Your email address</FieldLabel>
        <div class="flex flex-col gap-3 @lg:flex-row @lg:gap-4">
          <Input ref={inputRef} id={`${id}-email`} type="email" name="email" autocomplete="email" required placeholder="you@example.com" value={email.value} onChange={(e: Event) => onEmailChange.value((e.target as HTMLInputElement).value)} aria-invalid={bad.value || undefined} aria-describedby={`${id}-help${bad.value ? ` ${id}-error` : "" as const}`} class="min-w-0 @lg:flex-1" />
          <Button type="submit" disabled={status.value === "sending"}>
            {status.value === "sending" ? "Subscribing…" as const : "Subscribe" as const}
          </Button>
        </div>
        <FieldDescription id={`${id}-help`}>No spam. Leave with one click. 12,400 people read it.</FieldDescription>
        {status.value === "invalid" ? <FieldError id={`${id}-error`}>That does not look like an email address. Check it for typos?</FieldError> : null}
        {status.value === "failed" ? <FieldError id={`${id}-error`}>Something went wrong on our side. Please try again in a moment.</FieldError> : null}
      </Field>
    </form>;
  };
});
export { Newsletter01Form };
export type { Newsletter01Status };
