// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { PeelCorner, PeelCornerPage, PeelCornerUnder } from "@/components/ui/peel-corner";
export const meta = {
  title: "Voucher with a copy button" as const,
  description: "A real use: the code lives on the sheet underneath, with a working button. It is inert until the corner is open, then a normal control. Controlled, so the page can open it too." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 340
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  const copied = shallowRef(initialState(false));
  const setCopied = stateSetter(copied);
  return () => {
    return <div class="flex flex-col items-center gap-3">
      <PeelCorner peeled={open.value} onPeeledChange={setOpen} class="w-80" label="Reveal the voucher code">
        <PeelCornerPage class="h-52">
          <p class="font-script text-3xl leading-none">Loyalty voucher</p>
          <p class="mt-2 text-sm">Thank you for ten coffees. This one is on us.</p>
        </PeelCornerPage>
        <PeelCornerUnder class="items-end justify-end">
          <div class="flex flex-col items-end gap-2 pb-1">
            <p class="font-script text-4xl leading-none">FREE-10</p>
            <Button size="xs" variant="outline" onClick={async () => {
              await navigator.clipboard?.writeText("FREE-10");
              setCopied(true);
            }}>
              {copied.value ? "Copied" as const : "Copy code" as const}
            </Button>
          </div>
        </PeelCornerUnder>
      </PeelCorner>
      <Button variant="link" size="sm" onClick={() => setOpen(o => !o)}>
        {open.value ? "Close the corner" as const : "Or open it from here" as const}
      </Button>
    </div>;
  };
});
export default Example;
