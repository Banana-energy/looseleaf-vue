// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "A hint on a form" as const,
  description: "Positioned with className over a form: a hint that points at the field it is about, that writes itself on when the form scrolls into view and goes away when you dismiss it." as const,
  layout: "center" as const,
  height: 320
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const hint = shallowRef(initialState(true));
  const setHint = stateSetter(hint);
  return () => {
    return <form class="grid w-full max-w-xs gap-4" onSubmit={(e: SubmitEvent) => e.preventDefault()}>
      <div class="relative grid gap-2 pb-12">
        <Label for="callout-email">Email</Label>
        <Input id="callout-email" type="email" placeholder="you@example.com" onFocus={() => setHint(false)} />
        <Callout show={hint.value} animate direction="up-right" curve="curved" class="pointer-events-none absolute start-8 bottom-0">
          start with this one
        </Callout>
      </div>
      <Button type="submit">Send the link</Button>
    </form>;
  };
});
export default Example;
