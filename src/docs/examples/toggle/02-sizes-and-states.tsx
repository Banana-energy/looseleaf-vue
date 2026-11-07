// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { Toggle } from "@/components/ui/toggle";
export const meta = {
  title: "Sizes, tones and disabled" as const,
  description: "Three heights, the terracotta marker for a louder switch, and disabled toggles: a dashed pencil box, and a pale wash if it is on." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-col gap-5">
      <div class="flex flex-wrap items-center gap-4">
        <Toggle variant="outline" size="sm" defaultPressed aria-label="List, small">
          <Icon name="list" />
        </Toggle>
        <Toggle variant="outline" defaultPressed aria-label="List">
          <Icon name="list" />
        </Toggle>
        <Toggle variant="outline" size="lg" defaultPressed aria-label="List, large">
          <Icon name="list" />
        </Toggle>
        <Toggle variant="outline" size="lg" tone="marker" defaultPressed>
          <Icon name="pencil" />
          Draw
        </Toggle>
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <Toggle disabled>
          <Icon name="eye-off" />
          Hidden
        </Toggle>
        <Toggle disabled defaultPressed>
          <Icon name="eye-off" />
          Hidden
        </Toggle>
        <Toggle variant="outline" disabled>
          Locked
        </Toggle>
        <Toggle variant="outline" disabled defaultPressed>
          Locked
        </Toggle>
      </div>
    </div>;
  };
});
export default Example;
