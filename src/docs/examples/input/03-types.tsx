// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Types" as const,
  description: "Password, number, search, date and file. The number spinners and the search clear button are removed; the file button is a highlighter swatch." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-sm gap-4">
      <div class="grid gap-2">
        <Label for="pw">Password</Label>
        <Input id="pw" type="password" defaultValue="hunter2hunter2" />
      </div>
      <div class="grid gap-2">
        <Label for="qty">Quantity</Label>
        <Input id="qty" type="number" min={0} defaultValue={3} class="w-24" />
      </div>
      <div class="grid gap-2">
        <Label for="when">Due</Label>
        <Input id="when" type="date" class="w-44" />
      </div>
      <div class="grid gap-2">
        <Label for="pic">Picture</Label>
        <Input id="pic" type="file" />
      </div>
    </div>;
  };
});
export default Example;
