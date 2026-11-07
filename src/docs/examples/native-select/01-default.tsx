// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
export const meta = {
  title: "Default" as const,
  description: "The browser's own select in a hand-drawn frame: its popup, its mobile picker, its typeahead. The chevron is drawn; a first option with an empty value reads as a placeholder." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <NativeSelect defaultValue="" class="w-[220px]" aria-label="Country">
      <NativeSelectOption value="" disabled>
        Choose a country
      </NativeSelectOption>
      <NativeSelectOption value="is">Iceland</NativeSelectOption>
      <NativeSelectOption value="pt">Portugal</NativeSelectOption>
      <NativeSelectOption value="jp">Japan</NativeSelectOption>
      <NativeSelectOption value="ca">Canada</NativeSelectOption>
    </NativeSelect>;
  };
});
export default Example;
