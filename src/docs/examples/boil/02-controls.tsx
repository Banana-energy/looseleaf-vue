// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Boil } from "@/components/ui/boil";
import { Button } from "@/components/ui/button";
import { Doodle } from "@/components/ui/doodle";
import { Input } from "@/components/ui/input";
export const meta = {
  title: "Calm, normal, restless" as const,
  description: "fps and strength tune the shiver. Drawn controls inside a Boil feel it too (through the ink knobs), so a call to action can be alive without any doodle." as const,
  layout: "stack" as const,
  height: 240
};
const MODES = {
  calm: {
    fps: 3,
    strength: 0.6
  },
  normal: {
    fps: 6,
    strength: 1
  },
  restless: {
    fps: 12,
    strength: 2.2
  }
} as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const mode = shallowRef<keyof typeof MODES>(initialState("normal"));
  const setMode = stateSetter(mode);
  return () => {
    return <div class="flex w-full max-w-xl flex-col gap-5">
      <Boil {...domProps(MODES[mode.value])} class="self-start">
        <div class="flex items-center gap-4">
          <Doodle name="mushroom" size={72} />
          <Button size="lg">Join the club</Button>
          <Input aria-label="Email" placeholder="you@example.com" class="w-48" />
        </div>
      </Boil>
      <div class="flex items-center gap-4" role="group" aria-label="How nervous">
        {(Object.keys(MODES) as Array<keyof typeof MODES>).map(m => <Button key={m} size="sm" variant={m === mode.value ? "secondary" as const : "outline" as const} aria-pressed={m === mode.value} onClick={() => setMode(m)}>
            {m}
          </Button>)}
      </div>
    </div>;
  };
});
export default Example;
