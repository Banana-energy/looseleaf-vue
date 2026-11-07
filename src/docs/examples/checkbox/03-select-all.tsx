// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Select all" as const,
  description: "A parent box that shows the dash when only some children are ticked, and a Field-like row whose hover lights the box." as const,
  layout: "stack" as const
};
const items = ["Pencils", "Highlighters", "Washi tape", "Index cards"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const picked = shallowRef<string[]>(initialState(["Pencils"]));
  const setPicked = stateSetter(picked);
  const all = computed(() => picked.value.length === items.length ? true : picked.value.length === 0 ? false : "indeterminate" as const);
  return () => {
    return <div class="grid gap-3">
      <div class="group/field flex items-center gap-2">
        <Checkbox id="all" checked={all.value} onCheckedChange={v => setPicked(v === true ? items : [])} />
        <Label for="all">Everything on the desk</Label>
      </div>
      <div class="grid gap-3 ps-7">
        {items.map(item => <div key={item} class="group/field flex items-center gap-2">
            <Checkbox id={item} checked={picked.value.includes(item)} onCheckedChange={v => setPicked(p => v === true ? [...p, item] : p.filter(x => x !== item))} />
            <Label for={item}>{item}</Label>
          </div>)}
      </div>
    </div>;
  };
});
export default Example;
