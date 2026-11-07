// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Lettering } from "@/components/ui/lettering";
export const meta = {
  title: "Sizes, colors, duotone and wobble" as const,
  description: "Five sizes; the second color is a token; a duotone print adds a third pass; wobble writes each word a hair off the baseline." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-5">
      <div class="flex flex-wrap items-baseline gap-x-8 gap-y-2">
        <Lettering as="p" size="sm">small</Lettering>
        <Lettering as="p" size="md">medium</Lettering>
        <Lettering as="p" size="lg">large</Lettering>
      </div>
      <div class="flex flex-wrap gap-x-8 gap-y-2">
        <Lettering as="p" size="md" tone="teal">teal</Lettering>
        <Lettering as="p" size="md" tone="grape">grape</Lettering>
        <Lettering as="p" size="md" tone="bubblegum">bubblegum</Lettering>
        <Lettering as="p" size="md" tone="grass">grass</Lettering>
      </div>
      <div class="flex flex-wrap gap-x-10 gap-y-2">
        <Lettering as="p" size="lg" duotone="sky">Two colors</Lettering>
        <Lettering as="p" size="lg" tone="teal" wobble={1.6}>hand cut words</Lettering>
      </div>
    </div>;
  };
});
export default Example;
