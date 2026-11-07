// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Lettering } from "@/components/ui/lettering";
import { Paper } from "@/components/ui/paper";
import { Newsletter01Envelope } from "@/blocks/newsletter-01/components/newsletter-01-envelope";
import { Newsletter01Form, type Newsletter01Status } from "@/blocks/newsletter-01/components/newsletter-01-form";
type Newsletter01Props = {
  onSubscribe?: (email: string) => void | Promise<void>;
};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const Newsletter01 = defineUi<Newsletter01Props>("Newsletter01", ["onSubscribe"], (_props, {
  slots: _slots
}) => {
  const onSubscribe = computed(() => _props["onSubscribe"]);
  const titleId = useId();
  const status = shallowRef<Newsletter01Status>(initialState("idle"));
  const setStatus = stateSetter(status);
  const email = shallowRef(initialState(""));
  const setEmail = stateSetter(email);
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  const submit = computed(() => async () => {
    if (!EMAIL.test(email.value.trim())) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      await onSubscribe.value?.(email.value.trim());
      setStatus("done");
      setOpen(true);
    } catch {
      setStatus("failed");
    }
  });
  return () => {
    return <section aria-labelledby={titleId} class="@container relative w-full overflow-x-clip">
      <div class="px-8 py-14 @xl:py-20">
        <div class="mx-auto grid max-w-5xl items-center gap-x-14 gap-y-6 @3xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Paper stock="paper" tilt={false} tape="corner" tapeKind="washi-dots" seed="newsletter-card" class="px-6 py-8 @xl:px-9 @xl:py-10">
            <p class="font-type text-sm text-pencil-text">The Sunday letter</p>
            <Lettering as="h2" id={titleId} size="md" tone="marker" wobble={0.4} seed="newsletter-title" class="mt-3">
              One short letter, every Sunday
            </Lettering>
            <p class="mt-4 mb-6 text-lg/7 text-ink-soft">What we shipped, what we drew, and one good link. Three minutes, best with tea.</p>
            <Newsletter01Form status={status.value} email={email.value} onEmailChange={v => {
              setEmail(v);
              if (status.value === "invalid" || status.value === "failed") setStatus("idle");
            }} onSubmit={submit.value} onReset={() => {
              setStatus("idle");
              setEmail("");
              setOpen(false);
            }} />
          </Paper>

          <Newsletter01Envelope open={open.value} onOpenChange={setOpen} stamped={status.value === "done"} />
        </div>
      </div>
    </section>;
  };
});
export default Newsletter01;
export type { Newsletter01Props };
