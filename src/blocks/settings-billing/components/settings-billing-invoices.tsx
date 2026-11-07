// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Receipt, ReceiptFooter, ReceiptHeader, ReceiptLine, ReceiptLines, ReceiptTotal } from "@/components/ui/receipt";
import type { Invoice } from "@/blocks/settings-billing/components/settings-billing-data";
export const SettingsBillingInvoices = defineUi<{
  invoices: Invoice[];
  onDownload?: (invoice: Invoice) => void;
}>("SettingsBillingInvoices", ["invoices", "onDownload"], (_props, {
  slots: _slots
}) => {
  const invoices = computed(() => _props["invoices"]);
  const onDownload = computed(() => _props["onDownload"]);
  const all = shallowRef(initialState(false));
  const setAll = stateSetter(all);
  const shown = computed(() => all.value ? invoices.value : invoices.value.slice(0, 3));
  return () => {
    return <div class="grid gap-6">
      <ul aria-label="Invoices" class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),18rem))] gap-x-6 gap-y-10">
        {shown.value.map((inv, i) => <li key={inv.number} class="grid w-full content-between justify-items-center gap-3">
            <Receipt as="article" seed={`invoice-${inv.number}`} aria-label={`Invoice ${inv.number}`} ends={i % 2 ? "perf" as const : "zig" as const} class="w-full max-w-72">
              <ReceiptHeader>
                <span>Looseleaf</span>
                <span>Invoice {inv.number}</span>
                <span>{inv.date}</span>
              </ReceiptHeader>
              <ReceiptLines>
                {inv.lines.map(l => <ReceiptLine key={l.name} price={l.price}>
                    {l.name}
                  </ReceiptLine>)}
              </ReceiptLines>
              <ReceiptTotal circled={i === 0}>{inv.total}</ReceiptTotal>
              <ReceiptFooter>paid by {inv.paidWith} - thank you</ReceiptFooter>
            </Receipt>
            <Button variant="outline" size="sm" onClick={() => onDownload.value?.(inv)} aria-label={`Download invoice ${inv.number}`}>
              <Icon name="download" />
              Download PDF
            </Button>
          </li>)}
      </ul>
      {invoices.value.length > 3 ? <Button variant="link" class="justify-self-start" aria-expanded={all.value} onClick={() => setAll(v => !v)}>
          {all.value ? "Show fewer invoices" as const : `Show ${invoices.value.length - 3} older invoices`}
        </Button> : null}
    </div>;
  };
});
