// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
export const meta = {
  title: "Saving, in three states" as const,
  description: "A real save button: pressing it disables it while the request runs, says what is happening, and confirms. The label is text; nothing here needs an icon." as const,
  layout: "stack" as const
};
type Phase = "idle" | "saving" | "saved";
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const phase = shallowRef<Phase>(initialState("idle"));
  const setPhase = stateSetter(phase);
  const timer = shallowRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  watchDependencies(() => () => clearTimeout(timer.value), () => [], false);
  return () => {
    function save() {
      setPhase("saving");
      timer.value = setTimeout(() => {
        setPhase("saved");
        timer.value = setTimeout(() => setPhase("idle"), 1600);
      }, 1400);
    }
    return <div class="flex items-center gap-4">
      <Button onClick={save} disabled={phase.value === "saving"} aria-busy={phase.value === "saving"} variant={phase.value === "saved" ? "secondary" as const : "default" as const}>
        {phase.value === "idle" ? "Save changes" as const : phase.value === "saving" ? "Saving..." as const : "Saved, thanks" as const}
      </Button>
      <Button variant="ghost" disabled={phase.value !== "idle"}>
        Cancel
      </Button>
      <span role="status" class="text-muted-foreground">
        {phase.value === "saving" ? "Writing it down..." as const : phase.value === "saved" ? "All changes kept." as const : "" as const}
      </span>
    </div>;
  };
});
export default Example;
