// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
export const meta = {
  title: "Default" as const,
  description: "Pick one. The choice is circled, then colored in: a terracotta blot with a felt spiral written into it. Arrow keys move the choice." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <RadioGroup defaultValue="comfortable" aria-label="Density">
      {[["default", "Default"], ["comfortable", "Comfortable"], ["compact", "Compact"]].map(([value, label]) => <div key={value} class="flex items-center gap-3">
          <RadioGroupItem value={value} id={`density-${value}`} />
          <Label for={`density-${value}`}>{label}</Label>
        </div>)}
    </RadioGroup>;
  };
});
export default Example;
