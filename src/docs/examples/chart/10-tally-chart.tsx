// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { TallyChart } from "@/components/ui/chart";
export const meta = {
  title: "Tally chart" as const,
  description: "Counts as hand-tallied marks: four uprights and a slash across for every five, in the color of the row. When a row is too long for the width, each mark starts to stand for more and says so." as const,
  layout: "stack" as const
};
const cups = [{
  drink: "Tea" as const,
  cups: 23
}, {
  drink: "Coffee" as const,
  cups: 14
}, {
  drink: "Cocoa" as const,
  cups: 8
}, {
  drink: "Water" as const,
  cups: 31
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <TallyChart data={cups} nameKey="drink" valueKey="cups" label="Cups drunk today" class="mx-auto aspect-[16/8] max-w-lg" />;
  };
});
export default Example;
