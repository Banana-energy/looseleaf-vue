// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Annotate } from "@/components/ui/annotate";
import { Button } from "@/components/ui/button";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "An editor's pass" as const,
  description: "Turn the review on and the draft is marked up in sequence: words crossed out, a phrase scribbled, another bracketed. Nothing is removed from the text." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 320
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const review = shallowRef(initialState(false));
  const setReview = stateSetter(review);
  return () => {
    return <div class="grid w-full max-w-lg gap-4">
      <Button class="w-fit" size="sm" variant={review.value ? "default" as const : "outline" as const} aria-pressed={review.value} onClick={() => setReview(r => !r)}>
        {review.value ? "Clear the marks" as const : "Review the draft" as const}
      </Button>
      <Paper stock="paper" tilt class="p-7">
        <p class="text-[17px] leading-[1.9]">
          The garden was{" "}
          <Annotate type="scribble" weight="fine" show={review.value} animate>
            very extremely
          </Annotate>{" "}
          overgrown, and the gate, which had been{" "}
          <Annotate type="crossed-off" show={review.value} animate delay={500}>
            painted green
          </Annotate>{" "}
          left open for years,{" "}
          <Annotate type="brackets" color="blue" show={review.value} animate delay={1000}>
            no longer closed properly at all
          </Annotate>{" "}
          closed.
        </p>
      </Paper>
    </div>;
  };
});
export default Example;
