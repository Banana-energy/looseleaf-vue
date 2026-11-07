// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Clipboard, ClipboardPaper } from "@/components/ui/clipboard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "A sign-in sheet" as const,
  description: "A real form on the paper: a name, a visit, a button, and the visitors so far listed as they sign. The paper is a `form` with a label." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 440
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const who = shallowRef<string[]>(initialState(["Ada Lovelace", "Grace Hopper"]));
  const setWho = stateSetter(who);
  const name = shallowRef(initialState(""));
  const setName = stateSetter(name);
  return () => {
    return <Clipboard tone="teal" seed="sign" tilt={-0.8} class="mx-auto">
      <ClipboardPaper as="form" aria-label="Visitors sign-in sheet" seed="sign-p" onSubmit={e => {
        e.preventDefault();
        if (name.value.trim()) setWho(w => [...w, name.value.trim()]);
        setName("");
      }}>
        <h3 class="font-script text-[1.75rem] leading-7 font-bold">Visitors</h3>
        <ol class="list-decimal ps-5 leading-7">
          {who.value.map(w => <li key={w}>{w}</li>)}
        </ol>
        <div class="mt-3 flex items-end gap-2">
          <div class="flex-1 space-y-1">
            <Label for="visitor">Your name</Label>
            <Input id="visitor" value={name.value} onChange={(e: Event) => setName((e.target as HTMLInputElement).value)} placeholder="Sign here" />
          </div>
          <Button type="submit">Sign</Button>
        </div>
      </ClipboardPaper>
    </Clipboard>;
  };
});
export default Example;
