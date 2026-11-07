// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Confetti } from "@/components/ui/confetti";
import { Label } from "@/components/ui/label";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "Finishing the list" as const,
  description: "A real use: confetti stays inside the card and goes off when the last task is ticked. Untick one and tick it again for another go." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 330
};
const TASKS = ["Write the docs", "Draw the icons", "Tell someone"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const done = shallowRef<boolean[]>(initialState([true, true, false]));
  const setDone = stateSetter(done);
  const all = computed(() => done.value.every(Boolean));
  return () => {
    return <Paper stock="card" class="relative w-72 p-5" tilt={false}>
      <Confetti active={all.value} spread={90} count={60} />
      <p class="font-script text-2xl">Launch day</p>
      <ul class="mt-3 flex flex-col gap-3">
        {TASKS.map((t, i) => <li key={t} class="flex items-center gap-2">
            <Checkbox id={`task-${i}`} checked={done.value[i]} onCheckedChange={c => setDone(done.value.map((d, j) => j === i ? c === true : d))} />
            <Label for={`task-${i}`}>{t}</Label>
          </li>)}
      </ul>
      <p role="status" class="mt-4 min-h-6 font-script text-xl text-ink-you">
        {all.value ? "All done. Go outside." as const : `${done.value.filter(Boolean).length} of ${TASKS.length} done`}
      </p>
    </Paper>;
  };
});
export default Example;
