// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Paper } from "@/components/ui/paper";
import { Signature } from "@/components/ui/signature";
export const meta = {
  title: "The end of a letter" as const,
  description: "Sign it: the name is written left to right, then the flourish follows the pen." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 360
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const signed = shallowRef(initialState(true));
  const setSigned = stateSetter(signed);
  return () => {
    return <div class="grid w-full max-w-md gap-4">
      <Paper stock="paper" rules="ruled" tilt seed="letter" class="pt-4 pr-6 pb-6 pl-14">
        <p class="text-[15px] leading-[28px]">Thank you for the tomatoes, the jam, and the long letter; I read it twice. Come and see the garden in June.</p>
        <p class="text-[15px] leading-[28px]">Yours, always,</p>
        <div class="min-h-[72px] pt-[15px]">
          {signed.value ? <Signature key="s" animate size="md">
              Sam Whitcombe
            </Signature> : null}
        </div>
      </Paper>
      <Button variant="outline" size="sm" class="w-fit" onClick={() => {
        setSigned(false);
        setTimeout(() => setSigned(true), 60);
      }}>
        Sign again
      </Button>
    </div>;
  };
});
export default Example;
