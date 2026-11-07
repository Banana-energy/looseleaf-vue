// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Strike } from "@/components/ui/strike";
export const meta = {
  title: "A to-do list" as const,
  description: "Tick a box and the task is struck through in red pencil, drawn on as you tick it." as const,
  layout: "stack" as const
};
const TASKS = ["Buy oat milk", "Book the train", "Reply to Sam", "Water the ferns"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const done = shallowRef<string[]>(initialState(["Buy oat milk"]));
  const setDone = stateSetter(done);
  return () => {
    return <div class="grid w-full max-w-xs gap-3">
      {TASKS.map(t => <div key={t} class="flex items-center gap-2.5">
          <Checkbox id={t} checked={done.value.includes(t)} onCheckedChange={c => setDone(d => c ? [...d, t] : d.filter(x => x !== t))} />
          <Label for={t} class="text-base font-normal">
            <Strike asChild animate show={done.value.includes(t)}>
              <span class={done.value.includes(t) ? "text-muted-foreground" as const : undefined}>{t}</span>
            </Strike>
          </Label>
        </div>)}
    </div>;
  };
});
export default Example;
