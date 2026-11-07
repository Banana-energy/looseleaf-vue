// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Doodle } from "@/components/ui/doodle";
import { doodles } from "@/lib/ink/art/doodles";
export const meta = {
  title: "Every doodle drawn so far" as const,
  description: "Grows by itself as the doodle batches land." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <ul class="grid w-full grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-4">
      {Object.keys(doodles).map(name => <li key={name} class="flex flex-col items-center gap-1">
          <Doodle name={name} size={72} />
          <span class="text-sm text-pencil-text">{name}</span>
        </li>)}
    </ul>;
  };
});
export default Example;
