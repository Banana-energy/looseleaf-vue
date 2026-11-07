// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Ribbon } from "@/components/ui/ribbon";
export const meta = {
  title: "Variants and colors" as const,
  description: "Banner (folded tails), swallow (a V notch at both ends) and flag (square at the start). The colors are the ones ink stays readable on; `paper` is a plain white ribbon." as const,
  layout: "center" as const
};
const TONES = ["marker", "hi", "tangerine", "lemon", "grass", "teal", "sky", "bubblegum", "paper"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex max-w-xl flex-col items-center gap-5">
      <div class="flex flex-wrap items-center justify-center gap-4">
        <Ribbon variant="banner">Banner</Ribbon>
        <Ribbon variant="swallow" tone="lemon">
          Swallow
        </Ribbon>
        <Ribbon variant="flag" tone="tangerine">
          Flag
        </Ribbon>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-3">
        {TONES.map(tone => <Ribbon key={tone} tone={tone} size="sm">
            {tone}
          </Ribbon>)}
      </div>
    </div>;
  };
});
export default Example;
