// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Redrawn, not scaled" as const,
  description: "Each size is its own drawing: 12 px is one confident stroke, 16 px is heavier and simpler than 24, 48 px gets its extras." as const
};
const SIZES = [12, 16, 20, 24, 32, 48];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-col gap-5 text-ink">
      {["check", "search", "triangle-alert", "settings"].map(name => <div key={name} class="flex items-end gap-6">
          {SIZES.map(size => <figure key={size} class="flex flex-col items-center gap-1">
              <Icon name={name} size={size} />
              <figcaption class="text-sm text-pencil-text">{size}</figcaption>
            </figure>)}
        </div>)}
    </div>;
  };
});
export default Example;
