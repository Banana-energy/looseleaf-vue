// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Rating } from "@/components/ui/rating";
export const meta = {
  title: "Glyphs, halves and sizes" as const,
  description: "Stars, hearts and suns; `allowHalf` steps by 0.5 (two radios per glyph, one over each half); `max` sets how many; three sizes." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-5">
      <div class="flex flex-wrap items-center gap-x-8 gap-y-3">
        <Rating icon="star" defaultValue={3.5} allowHalf aria-label="Stars, halves allowed" />
        <Rating icon="heart" defaultValue={4} aria-label="Hearts" />
        <Rating icon="sun" defaultValue={2} aria-label="Suns" />
      </div>
      <div class="flex flex-wrap items-center gap-x-8 gap-y-3">
        <Rating size="sm" defaultValue={4} aria-label="Small" />
        <Rating size="lg" defaultValue={4} aria-label="Large" />
        <Rating max={10} defaultValue={7} size="sm" aria-label="Out of ten" />
      </div>
      <div class="flex flex-wrap items-center gap-x-8 gap-y-3">
        <Rating defaultValue={3} clearable aria-label="Clearable: click the chosen glyph again" />
        <Rating defaultValue={3} disabled aria-label="Disabled" />
      </div>
    </div>;
  };
});
export default Example;
