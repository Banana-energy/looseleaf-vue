// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select";
export const meta = {
  title: "Groups, sizes and states" as const,
  description: "Option groups, a small size, an invalid select (red pencil box and a bang before the chevron) and a disabled one (dashed, pale)." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-md grid-cols-2 gap-x-6 gap-y-5 max-sm:grid-cols-1">
      <div class="grid gap-2">
        <Label for="ns-pen">With groups</Label>
        <NativeSelect id="ns-pen" defaultValue="felt">
          <NativeSelectOptGroup label="Pens">
            <NativeSelectOption value="felt">Felt tip</NativeSelectOption>
            <NativeSelectOption value="gel">Gel</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Pencils">
            <NativeSelectOption value="hb">HB</NativeSelectOption>
            <NativeSelectOption value="2b">2B</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      </div>
      <div class="grid gap-2">
        <Label for="ns-small">Small</Label>
        <NativeSelect id="ns-small" size="sm" defaultValue="a">
          <NativeSelectOption value="a">A5, ruled</NativeSelectOption>
          <NativeSelectOption value="b">A4, ruled</NativeSelectOption>
        </NativeSelect>
      </div>
      <div class="grid gap-2">
        <Label for="ns-bad">Invalid</Label>
        <NativeSelect id="ns-bad" aria-invalid defaultValue="" aria-describedby="ns-bad-msg">
          <NativeSelectOption value="">Pick one</NativeSelectOption>
          <NativeSelectOption value="x">Something</NativeSelectOption>
        </NativeSelect>
        <p id="ns-bad-msg" class="text-sm text-red">
          This one is required.
        </p>
      </div>
      <div class="grid gap-2">
        <Label for="ns-off">Disabled</Label>
        <NativeSelect id="ns-off" disabled defaultValue="a">
          <NativeSelectOption value="a">Locked</NativeSelectOption>
        </NativeSelect>
      </div>
    </div>;
  };
});
export default Example;
