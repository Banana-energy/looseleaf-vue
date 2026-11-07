// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import Cta01 from "@/blocks/cta-01/page";
import { Desk } from "@/components/ui/desk";
const Cta01Preview = defineUi<{}>("Cta01Preview", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Desk class="min-h-[inherit]" objects={["clips"]} seed="cta-01">
      <Cta01 />
    </Desk>;
  };
});
export default Cta01Preview;
