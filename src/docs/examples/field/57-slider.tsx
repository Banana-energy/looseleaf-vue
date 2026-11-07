// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Field, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
export const meta = {
  title: "Slider" as const,
  description: "shadcn's `field-slider`: a range slider has no single control to label, so FieldTitle names it (and `aria-label` goes on the slider). The description reads the two values out." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const value = shallowRef(initialState([200, 800]));
  const setValue = stateSetter(value);
  return () => {
    return <div class="w-full max-w-md">
      <Field>
        <FieldTitle>Price Range</FieldTitle>
        <FieldDescription>
          Set your budget range ($<span class="font-medium tabular-nums">{value.value[0]}</span> - <span class="font-medium tabular-nums">{value.value[1]}</span>).
        </FieldDescription>
        <Slider value={value.value} onValueChange={setValue} max={1000} min={0} step={10} class="mt-2 w-full" aria-label="Price Range" />
      </Field>
    </div>;
  };
});
export default Example;
