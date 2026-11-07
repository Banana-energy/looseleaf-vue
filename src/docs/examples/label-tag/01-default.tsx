// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { LabelTag, LabelTagDescription, LabelTagPrice, LabelTagTitle } from "@/components/ui/label-tag";
export const meta = {
  title: "A hang tag" as const,
  description: "A card with clipped corners, a hole with its patch and brass eyelet, and a loop of natural twine. Everything drawn is one sheet: it turns and casts one shadow." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <LabelTag seed="sale" tilt={-3}>
      <LabelTagTitle>Sale</LabelTagTitle>
      <LabelTagDescription>while stocks last</LabelTagDescription>
      <LabelTagPrice>12.00</LabelTagPrice>
    </LabelTag>;
  };
});
export default Example;
