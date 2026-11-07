// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Envelope, EnvelopeAddress, EnvelopeFront, EnvelopeLetter, EnvelopeTrigger } from "@/components/ui/envelope";
export const meta = {
  title: "Manila, white, airmail" as const,
  description: "Kraft (the default), white paper with a sky-blue stamp, and an airmail envelope with its striped border. Each stamp is perforated; each has a postmark over it." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center justify-center gap-8">
      <Envelope seed="a" tilt={-1} class="w-52">
        <EnvelopeFront>
          <EnvelopeAddress class="text-[1.1rem]">
            <p>The Stationer</p>
            <p>High Street</p>
          </EnvelopeAddress>
          <EnvelopeTrigger>Open the letter from Ada</EnvelopeTrigger>
        </EnvelopeFront>
        <EnvelopeLetter>hello</EnvelopeLetter>
      </Envelope>
      <Envelope stock="paper" stamp="sky" seed="b" tilt={0.8} class="w-52">
        <EnvelopeFront>
          <EnvelopeAddress class="text-[1.1rem]">
            <p>Marguerite</p>
            <p>Lyon</p>
          </EnvelopeAddress>
          <EnvelopeTrigger>Open the letter for Marguerite</EnvelopeTrigger>
        </EnvelopeFront>
        <EnvelopeLetter>hello</EnvelopeLetter>
      </Envelope>
      <Envelope stock="paper" airmail stamp="tangerine" seed="c" tilt={-0.6} class="w-52">
        <EnvelopeFront class="ps-[15%] pb-[13%]">
          <EnvelopeAddress class="text-[1.1rem]">
            <p>Ms. A. Lovelace</p>
            <p>Par avion</p>
          </EnvelopeAddress>
          <EnvelopeTrigger>Open the airmail letter</EnvelopeTrigger>
        </EnvelopeFront>
        <EnvelopeLetter>hello</EnvelopeLetter>
      </Envelope>
    </div>;
  };
});
export default Example;
