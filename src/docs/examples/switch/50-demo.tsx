// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
export const meta = {
  title: "Demo" as const,
  description: "Official `switch-demo`: a switch and its label. Flip it and the marker fills the track while the paper coin slides across; the label toggles it too. Only the id is prefixed, so it stays unique on a page with other examples." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex items-center space-x-2">
      <Switch id="switch-demo-airplane-mode" />
      <Label for="switch-demo-airplane-mode">Airplane Mode</Label>
    </div>;
  };
});
export default Example;
