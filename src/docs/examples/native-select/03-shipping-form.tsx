// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
export const meta = {
  title: "Shipping form" as const,
  description: "A real-world use: a native select next to inputs in a form. It submits and resets like any select, `required` stops an empty submit, and the second select follows the first." as const,
  layout: "stack" as const
};
const regions: Record<string, string[]> = {
  is: ["Reykjavik", "Akureyri"],
  pt: ["Lisbon", "Porto", "Faro"],
  ca: ["Ontario", "Quebec", "Alberta"]
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const country = shallowRef(initialState(""));
  const setCountry = stateSetter(country);
  const sent = shallowRef(initialState(""));
  const setSent = stateSetter(sent);
  return () => {
    return <form class="grid w-full max-w-md gap-4" onSubmit={(e: SubmitEvent) => {
      e.preventDefault();
      const d = new FormData(e.currentTarget as HTMLFormElement);
      setSent(`Ships to ${d.get("region")}, ${d.get("country")}`);
    }}>
      <div class="grid gap-2">
        <Label for="ship-name">Name</Label>
        <Input id="ship-name" name="name" placeholder="Ada Lovelace" />
      </div>
      <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <div class="grid gap-2">
          <Label for="ship-country" required>
            Country
          </Label>
          <NativeSelect id="ship-country" name="country" required class="w-full" value={country.value} onChange={e => setCountry(e.target.value)}>
            <NativeSelectOption value="">Choose…</NativeSelectOption>
            <NativeSelectOption value="is">Iceland</NativeSelectOption>
            <NativeSelectOption value="pt">Portugal</NativeSelectOption>
            <NativeSelectOption value="ca">Canada</NativeSelectOption>
          </NativeSelect>
        </div>
        <div class="grid gap-2">
          <Label for="ship-region">Region</Label>
          <NativeSelect id="ship-region" name="region" class="w-full" disabled={!country.value}>
            {(regions[country.value] ?? ["Choose a country first"]).map(r => <NativeSelectOption key={r} value={r}>
                {r}
              </NativeSelectOption>)}
          </NativeSelect>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <Button type="submit">Ship it</Button>
        <span role="status" class="text-sm text-ink-muted">
          {sent.value}
        </span>
      </div>
    </form>;
  };
});
export default Example;
