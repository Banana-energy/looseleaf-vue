// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { FlipCard, FlipCardBack, FlipCardFront } from "@/components/ui/flip-card";
export const meta = {
  title: "Vocabulary deck" as const,
  description: "A real use: a controlled flip card as a study deck. Turning is the answer; Next shows the front of the following card." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 340
};
const DECK = [["la maison", "the house"], ["le chat", "the cat"], ["l'encre", "the ink"], ["le crayon", "the pencil"]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const i = shallowRef(initialState(0));
  const setI = stateSetter(i);
  const flipped = shallowRef(initialState(false));
  const setFlipped = stateSetter(flipped);
  const go = computed(() => (d: number) => {
    setFlipped(false);
    setI((i.value + d + DECK.length) % DECK.length);
  });
  const word = computed(() => DECK[i.value][0]);
  const meaning = computed(() => DECK[i.value][1]);
  return () => {
    return <div class="flex flex-col items-center gap-4">
      <FlipCard flipped={flipped.value} onFlippedChange={setFlipped} label={flipped.value ? "Show the word" as const : "Show the answer" as const}>
        <FlipCardFront>
          <span class="relative -top-[9px] text-4xl">{word.value}</span>
        </FlipCardFront>
        <FlipCardBack>
          <span class="text-4xl">{meaning.value}</span>
        </FlipCardBack>
      </FlipCard>
      <div class="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => go.value(-1)}>
          Back
        </Button>
        <span class="font-hand text-sm tabular-nums">
          {i.value + 1} of {DECK.length}
        </span>
        <Button size="sm" onClick={() => go.value(1)}>
          Next
        </Button>
      </div>
    </div>;
  };
});
export default Example;
