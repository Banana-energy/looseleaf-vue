// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { IndexCard, IndexCardContent, IndexCardFooter, IndexCardHeader, IndexCardTitle } from "@/components/ui/index-card";
export const meta = {
  title: "Flashcards" as const,
  description: "A real use: a pile of flashcards. Press a button to flip the top card between the question and the answer; the pile behind it shows how many are left." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const cards = [{
  q: "petrichor" as const,
  a: "the smell of rain on dry earth" as const
}, {
  q: "sonder" as const,
  a: "the realisation that everyone has a life as vivid as yours" as const
}, {
  q: "komorebi" as const,
  a: "sunlight filtering through leaves" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const i = shallowRef(initialState(0));
  const setI = stateSetter(i);
  const shown = shallowRef(initialState(false));
  const setShown = stateSetter(shown);
  const left = computed(() => cards.length - i.value - 1);
  return () => {
    return <div class="mx-auto flex max-w-md flex-col items-center gap-8">
      <IndexCard hole flag={shown.value ? "grass" as const : false} stack={Math.min(3, left.value) as 0 | 1 | 2 | 3} seed={`card-${i.value}`} aria-live="polite" class="min-h-[254px]">
        <IndexCardHeader>
          <IndexCardTitle>{cards[i.value].q}</IndexCardTitle>
        </IndexCardHeader>
        <IndexCardContent>{shown.value ? cards[i.value].a : <span class="text-muted-foreground">what does it mean?</span>}</IndexCardContent>
        <IndexCardFooter>
          <span class="ll-num">
            {i.value + 1} of {cards.length}
          </span>
        </IndexCardFooter>
      </IndexCard>
      <div class="flex gap-3">
        <Button variant="secondary" onClick={() => setShown(s => !s)}>
          {shown.value ? "Hide" as const : "Show the answer" as const}
        </Button>
        <Button disabled={i.value === cards.length - 1} onClick={() => {
          setI(n => n + 1);
          setShown(false);
        }}>
          Next card
        </Button>
      </div>
    </div>;
  };
});
export default Example;
