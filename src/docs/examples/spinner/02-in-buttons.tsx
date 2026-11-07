// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
export const meta = {
  title: "In buttons and badges" as const,
  description: "A spinner in front of a label is shadcn's pattern. The button is disabled while the request runs and says what is happening; press it to see a save go through." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const phase = shallowRef<"idle" | "saving" | "saved">(initialState("idle"));
  const setPhase = stateSetter(phase);
  const timer = shallowRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  watchDependencies(() => () => clearTimeout(timer.value), () => [], false);
  return () => {
    function save() {
      setPhase("saving");
      timer.value = setTimeout(() => {
        setPhase("saved");
        timer.value = setTimeout(() => setPhase("idle"), 1400);
      }, 1800);
    }
    return <div class="flex flex-col items-start gap-5">
      <div class="flex flex-wrap items-center gap-4">
        <Button onClick={save} disabled={phase.value === "saving"} variant={phase.value === "saved" ? "secondary" as const : "default" as const}>
          {phase.value === "saving" && <Spinner />}
          {phase.value === "idle" ? "Save changes" as const : phase.value === "saving" ? "Saving" as const : "Saved, thanks" as const}
        </Button>
        <Button variant="outline" disabled>
          <Spinner />
          Please wait
        </Button>
        <Button variant="outline" size="icon" disabled aria-label="Refreshing">
          <Spinner />
        </Button>
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <Badge variant="secondary">
          <Spinner class="size-3.5" aria-label="Syncing" />
          Syncing
        </Badge>
        <Badge variant="outline">
          <Spinner class="size-3.5" aria-label="Uploading" />
          Uploading 3 of 7
        </Badge>
      </div>
    </div>;
  };
});
export default Example;
