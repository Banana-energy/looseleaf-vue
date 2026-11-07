// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Envelope, EnvelopeAddress, EnvelopeFront, EnvelopeLetter, EnvelopeSender, EnvelopeTrigger } from "@/components/ui/envelope";
export const meta = {
  title: "An envelope" as const,
  description: "Press it, or Tab to it and press Space: the flap stands up behind and the letter slides out. Hover lifts the flap a sliver." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 420
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Envelope seed="post" class="mt-12">
      <EnvelopeFront>
        <EnvelopeSender>
          The Stationer
          <br />
          High Street
        </EnvelopeSender>
        <EnvelopeAddress>
          <p>Ada Lovelace</p>
          <p>12 rue de l&apos;Eau</p>
          <p>Paris</p>
        </EnvelopeAddress>
        <EnvelopeTrigger>Read the letter from The Stationer</EnvelopeTrigger>
      </EnvelopeFront>
      <EnvelopeLetter>
        <p class="font-script text-3xl leading-none font-bold">Dear Ada,</p>
        <p class="mt-2">The flap is up and the letter comes out from behind the front.</p>
      </EnvelopeLetter>
    </Envelope>;
  };
});
export default Example;
