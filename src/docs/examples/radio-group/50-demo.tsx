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
  title: "Demo" as const,
  description: "Official `radio-group-demo`: three options, the middle one chosen. Click, or focus the group and use the arrow keys; the chosen ring gets its dot written in. Only change: the ids are prefixed to stay unique on a page with other examples." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <RadioGroup defaultValue="comfortable">
      <div class="flex items-center gap-3">
        <RadioGroupItem value="default" id="radio-group-demo-1" />
        <Label for="radio-group-demo-1">Default</Label>
      </div>
      <div class="flex items-center gap-3">
        <RadioGroupItem value="comfortable" id="radio-group-demo-2" />
        <Label for="radio-group-demo-2">Comfortable</Label>
      </div>
      <div class="flex items-center gap-3">
        <RadioGroupItem value="compact" id="radio-group-demo-3" />
        <Label for="radio-group-demo-3">Compact</Label>
      </div>
    </RadioGroup>;
  };
});
export default Example;
