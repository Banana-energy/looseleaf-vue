// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Receipt, ReceiptFooter, ReceiptHeader, ReceiptLine, ReceiptLines, ReceiptTotal } from "@/components/ui/receipt";
export const meta = {
  title: "A receipt" as const,
  description: "Pinked at both ends, typed, the lines a description list. The total is bigger; nothing else is." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Receipt as="article" seed="till" aria-label="Receipt from Looseleaf Cafe">
      <ReceiptHeader>
        <span>Looseleaf Cafe</span>
        <span>12 rue de l&apos;Eau</span>
        <span>25 sep 2026 14:02</span>
      </ReceiptHeader>
      <ReceiptLines>
        <ReceiptLine qty={1} price="4.50">
          oat latte
        </ReceiptLine>
        <ReceiptLine qty={1} price="3.40">
          flat white
        </ReceiptLine>
        <ReceiptLine qty={2} price="6.20">
          almond croissant
        </ReceiptLine>
      </ReceiptLines>
      <ReceiptTotal>14.10</ReceiptTotal>
      <ReceiptFooter>thank you - come again</ReceiptFooter>
    </Receipt>;
  };
});
export default Example;
