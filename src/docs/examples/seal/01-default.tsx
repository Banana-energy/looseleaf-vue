// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Seal } from "@/components/ui/seal";
export const meta = {
  title: "Seals" as const,
  description: "A scalloped seal, a starburst, a rosette with a ribbon hanging from it, a medal, a shield, a plate and a tag: one generator, eight shapes, any stationery color." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-end justify-center gap-6">
      <Seal variant="scallop" text="Best" sub="seller" tone="grass" />
      <Seal variant="starburst" text="New" tone="lemon" />
      <Seal variant="rosette" text="Pick" tone="tangerine" ribbon="sky" />
      <Seal variant="medal" text="Top" tone="lemon" />
      <Seal variant="shield" text="Pro" sub="plan" tone="teal" />
      <Seal variant="plate" text="Gold" tone="lemon" />
      <Seal variant="tag" text="Sale" tone="tangerine" />
    </div>;
  };
});
export default Example;
