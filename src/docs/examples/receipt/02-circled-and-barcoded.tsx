// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Receipt, ReceiptBarcode, ReceiptFooter, ReceiptHeader, ReceiptLine, ReceiptLines, ReceiptTotal } from "@/components/ui/receipt";
export const meta = {
  title: "Circled, barcoded, clipped" as const,
  description: "The total circled in red felt tip, a barcode whose bars come from the number under it, and a paper clip to keep it with the invoice." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Receipt as="article" fastener="clip" fastenerTone="sky" seed="checked" aria-label="Receipt from The Stationer">
      <ReceiptHeader>
        <span>The Stationer</span>
        <span>25 sep 2026 09:41</span>
      </ReceiptHeader>
      <ReceiptLines>
        <ReceiptLine qty={3} price="9.00">
          washi tape
        </ReceiptLine>
        <ReceiptLine price="2.10">glue stick</ReceiptLine>
        <ReceiptLine qty={12} price="18.00">
          felt tips
        </ReceiptLine>
      </ReceiptLines>
      <ReceiptTotal circled>29.10</ReceiptTotal>
      <ReceiptBarcode value="0042 1187 0925" />
      <ReceiptFooter>keep for your records</ReceiptFooter>
    </Receipt>;
  };
});
export default Example;
