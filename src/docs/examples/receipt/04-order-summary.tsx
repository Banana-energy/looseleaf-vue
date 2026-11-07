// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Receipt, ReceiptBarcode, ReceiptDivider, ReceiptFooter, ReceiptHeader, ReceiptLine, ReceiptLines, ReceiptTotal } from "@/components/ui/receipt";
export const meta = {
  title: "An order summary" as const,
  description: "A real checkout: quantities you can change, a total that follows, and the barcode of the order number. The receipt is ordinary DOM; only the ink is drawn." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const menu = [{
  name: "oat latte" as const,
  price: 4.5
}, {
  name: "almond croissant" as const,
  price: 3.1
}, {
  name: "washi tape" as const,
  price: 3
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const qty = shallowRef(initialState([1, 2, 0]));
  const setQty = stateSetter(qty);
  const total = computed(() => menu.reduce((sum, m, i) => sum + m.price * qty.value[i], 0));
  return () => {
    return <div class="flex flex-wrap items-start justify-center gap-x-12 gap-y-8">
      <Receipt as="article" seed="order" aria-label="Your order" aria-live="polite">
        <ReceiptHeader>
          <span>Your order</span>
          <span>no. 0042</span>
        </ReceiptHeader>
        <ReceiptLines>
          {menu.map((m, i) => qty.value[i] ? <ReceiptLine key={m.name} qty={qty.value[i]} price={(m.price * qty.value[i]).toFixed(2)}>
                {m.name}
              </ReceiptLine> : null)}
        </ReceiptLines>
        <ReceiptTotal circled={total.value > 10}>{total.value.toFixed(2)}</ReceiptTotal>
        <ReceiptDivider />
        <ReceiptBarcode value="0042 1187" />
        <ReceiptFooter>circled when it is over ten</ReceiptFooter>
      </Receipt>
      <div class="flex flex-col gap-3 pt-6">
        {menu.map((m, i) => <div key={m.name} class="flex items-center gap-3">
            <Button size="icon-sm" variant="outline" aria-label={`One less ${m.name}`} disabled={!qty.value[i]} onClick={() => setQty(q => q.map((v, j) => j === i ? v - 1 : v))}>
              <Icon name="minus" />
            </Button>
            <span class="w-36 text-ink">{m.name}</span>
            <Button size="icon-sm" aria-label={`One more ${m.name}`} onClick={() => setQty(q => q.map((v, j) => j === i ? v + 1 : v))}>
              <Icon name="plus" />
            </Button>
          </div>)}
      </div>
    </div>;
  };
});
export default Example;
