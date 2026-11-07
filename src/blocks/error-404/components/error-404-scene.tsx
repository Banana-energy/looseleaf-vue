// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Lettering } from "@/components/ui/lettering";
import { Mascot } from "@/components/ui/mascot";
import { Napkin, NapkinContent } from "@/components/ui/napkin";
const Error404Scene = defineUi<{}>("Error404Scene", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div data-slot="error-scene" aria-hidden="true" class="flex flex-col items-center gap-y-6 @xl:flex-row @xl:items-end @xl:justify-center @xl:gap-x-2">
      <Napkin fold="quarter" stain fastener="pin" fastenerTone="tomato" seed="error-404-napkin" class="min-h-0 w-72 max-w-full p-7">
        <NapkinContent class="flex items-center justify-center">
          <Lettering as="p" size="hero" tone="tomato" seed="error-404-digits" class="ll-num">
            404
          </Lettering>
        </NapkinContent>
      </Napkin>
      <Mascot pose="shrug" size={184} class="mb-1 h-[184px] w-auto @xl:-ms-10" />
    </div>;
  };
});
export { Error404Scene };
