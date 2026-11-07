// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Combobox, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Labels as hang-tags" as const,
  description: "A multi-select whose choices are tags on a string: each a little different, a punched hole at the point, the x wearing the highlighter when you reach for it. Click anywhere in the field to type; Backspace in the empty input takes the last tag back. tone=\"auto\" gives each label its own color." as const,
  layout: "center" as const,
  height: 440
};
const LABELS = ["Design", "Garden", "Travel", "Recipes", "Field notes", "Ideas", "Reading", "Music"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const value = shallowRef<string[]>(initialState(["Design", "Garden", "Travel"]));
  const setValue = stateSetter(value);
  return () => {
    return <div class="grid w-96 gap-2 self-start">
      <Label for="labels">Labels</Label>
      <Combobox multiple items={LABELS} value={value.value} onValueChange={setValue} label="Labels">
        <ComboboxChips tone="auto">
          <ComboboxChipsInput id="labels" placeholder={value.value.length ? "" as const : "Add a label..." as const} />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxList>
            <ComboboxEmpty>No label like that.</ComboboxEmpty>
            {LABELS.map(l => <ComboboxItem key={l} value={l}>
                {l}
              </ComboboxItem>)}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>;
  };
});
export default Example;
