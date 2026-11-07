// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Seal } from "@/components/ui/seal";
export const meta = {
  title: "Marks, rings and wax" as const,
  description: "A hand-drawn check or star takes the place of the words (it survives at 16 px where letters do not). A ringed seal carries lettering round its rim. Wax takes an initial, a check or a star." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center justify-center gap-6">
      <Seal mark="check" tone="sky" />
      <Seal variant="rosette" mark="check" tone="grass" ribbon="lemon" />
      <Seal variant="starburst" mark="star" tone="tangerine" />
      <Seal variant="ring" text="Verified" tone="sky" ring="Official seal" size={128} />
      <Seal variant="ring" mark="check" tone="grass" ring="Checked by hand" size={128} />
      <Seal variant="wax" text="L" tone="red" />
      <Seal variant="wax" mark="check" tone="grape" />
    </div>;
  };
});
export default Example;
