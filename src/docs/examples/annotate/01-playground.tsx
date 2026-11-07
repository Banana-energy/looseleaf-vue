// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Annotate } from "@/components/ui/annotate";
import { Asterisk } from "@/components/ui/asterisk";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Paper } from "@/components/ui/paper";
import { Tally } from "@/components/ui/tally";
export const meta = {
  title: "Playground: a reader's page" as const,
  description: "One paragraph annotated the way a reader does it: a circle, two highlighters, a red underline, a struck phrase, a wavy line and margin notes with arrows. Switch each on and off, or replay the whole page being marked up." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 470
};
const MARKS = {
  circle: "Circle" as const,
  highlight: "Highlight" as const,
  underline: "Underline" as const,
  strike: "Strike" as const,
  wavy: "Wavy line" as const,
  notes: "Margin notes" as const
} as const;
type Key = keyof typeof MARKS;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const on = shallowRef<Record<Key, boolean>>(initialState({
    circle: true,
    highlight: true,
    underline: true,
    strike: true,
    wavy: true,
    notes: true
  }));
  const setOn = stateSetter(on);
  const take = shallowRef(initialState(0));
  const setTake = stateSetter(take);
  return () => {
    return <div class="grid w-full max-w-4xl gap-4">
      <div role="group" aria-label="Annotations" class="flex flex-wrap items-center gap-4">
        {(Object.keys(MARKS) as Key[]).map(k => <Button key={k} size="sm" variant={on.value[k] ? "default" as const : "outline" as const} aria-pressed={on.value[k]} onClick={() => setOn(s => ({
          ...s,
          [k]: !s[k]
        }))}>
            {MARKS[k]}
          </Button>)}
        <Button size="sm" variant="ghost" onClick={() => setTake(t => t + 1)}>
          Replay
        </Button>
      </div>
      <Paper key={take.value} stock="paper" rules="ruled" seed="reader" class="w-full pt-4 pr-6 pb-6 pl-14 md:pr-60">
        <p class="font-type text-[11px] leading-[28px] text-pencil-text">Reading notes / Tuesday</p>
        <h3 class="font-script text-[2.1rem] leading-[56px] font-bold">On owning books</h3>
        <p class="text-[17px] leading-[28px]">
          Most of what I remember from a book is in the{" "}
          <Annotate type="circle" color="red" show={on.value.circle} animate>
            margins
          </Annotate>
          <Callout show={on.value.notes} animate delay={500} curve="straight" class="float-end clear-end -me-52 mt-1.5 w-48 max-md:hidden">
            ha, true
          </Callout>
          : an arrow, a question mark, a small argument with a dead author. The good bits get{" "}
          <Annotate type="highlight" show={on.value.highlight} animate delay={200}>
            a swipe of yellow
          </Annotate>
          <Callout show={on.value.notes} animate delay={600} class="float-end clear-end -me-52 mt-1.5 w-48 max-md:hidden">
            the best line
          </Callout>{" "}
          so I can find them on the next read, and the parts I do not believe get a{" "}
          <Annotate type="underline" color="red" show={on.value.underline} animate delay={300}>
            red pencil
          </Annotate>
          . By the{" "}
          <Annotate type="highlight" color="green" show={on.value.highlight} animate delay={250}>
            third reading
          </Annotate>{" "}
          the book is more mine than the{" "}
          <Annotate type="strike-through" show={on.value.strike} animate>
            writer&rsquo;s
          </Annotate>
          <Callout show={on.value.notes} animate delay={900} direction="left" bend="down" class="float-end clear-end -me-52 mt-1.5 w-48 max-md:hidden">
            not sure about this...
          </Callout>
          , which is the{" "}
          <Annotate type="underline" kind="wavy" color="blue" show={on.value.wavy} animate delay={400}>
            whole point of owning one
          </Annotate>
          <Asterisk label="footnote" />.
        </p>
        <div class="mt-7 flex items-center gap-3 text-sm leading-[28px] text-pencil-text">
          times I have read it <Tally count={7} size="md" animate />
        </div>
        <p class="text-sm leading-[28px] text-pencil-text">* the whole shelf, eventually</p>
      </Paper>
    </div>;
  };
});
export default Example;
