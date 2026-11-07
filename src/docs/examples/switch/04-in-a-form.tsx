// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
export const meta = {
  title: "In a form" as const,
  description: "With a name (and optional value) a switch submits like a native checkbox: on gives \"on\" or its value, off sends nothing. Controlled here, so the summary follows it." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const digest = shallowRef(initialState(true));
  const setDigest = stateSetter(digest);
  const sent = shallowRef(initialState(""));
  const setSent = stateSetter(sent);
  return () => {
    return <form class="grid w-full max-w-sm gap-4" onSubmit={(e: SubmitEvent) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget as HTMLFormElement);
      setSent(`Saved: digest ${data.get("digest") ?? "off"}, marketing ${data.get("marketing") ?? "off"}`);
    }}>
      <div class="flex items-center justify-between gap-4">
        <Label for="digest">Weekly digest</Label>
        <Switch id="digest" name="digest" value="weekly" checked={digest.value} onCheckedChange={setDigest} />
      </div>
      <div class="flex items-center justify-between gap-4">
        <Label for="marketing">Product news</Label>
        <Switch id="marketing" name="marketing" />
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
