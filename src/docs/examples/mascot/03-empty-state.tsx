// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Mascot } from "@/components/ui/mascot";
export const meta = {
  title: "An empty state" as const,
  description: "Where Stubby earns his keep: an empty search, a quiet inbox. The words carry the meaning, so he stays decorative." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex w-full max-w-md items-center gap-5 text-ink">
      <Mascot pose="think" size={96} />
      <div>
        <h3 class="font-script text-2xl">No results for &ldquo;pencil case&rdquo;</h3>
        <p class="mt-1 text-pencil-text">Try a shorter word, or check the spelling. Stubby is thinking about it.</p>
      </div>
    </div>;
  };
});
export default Example;
