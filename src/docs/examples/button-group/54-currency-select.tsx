// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export const meta = {
  title: "A select, a field and a send button" as const,
  description: "A Select trigger, an Input and a Button share seams like any other children, in two groups side by side. The trigger shows only the symbol; the list beneath explains each one. Try changing the currency and sending." as const,
  layout: "stack" as const,
  height: 340
};
const CURRENCIES = [{
  value: "$" as const,
  label: "US Dollar" as const
}, {
  value: "€" as const,
  label: "Euro" as const
}, {
  value: "£" as const,
  label: "British Pound" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const currency = shallowRef(initialState("$"));
  const setCurrency = stateSetter(currency);
  const amount = shallowRef(initialState("10.00"));
  const setAmount = stateSetter(amount);
  const sent = shallowRef(initialState(""));
  const setSent = stateSetter(sent);
  return () => {
    return <div class="grid justify-items-start gap-4">
      <ButtonGroup aria-label="Send money">
        <ButtonGroup>
          <Select value={currency.value} onValueChange={setCurrency}>
            <SelectTrigger class="font-mono" aria-label="Currency">
              <SelectValue>{currency.value}</SelectValue>
            </SelectTrigger>
            <SelectContent class="min-w-40">
              {CURRENCIES.map(c => <SelectItem key={c.value} value={c.value}>
                  {c.value} <span class="text-muted-foreground">{c.label}</span>
                </SelectItem>)}
            </SelectContent>
          </Select>
          <Input placeholder="10.00" inputmode="decimal" pattern="[0-9.]*" aria-label="Amount" value={amount.value} onChange={(e: Event) => setAmount((e.target as HTMLInputElement).value)} />
        </ButtonGroup>
        <ButtonGroup>
          <Button aria-label="Send" size="icon" variant="outline" onClick={() => setSent(`Sent ${currency.value}${amount.value || "0"}`)}>
            <Icon name="arrow-right" />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
      <p role="status" class="min-h-6 text-sm text-muted-foreground">
        {sent.value}
      </p>
    </div>;
  };
});
export default Example;
