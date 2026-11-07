// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Envelope, EnvelopeAddress, EnvelopeFront, EnvelopeLetter, EnvelopeSender, EnvelopeTrigger } from "@/components/ui/envelope";
import { Stamp } from "@/components/ui/stamp";
type Newsletter01EnvelopeProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stamped: boolean;
};
const Newsletter01Envelope = defineUi<Newsletter01EnvelopeProps>("Newsletter01Envelope", ["open", "onOpenChange", "stamped"], (_props, {
  slots: _slots
}) => {
  const open = computed(() => _props["open"]);
  const onOpenChange = computed(() => _props["onOpenChange"]);
  const stamped = computed(() => _props["stamped"]);
  return () => {
    return <div class="relative mx-auto flex aspect-[40/39] w-full max-w-sm flex-col justify-end">
      <Envelope stock="kraft" stamp="tomato" postmark open={open.value} onOpenChange={onOpenChange.value} seed="newsletter-envelope" tilt={1}>
        <EnvelopeFront>
          <EnvelopeSender>
            Penmark
            <br />
            Lisbon
          </EnvelopeSender>
          <EnvelopeAddress class="text-[1.15rem]">
            <p>You</p>
            <p>Your inbox</p>
            <p>Sunday morning</p>
          </EnvelopeAddress>
          <EnvelopeTrigger>Peek inside the Sunday letter</EnvelopeTrigger>
        </EnvelopeFront>
        <EnvelopeLetter>
          <p class="font-script text-2xl leading-none font-bold">Sunday letter, no. 41</p>
          <p class="mt-1 text-sm">On buying too many pens, and one very good link.</p>
        </EnvelopeLetter>
      </Envelope>
      {stamped.value ? <Stamp text="Subscribed" ink="green" w={150} h={50} tilt={-8} ghost seed="newsletter-stamp" class="pointer-events-none absolute end-3 bottom-5 z-30 animate-in zoom-in-[1.7] fade-in-0 duration-(--ll-dur-pop)" /> : null}
    </div>;
  };
});
export { Newsletter01Envelope };
