// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StickyNote, StickyNoteContent, StickyNoteFooter, StickyNoteTitle } from "@/components/ui/sticky-note";
export const meta = {
  title: "A team board" as const,
  description: "A real board: notes you tick off as the week goes, laid on a card. Each note is a labeled group with its own checkbox; the tick is written when you press it." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const start = [{
  id: "a" as const,
  color: "yellow" as const,
  title: "design" as const,
  body: "finish the hero art" as const,
  who: "Ada" as const,
  done: true
}, {
  id: "b" as const,
  color: "green" as const,
  title: "docs" as const,
  body: "write the install page" as const,
  who: "Lin" as const,
  done: false
}, {
  id: "c" as const,
  color: "pink" as const,
  title: "ship" as const,
  body: "tag the release" as const,
  who: "Sam" as const,
  done: false
}, {
  id: "d" as const,
  color: "blue" as const,
  title: "later" as const,
  body: "ask about dark mode" as const,
  who: "Ada" as const,
  done: false
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const state = shallowRef<Record<string, boolean>>(initialState(() => Object.fromEntries(start.map(n => [n.id, n.done]))));
  const setState = stateSetter(state);
  return () => {
    return <Card stock="kraft" seed="board" class="mx-auto w-full max-w-3xl gap-4">
      <CardHeader>
        <CardTitle>This week</CardTitle>
      </CardHeader>
      <CardContent class="grid grid-cols-2 gap-6">
        {start.map(n => <StickyNote key={n.id} color={n.color} done={state.value[n.id]} onDoneChange={d => setState(s => ({
          ...s,
          [n.id]: d
        }))} doneLabel={`${n.title}: done`} seed={n.id} role="group" aria-label={`${n.title}: ${n.body}`} class="w-full max-w-40 justify-self-center">
            <StickyNoteTitle>{n.title}</StickyNoteTitle>
            <StickyNoteContent>{n.body}</StickyNoteContent>
            <StickyNoteFooter>{n.who}</StickyNoteFooter>
          </StickyNote>)}
      </CardContent>
    </Card>;
  };
});
export default Example;
