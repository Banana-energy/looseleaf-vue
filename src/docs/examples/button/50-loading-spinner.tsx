// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
export const meta = {
  title: "Loading, with a spinner" as const,
  description: "The shadcn pattern: a Spinner in front of the label inside a disabled button. The first and last are the static state (disabled buttons are dashed). Press the second to watch a request go through: it is `aria-disabled` while it works instead of `disabled`, so keyboard focus stays on it." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const sending = shallowRef(initialState(false));
  const setSending = stateSetter(sending);
  const timer = shallowRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  watchDependencies(() => () => clearTimeout(timer.value), () => [], false);
  return () => {
    function send() {
      if (sending.value) return;
      setSending(true);
      timer.value = setTimeout(() => setSending(false), 2200);
    }
    return <div class="flex flex-wrap items-center gap-4">
      <Button size="sm" variant="outline" disabled>
        <Spinner />
        Submit
      </Button>
      <Button onClick={send} aria-disabled={sending.value} aria-busy={sending.value}>
        {sending.value && <Spinner />}
        {sending.value ? "Sending" as const : "Send the letter" as const}
      </Button>
      <Button variant="secondary" disabled>
        <Spinner />
        Please wait
      </Button>
    </div>;
  };
});
export default Example;
