// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export const meta = {
  title: "In a form" as const,
  description: "A controlled select and a native-form select in one form: `name` puts the chosen value in FormData (Reka UI keeps a hidden native select in sync), `required` blocks the submit." as const,
  layout: "stack" as const,
  height: 340
};
const roles = ["Author", "Editor", "Proofreader", "Illustrator"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const role = shallowRef(initialState("Editor"));
  const setRole = stateSetter(role);
  const sent = shallowRef(initialState(""));
  const setSent = stateSetter(sent);
  return () => {
    return <form class="grid w-full max-w-sm gap-4" onSubmit={(e: SubmitEvent) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget as HTMLFormElement);
      setSent(`Filed: ${data.get("role")} on the ${data.get("shift") ?? "no"} shift`);
    }}>
      <div class="grid gap-2">
        <Label for="role">Your role</Label>
        <Select name="role" value={role.value} onValueChange={setRole}>
          <SelectTrigger id="role" class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {roles.map(r => <SelectItem key={r} value={r}>
                {r}
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div class="grid gap-2">
        <Label for="shift" required>
          Shift
        </Label>
        <Select name="shift" required>
          <SelectTrigger id="shift" class="w-full">
            <SelectValue placeholder="Morning, evening or night" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="evening">Evening</SelectItem>
            <SelectItem value="night">Night</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex items-center gap-3">
        <Button type="submit">File it</Button>
        <span role="status" class="text-sm text-ink-muted">
          {sent.value}
        </span>
      </div>
    </form>;
  };
});
export default Example;
