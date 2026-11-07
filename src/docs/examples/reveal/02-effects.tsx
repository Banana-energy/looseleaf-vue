// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
import { Reveal, type RevealEffect } from "@/components/ui/reveal";
export const meta = {
  title: "Five arrivals" as const,
  description: "wipe, soak, drop, pop and toss, each one of the theme's keyframes. They play when they are on screen; scroll away and back with once turned off." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const EFFECTS: RevealEffect[] = ["wipe", "soak", "drop", "pop", "toss"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap gap-4">
      {EFFECTS.map((effect, i) => <Reveal key={effect} effect={effect} once={false} delay={i * 0.08}>
          <Paper stock={i % 2 ? "sticky-yellow" as const : "index-card" as const} class="w-32 p-4 text-center font-script text-2xl" tilt={i % 2 ? 2 : -2}>
            {effect}
          </Paper>
        </Reveal>)}
    </div>;
  };
});
export default Example;
