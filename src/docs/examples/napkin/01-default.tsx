// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Napkin, NapkinContent, NapkinFooter, NapkinTitle } from "@/components/ui/napkin";
export const meta = {
  title: "A napkin" as const,
  description: "Folded in four, so it has a crease each way. The edge is pinked and the border pressed into the tissue." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Napkin seed="specials" tape="top">
      <NapkinTitle>Specials</NapkinTitle>
      <NapkinContent>soup of the day, a very small pie, and something with pears</NapkinContent>
      <NapkinFooter>until six</NapkinFooter>
    </Napkin>;
  };
});
export default Example;
