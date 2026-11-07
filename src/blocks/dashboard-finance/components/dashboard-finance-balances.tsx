// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Receipt, ReceiptBarcode, ReceiptFooter, ReceiptHeader, ReceiptLine, ReceiptLines, ReceiptTotal } from "@/components/ui/receipt";
import { ACCOUNTS, money, shortDate, TODAY } from "@/blocks/dashboard-finance/components/dashboard-finance-data";
export const Balances = defineUi<{}>("Balances", [], (_props, {
  slots: _slots
}) => {
  const total = computed(() => ACCOUNTS.reduce((sum, a) => sum + a.cents, 0));
  return () => {
    return <section aria-labelledby="finance-balances" class="flex justify-center">
      <Receipt fastener="clip" seed="finance-balances">
        <ReceiptHeader>
          <h2 id="finance-balances">Balances</h2>
          <div>Marigold household</div>
          <div>{shortDate(TODAY)}, 2026</div>
        </ReceiptHeader>
        <ReceiptLines>
          {ACCOUNTS.map(a => <ReceiptLine key={a.name} price={a.cents < 0 ? <span class="text-red">{money(a.cents)}</span> : money(a.cents)}>
              {a.name}
            </ReceiptLine>)}
        </ReceiptLines>
        <ReceiptTotal label="Net worth" circled seed="finance-total">
          {money(total.value)}
        </ReceiptTotal>
        <ReceiptBarcode value="0042 1187 0925" />
        <ReceiptFooter>Checked this morning. Thank you, come again.</ReceiptFooter>
      </Receipt>
    </section>;
  };
});
