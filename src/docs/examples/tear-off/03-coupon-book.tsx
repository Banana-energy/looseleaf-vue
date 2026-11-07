// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { TearOff, TearOffBody, TearOffStub } from "@/components/ui/tear-off";
export const meta = {
  title: "Coupon book" as const,
  description: "A real use: onTear redeems the coupon, and a controlled torn state lets the book be reset. The confetti stays inside the ticket." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 330
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const torn = shallowRef(initialState(false));
  const setTorn = stateSetter(torn);
  const redeemed = shallowRef(initialState(0));
  const setRedeemed = stateSetter(redeemed);
  return () => {
    return <div class="flex flex-col items-center gap-4">
      <TearOff torn={torn.value} onTornChange={setTorn} onTear={() => setRedeemed(n => n + 1)} tornMessage="Coupon redeemed.">
        <TearOffBody class="relative w-72">
          <Confetti active={torn.value} count={40} spread={100} />
          <p class="font-script text-3xl leading-none">Bakery of the month</p>
          <p class="mt-2 text-sm">One croissant, warm, any day.</p>
        </TearOffBody>
        <TearOffStub class="w-28 justify-start gap-0 pt-3.5 pb-2">
          <span class="font-script text-3xl leading-[30px]">free</span>
          <span class="text-sm leading-[30px] text-pencil-text">tear here</span>
        </TearOffStub>
      </TearOff>
      <div class="flex items-center gap-3">
        <span class="text-sm text-muted-foreground">Redeemed {redeemed.value} time{redeemed.value === 1 ? "" as const : "s" as const}</span>
        <Button variant="outline" size="sm" onClick={() => setTorn(false)}>
          New coupon
        </Button>
      </div>
    </div>;
  };
});
export default Example;
