// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Stamp } from "@/components/ui/stamp";
export const meta = {
  title: "Presets" as const,
  description: "Ink pressed through a worn pad: about 86 percent of it survives, patches are missed, the border wobbles and the whole stamp tilts a few degrees." as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center gap-8">
      <Stamp name="stamp-approved" />
      <Stamp name="stamp-draft" />
      <Stamp name="stamp-paid" />
      <Stamp name="stamp-urgent" />
    </div>;
  };
});
export default Example;
