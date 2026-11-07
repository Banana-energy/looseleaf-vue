// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { icons } from "@/lib/ink/art/icons";
export const meta = {
  title: "Every icon drawn so far" as const,
  description: "The gallery grows by itself as icon batches land. Names are the lucide ids; hover-free, so it doubles as a search list." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const names = computed(() => Object.keys(icons));
  return () => {
    return <ul class="grid w-full grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-3 text-ink">
      {names.value.map(name => <li key={name} class="flex flex-col items-center gap-1 py-2">
          <Icon name={name} size={24} />
          <span class="text-sm text-pencil-text">{name}</span>
        </li>)}
    </ul>;
  };
});
export default Example;
