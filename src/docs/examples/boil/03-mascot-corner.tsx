// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Boil, useBoilFrame } from "@/components/ui/boil";
import { Mascot } from "@/components/ui/mascot";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "A live corner" as const,
  description: "A real use: the mascot in a card's corner and the underline of its heading boil, the text does not. Your own drawings join in with useBoilFrame or useBoilSeed." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 280
};
const Underline = defineUi<{}>("Underline", [], (_props, {
  slots: _slots
}) => {
  const _nestedHook0 = useBoilFrame();
  const wobble = computed(() => [0, 2, 1, 3][_nestedHook0.value]);
  return () => {
    return <svg aria-hidden="true" viewBox="0 0 200 10" class="mt-1 h-2.5 w-48 text-ink-you">
      <path d={`M2 6 Q 50 ${2 + wobble.value * 2} 100 5 T 198 ${4 + wobble.value}`} fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
    </svg>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="card" class="relative w-80 p-6" tilt={false}>
      <div class="absolute -end-4 -top-8">
        <Boil>
          <Mascot pose="wave" size={88} />
        </Boil>
      </div>
      <p class="font-script text-3xl leading-none">Welcome back</p>
      <Boil>
        <Underline />
      </Boil>
      <p class="mt-3 text-sm text-muted-foreground">The text holds still. Only the pencil is nervous.</p>
    </Paper>;
  };
});
export default Example;
