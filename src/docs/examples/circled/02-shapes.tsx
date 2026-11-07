// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Circled } from "@/components/ui/circled";
export const meta = {
  title: "Shapes and pens" as const,
  description: "A circle, a box and a pair of brackets; ink, blue, red and a brush pen." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid max-w-lg gap-6 py-2 text-[17px] leading-[2]">
      <p>
        A <Circled class="mx-1.5">circle</Circled>, a <Circled shape="box" class="mx-1.5">box</Circled>, and{" "}
        <Circled shape="brackets" class="mx-2">
          a pair of brackets
        </Circled>{" "}
        around a phrase.
      </p>
      <p class="flex flex-wrap gap-x-6">
        <Circled tone="blue">blue felt</Circled>
        <Circled tone="red">red felt</Circled>
        <Circled tone="pencil">pencil</Circled>
        <Circled tone="red" weight="brush">
          brush pen
        </Circled>
      </p>
    </div>;
  };
});
export default Example;
