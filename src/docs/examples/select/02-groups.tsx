// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
export const meta = {
  title: "Groups and a long list" as const,
  description: "Kicker labels, pencil rules between groups, and scroll arrows when the slip runs out of room. Reka UI's item-aligned placement (the default) lays the chosen row over the field." as const,
  layout: "center" as const,
  height: 420
};
const zones = [["North America", ["Eastern (EST)", "Central (CST)", "Mountain (MST)", "Pacific (PST)", "Alaska (AKST)", "Hawaii (HST)"]], ["Europe & Africa", ["Greenwich Mean (GMT)", "Central European (CET)", "Eastern European (EET)", "West Africa (WAT)", "Central Africa (CAT)", "East Africa (EAT)"]], ["Asia", ["Moscow (MSK)", "India (IST)", "China (CST)", "Japan (JST)", "Korea (KST)"]]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Select defaultValue="Central European (CET)">
      <SelectTrigger class="w-[260px]" aria-label="Time zone">
        <SelectValue placeholder="Select a time zone" />
      </SelectTrigger>
      <SelectContent class="max-h-72">
        {zones.map(([region, items], i) => <SelectGroup key={region}>
            {i > 0 && <SelectSeparator />}
            <SelectLabel>{region}</SelectLabel>
            {items.map(z => <SelectItem key={z} value={z}>
                {z}
              </SelectItem>)}
          </SelectGroup>)}
      </SelectContent>
    </Select>;
  };
});
export default Example;
