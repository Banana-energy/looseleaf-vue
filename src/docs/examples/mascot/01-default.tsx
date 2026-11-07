// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Mascot } from "@/components/ui/mascot";
export const meta = {
  title: "Poses" as const,
  description: "Stubby, an original pencil stub drawn as a die-cut sticker: one bold body with a face and nothing else. A pose is a different face, a lean and a doodle." as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-end gap-8">
      {["idle", "wave", "think", "sleep"].map(pose => <figure key={pose} class="flex flex-col items-center gap-1">
          <Mascot pose={pose} />
          <figcaption class="text-sm text-pencil-text">{pose}</figcaption>
        </figure>)}
    </div>;
  };
});
export default Example;
