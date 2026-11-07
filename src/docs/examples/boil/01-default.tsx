// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Boil } from "@/components/ui/boil";
import { Doodle } from "@/components/ui/doodle";
export const meta = {
  title: "Default" as const,
  description: "Four doodles, six redraws a second. The shapes hold still; the lines shiver. Stops when the tab is hidden, off screen, and with reduced motion." as const,
  layout: "center" as const,
  height: 200
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex items-end gap-6">
      {(["sun", "flower", "star", "mushroom"] as const).map(name => <Boil key={name}>
          <Doodle name={name} size={96} />
        </Boil>)}
    </div>;
  };
});
export default Example;
