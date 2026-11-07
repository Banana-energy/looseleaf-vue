// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
export const meta = {
  title: "In a form" as const,
  description: "`name` on the group puts the chosen value in FormData (Reka UI keeps hidden native radios in sync) and `required` blocks the submit until one is picked." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const sent = shallowRef(initialState(""));
  const setSent = stateSetter(sent);
  return () => {
    return <form class="grid w-full max-w-sm gap-4" onSubmit={(e: SubmitEvent) => {
      e.preventDefault();
      setSent(`Ink of the month: ${new FormData(e.currentTarget as HTMLFormElement).get("ink")}`);
    }}>
      <fieldset class="grid gap-3">
        <legend class="mb-1 text-[15px] font-bold">Ink of the month</legend>
        <RadioGroup name="ink" required aria-label="Ink of the month">
          {["Black", "Blue", "Sepia"].map(v => <div key={v} class="flex items-center gap-3">
              <RadioGroupItem value={v.toLowerCase()} id={`ink-${v}`} />
              <Label for={`ink-${v}`}>{v}</Label>
            </div>)}
        </RadioGroup>
      </fieldset>
      <div class="flex items-center gap-3">
        <Button type="submit">Vote</Button>
        <span role="status" class="text-sm text-ink-muted">
          {sent.value}
        </span>
      </div>
    </form>;
  };
});
export default Example;
