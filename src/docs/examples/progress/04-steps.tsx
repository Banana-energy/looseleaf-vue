// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
export const meta = {
  title: "Steps" as const,
  description: "`max` sets the scale, so value and max can be a step and a step count. The label is the only text; the bar has the same value in aria-valuenow and aria-valuemax." as const,
  layout: "stack" as const
};
const steps = ["Name your notebook", "Pick a cover", "Add a first page", "Invite someone", "Done"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const step = shallowRef(initialState(2));
  const setStep = stateSetter(step);
  return () => {
    return <div class="grid w-full max-w-sm gap-4">
      <div class="flex items-baseline justify-between">
        <span class="font-script text-2xl leading-none">{steps[step.value - 1]}</span>
        <span class="ll-num text-sm text-ink-muted">
          Step {step.value} of {steps.length}
        </span>
      </div>
      <Progress value={step.value} max={steps.length} aria-label="Setup progress" aria-valuetext={`Step ${step.value} of ${steps.length}`} />
      <div class="flex gap-3">
        <Button size="sm" variant="outline" onClick={() => setStep(s => Math.max(1, s - 1))}>
          Back
        </Button>
        <Button size="sm" onClick={() => setStep(s => Math.min(steps.length, s + 1))}>
          Next
        </Button>
      </div>
    </div>;
  };
});
export default Example;
