// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { FlipCard, FlipCardBack, FlipCardFront, FlipCardTrigger } from "@/components/ui/flip-card";
export const meta = {
  title: "Buttons on the faces" as const,
  description: "trigger={false} leaves the card free of the overlay, so a face can hold real buttons. The flip button is your own." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 300
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <FlipCard trigger={false} class="h-52 w-72">
      <FlipCardFront class="gap-3">
        <span class="text-3xl">Studio pass</span>
        <Button size="sm">Book a desk</Button>
      </FlipCardFront>
      <FlipCardBack class="gap-2 text-xl">
        <span>Mon to Fri, 9 to 5</span>
        <span class="font-hand text-sm text-pencil-text">bring your own kettle</span>
      </FlipCardBack>
      <FlipCardTrigger overlay={false} asChild>
        <Button variant="link" size="sm" class="absolute end-2 bottom-1 z-(--ll-z-raised)">
          Details
        </Button>
      </FlipCardTrigger>
    </FlipCard>;
  };
});
export default Example;
