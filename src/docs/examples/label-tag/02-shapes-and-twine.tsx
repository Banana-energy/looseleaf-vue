// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { LabelTag, LabelTagDescription, LabelTagPrice, LabelTagTitle } from "@/components/ui/label-tag";
export const meta = {
  title: "Shapes, stocks, string" as const,
  description: "Price tag, arched, and a luggage tag; kraft, white and colored card; natural or colored twine; a brass eyelet, a steel one, or a bare hole." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-start justify-center gap-x-12 gap-y-16 p-6">
      <LabelTag stock="paper" twine="tomato" eyelet="steel" seed="a" tilt={2}>
        <LabelTagTitle>Gift</LabelTagTitle>
        <LabelTagDescription>for Ada</LabelTagDescription>
      </LabelTag>
      <LabelTag stock="sticky-yellow" shape="round" twine="grass" seed="b" tilt={-2}>
        <LabelTagTitle>New</LabelTagTitle>
        <LabelTagDescription>this week</LabelTagDescription>
        <LabelTagPrice>4.50</LabelTagPrice>
      </LabelTag>
      <LabelTag stock="sticky-pink" twine="grape" eyelet="none" seed="c" tilt={3}>
        <LabelTagTitle>Hi!</LabelTagTitle>
        <LabelTagDescription>a bare hole</LabelTagDescription>
      </LabelTag>
      <LabelTag shape="luggage" string={60} seed="d" tilt={1.4}>
        <div>
          <LabelTagTitle>Ada Lovelace</LabelTagTitle>
          <LabelTagDescription>Gate 7 - seat 14A</LabelTagDescription>
        </div>
      </LabelTag>
    </div>;
  };
});
export default Example;
