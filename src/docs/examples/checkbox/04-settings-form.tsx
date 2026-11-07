// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "In a form" as const,
  description: "Boxes with a name and value submit like native checkboxes; required blocks the submit until the box is ticked." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const sent = shallowRef<string>(initialState(""));
  const setSent = stateSetter(sent);
  return () => {
    return <form class="grid max-w-sm gap-4" onSubmit={(e: SubmitEvent) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget as HTMLFormElement);
      setSent(`Saved: ${data.getAll("notify").join(", ") || "nothing"}`);
    }}>
      <fieldset class="grid gap-3">
        <legend class="mb-2 font-bold">Tell me about</legend>
        {["comments", "replies", "mentions"].map(n => <div key={n} class="flex items-center gap-2">
            <Checkbox id={n} name="notify" value={n} defaultChecked={n !== "mentions"} />
            <Label for={n} class="capitalize">
              {n}
            </Label>
          </div>)}
      </fieldset>
      <div class="flex items-center gap-2">
        <Checkbox id="agree" name="agree" required />
        <Label for="agree" required>
          I have read the small print
        </Label>
      </div>
      <div class="flex items-center gap-3">
        <Button type="submit">Save</Button>
        <span role="status" class="text-sm text-ink-muted">
          {sent.value}
        </span>
      </div>
    </form>;
  };
});
export default Example;
