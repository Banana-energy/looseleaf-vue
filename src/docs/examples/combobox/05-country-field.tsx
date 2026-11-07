// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "An editable field in a form" as const,
  description: "ComboboxInput on its own is the field: it shows the chosen country until you type, opens as you type, and puts the country back if you close without choosing. The hidden input (name) submits the code." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 580
};
const COUNTRIES = [{
  value: "ar" as const,
  label: "Argentina" as const
}, {
  value: "au" as const,
  label: "Australia" as const
}, {
  value: "br" as const,
  label: "Brazil" as const
}, {
  value: "ca" as const,
  label: "Canada" as const
}, {
  value: "fr" as const,
  label: "France" as const
}, {
  value: "de" as const,
  label: "Germany" as const
}, {
  value: "jp" as const,
  label: "Japan" as const
}, {
  value: "nz" as const,
  label: "New Zealand" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const sent = shallowRef<string | null>(initialState(null));
  const setSent = stateSetter(sent);
  return () => {
    return <Card seed="ship" tape="top" class="w-full max-w-sm">
      <form onSubmit={(e: SubmitEvent) => {
        e.preventDefault();
        setSent(String(new FormData(e.currentTarget as HTMLFormElement).get("country") || "nothing"));
      }}>
        <CardHeader>
          <CardTitle>Shipping</CardTitle>
          <CardDescription>Where should it go?</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-2 py-4">
          <Label for="country">Country</Label>
          <Combobox items={COUNTRIES} name="country" defaultValue="nz" label="Country" required>
            <ComboboxInput id="country" placeholder="Start typing a country..." showClear />
            <ComboboxContent>
              <ComboboxList>
                <ComboboxEmpty>No such country.</ComboboxEmpty>
                {COUNTRIES.map(c => <ComboboxItem key={c.value} value={c.value} label={c.label}>
                    {c.label}
                  </ComboboxItem>)}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </CardContent>
        <CardFooter class="justify-between gap-3 border-t">
          <p class="font-hand text-sm text-ink-muted" aria-live="polite">
            {sent.value ? `Sent country code: ${sent.value}` : "Nothing sent yet." as const}
          </p>
          <Button type="submit">Ship</Button>
        </CardFooter>
      </form>
    </Card>;
  };
});
export default Example;
