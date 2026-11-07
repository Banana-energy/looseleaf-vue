// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "A wall of sticky notes" as const,
  description: "Sticky notes are turned a little more than pages, cast a shadow that lifts at the foot, and can curl a corner. One note per meaning; the first word says what it is." as const,
  layout: "stack" as const
};
const notes = [{
  stock: "sticky-yellow" as const,
  head: "todo" as const,
  body: "buy more ink" as const,
  curl: true
}, {
  stock: "sticky-green" as const,
  head: "done" as const,
  body: "book the venue" as const,
  curl: false
}, {
  stock: "sticky-orange" as const,
  head: "careful" as const,
  body: "the glue is wet" as const,
  curl: false
}, {
  stock: "sticky-pink" as const,
  head: "urgent" as const,
  body: "call mum" as const,
  curl: true
}, {
  stock: "sticky-blue" as const,
  head: "tip" as const,
  body: "tape it down first" as const,
  curl: false
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap justify-center gap-6 p-4">
      {notes.map(n => <Paper key={n.head} stock={n.stock} curl={n.curl} seed={n.head} class="size-36 p-4">
          <p class="font-script text-2xl font-bold leading-none">{n.head}</p>
          <p class="mt-2 text-sm">{n.body}</p>
        </Paper>)}
    </div>;
  };
});
export default Example;
