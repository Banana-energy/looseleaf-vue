// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
export const meta = {
  title: "Settings list" as const,
  description: "The usual settings page: a title and a line of help on the left, the switch at the end. Hovering anywhere on a row lights its switch (the row is a `group/field`)." as const,
  layout: "stack" as const
};
const settings = [["ruled", "Show ruled lines", "Blue pencil rules behind everything you write.", true], ["hints", "Highlighter hints", "Underline what changed since you last looked.", true], ["sound", "Pencil scratch sound", "A soft scratch while you type. Off is quieter.", false], ["sync", "Sync to the cloud", "Locked by your administrator.", true, true]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="w-full max-w-md divide-y divide-rule-blue/60">
      {settings.map(([id, title, help, on, locked]) => <div key={id} class="group/field flex items-start justify-between gap-6 py-3.5 first:pt-0">
          <div class="grid gap-1">
            <Label for={id}>{title}</Label>
            <p class="text-sm text-ink-muted">{help}</p>
          </div>
          <Switch id={id} defaultChecked={on} disabled={locked} class="mt-0.5" />
        </div>)}
    </div>;
  };
});
export default Example;
