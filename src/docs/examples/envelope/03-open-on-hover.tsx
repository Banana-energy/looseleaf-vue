// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Envelope, EnvelopeAddress, EnvelopeFront, EnvelopeLetter, EnvelopeTrigger } from "@/components/ui/envelope";
export const meta = {
  title: "Opens when you look" as const,
  description: "`openOnHover` opens it under a mouse and closes it again on leaving, unless you clicked it open. On touch and keyboard the trigger works as always." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 420
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Envelope openOnHover stock="paper" stamp="grape" seed="hover" class="mt-12" tilt={1}>
      <EnvelopeFront>
        <EnvelopeAddress>
          <p>A curious reader</p>
        </EnvelopeAddress>
        <EnvelopeTrigger>Open the letter</EnvelopeTrigger>
      </EnvelopeFront>
      <EnvelopeLetter stock="index-card" rules="index">
        <p class="font-script text-2xl leading-none font-bold">Peek</p>
        <p class="text-sm">Hover me, or press the envelope.</p>
      </EnvelopeLetter>
    </Envelope>;
  };
});
export default Example;
