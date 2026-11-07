// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export const meta = {
  title: "Sizes and states" as const,
  description: "Default and sm, invalid (red pencil box, a bang before the chevron), disabled (dashed, pale) and a disabled row inside the list." as const,
  layout: "stack" as const,
  height: 420
};
const Pens = defineUi<UI.ComponentProps<typeof SelectTrigger> & {
  placeholder?: string;
}>("Pens", ["placeholder"], (_props, {
  slots: _slots
}) => {
  const placeholder = computed(() => _props["placeholder"] === undefined ? "Pick a pen" as const : _props["placeholder"]);
  const props = computed(() => omitProps(_props, ["placeholder"]));
  return () => {
    return <Select defaultValue={props.value.disabled ? "felt" as const : undefined}>
      <SelectTrigger class="w-[190px]" {...domProps(props.value)}>
        <SelectValue placeholder={placeholder.value} />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectItem value="felt">Felt tip</SelectItem>
        <SelectItem value="pencil">Pencil</SelectItem>
        <SelectItem value="marker">Marker</SelectItem>
        <SelectItem value="quill" disabled>
          Quill (out of ink)
        </SelectItem>
      </SelectContent>
    </Select>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid grid-cols-2 items-start gap-x-8 gap-y-5 max-sm:grid-cols-1">
      <div class="grid gap-2">
        <Label>Default</Label>
        <Pens aria-label="Default" />
      </div>
      <div class="grid gap-2">
        <Label>Small</Label>
        <Pens size="sm" aria-label="Small" />
      </div>
      <div class="grid gap-2">
        <Label>Invalid</Label>
        <Pens aria-invalid aria-label="Invalid" />
        <p class="text-sm text-red">Choose a pen to continue.</p>
      </div>
      <div class="grid gap-2">
        <Label>Disabled</Label>
        <Pens disabled aria-label="Disabled" />
      </div>
    </div>;
  };
});
export default Example;
