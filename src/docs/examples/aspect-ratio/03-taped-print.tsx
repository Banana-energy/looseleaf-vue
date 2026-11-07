// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Doodle } from "@/components/ui/doodle";
import { Tape } from "@/components/ui/tape";
export const meta = {
  title: "Taped at the corners" as const,
  description: "A 4:3 print with no border, held by four strips of masking tape laid across its corners. The tape is placed with className (absolute, a little outside, turned), like any element." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 320
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex justify-center p-10">
      <div class="relative w-80">
        <AspectRatio ratio={4 / 3} class="grid place-items-center overflow-hidden bg-slip shadow-slip">
          <svg viewBox="0 0 80 60" preserveAspectRatio="none" aria-hidden="true" class="absolute inset-0 size-full">
            <path d="M-2 44 Q14 35 30 41 T60 39 T82 42 V62 H-2Z" class="fill-grass/35 stroke-ink" stroke-width={1.4} stroke-linejoin="round" vector-effect="non-scaling-stroke" />
            <path d="M-2 52 Q18 44 38 50 T82 48 V62 H-2Z" class="fill-grass/60 stroke-ink" stroke-width={1.4} stroke-linejoin="round" vector-effect="non-scaling-stroke" />
            <path d="M12 56 l.6 -2.2 m1.6 2.2 l1.4 -2 M56 54 l.6 -2.2 m1.6 2.2 l1.2 -2 M33 58 l.6 -2.2 m1.6 2.2 l1.2 -2" fill="none" class="stroke-ink" stroke-width={1.2} stroke-linecap="round" vector-effect="non-scaling-stroke" />
          </svg>
          <Doodle name="sun" size={96} class="relative -mt-8" />
        </AspectRatio>
        <Tape kind="masking" length={72} height={22} angle={-42} class="absolute -top-2 -left-7" seed="c1" />
        <Tape kind="masking" length={72} height={22} angle={41} class="absolute -top-2 -right-7" seed="c2" />
        <Tape kind="masking" length={72} height={22} angle={40} class="absolute -bottom-2 -left-7" seed="c3" />
        <Tape kind="masking" length={72} height={22} angle={-43} class="absolute -right-7 -bottom-2" seed="c4" />
      </div>
    </div>;
  };
});
export default Example;
