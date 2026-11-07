// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Combobox, ComboboxContent, ComboboxCreate, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxValue } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Create what you typed" as const,
  description: "Type a name that is not in the list and the last row offers to add it. Choosing it calls onCreate (you add it to your list) and then chooses it. An exact match, in any case, hides the offer." as const,
  layout: "center" as const,
  height: 380
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const tags = shallowRef(initialState(["Sourdough", "Focaccia", "Rye", "Brioche"]));
  const setTags = stateSetter(tags);
  const value = shallowRef<string | null>(initialState(null));
  const setValue = stateSetter(value);
  return () => {
    return <div class="grid w-64 gap-2 self-start">
      <Label for="bread">Bread</Label>
      <Combobox items={tags.value} value={value.value} onValueChange={setValue} label="Bread">
        <ComboboxTrigger id="bread" class="w-full">
          <ComboboxValue placeholder="Pick or add a bread..." />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search or add..." />
          <ComboboxList>
            <ComboboxEmpty>No bread yet.</ComboboxEmpty>
            {tags.value.map(t => <ComboboxItem key={t} value={t}>
                {t}
              </ComboboxItem>)}
            <ComboboxCreate onCreate={text => setTags(all => [...all, text])}>{text => `Add "${text}"`}</ComboboxCreate>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>;
  };
});
export default Example;
