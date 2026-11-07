// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Receipt, ReceiptHeader, ReceiptLine, ReceiptLines, ReceiptTotal } from "@/components/ui/receipt";
export const meta = {
  title: "Four ways to cut it" as const,
  description: "`ends` is the cut of both ends: the tear bar's sawtooth, a perforation, a hand tear, or a plain guillotine." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const ends = ["zig", "perf", "torn", "cut"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid grid-cols-2 justify-items-center gap-x-8 gap-y-10 p-4">
      {ends.map(e => <Receipt as="article" key={e} ends={e} seed={e} class="w-44" aria-label={`Receipt, ${e} ends`}>
          <ReceiptHeader>
            <span>{e}</span>
          </ReceiptHeader>
          <ReceiptLines>
            <ReceiptLine price="2.20">tea</ReceiptLine>
          </ReceiptLines>
          <ReceiptTotal>2.20</ReceiptTotal>
        </Receipt>)}
    </div>;
  };
});
export default Example;
