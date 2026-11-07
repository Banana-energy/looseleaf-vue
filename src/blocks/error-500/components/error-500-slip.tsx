// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Receipt, ReceiptBarcode, ReceiptFooter, ReceiptHeader, ReceiptLine, ReceiptLines, ReceiptTotal } from "@/components/ui/receipt";
type Error500SlipProps = {
  reference: string;
  request: string;
  time: string;
};
type CopyState = "idle" | "copied" | "failed";
const Error500Slip = defineUi<Error500SlipProps>("Error500Slip", ["reference", "request", "time"], (_props, {
  slots: _slots
}) => {
  const reference = computed(() => _props["reference"]);
  const request = computed(() => _props["request"]);
  const time = computed(() => _props["time"]);
  const copy = shallowRef<CopyState>(initialState("idle"));
  const setCopy = stateSetter(copy);
  watchDependencies(() => {
    if (copy.value === "idle") return;
    const t = setTimeout(() => setCopy("idle"), 2600);
    return () => clearTimeout(t);
  }, () => [copy.value], false);
  const copyReference = computed(() => async () => {
    try {
      await navigator.clipboard.writeText(reference.value);
      setCopy("copied");
    } catch {
      setCopy("failed");
    }
  });
  return () => {
    return <div class="flex flex-col items-center gap-3">
      <Receipt role="group" aria-label="Details for support" seed="error-500-slip" class="w-72 max-w-full text-start text-sm">
        <ReceiptHeader>
          <p>Incident slip</p>
          <p>keep this for support</p>
        </ReceiptHeader>
        <ReceiptLines>
          <ReceiptLine price="500">Status</ReceiptLine>
          <ReceiptLine price={time.value}>Time</ReceiptLine>
          <ReceiptLine price={request.value}>Asked for</ReceiptLine>
        </ReceiptLines>
        <ReceiptTotal label="Ref" circled seed="error-500-ref">
          {reference.value}
        </ReceiptTotal>
        <ReceiptBarcode value={reference.value.replace(/[^0-9a-z]/gi, "").toUpperCase()} />
        <ReceiptFooter>We are on it.</ReceiptFooter>
      </Receipt>
      <Button type="button" variant="outline" size="sm" onClick={copyReference.value}>
        <Icon name={copy.value === "copied" ? "check" as const : "copy" as const} />
        {copy.value === "copied" ? "Copied" as const : "Copy reference" as const}
      </Button>
      <p role="status" class="min-h-5 text-sm text-ink-muted">
        {copy.value === "copied" ? `Reference ${reference.value} copied.` : copy.value === "failed" ? "Could not copy. Select the reference on the slip instead." as const : "" as const}
      </p>
    </div>;
  };
});
export { Error500Slip };
