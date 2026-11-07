// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleIndicator, CollapsibleTrigger } from "@/components/ui/collapsible";
export const meta = {
  title: "Show more" as const,
  description: "A composed card: the first three lines of a reading list are always there, the rest fold away behind a controlled trigger that says what it will do." as const,
  layout: "center" as const,
  height: 420
};
const books = ["The Design of Everyday Things", "A Pattern Language", "Letters to a Young Poet", "Steal Like an Artist", "How to Do Nothing", "Bird by Bird", "The Elements of Typographic Style"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  return () => {
    return <Card seed="reading-list" class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Reading list</CardTitle>
        <CardDescription>{books.length} books, in the order I meant to read them.</CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible open={open.value} onOpenChange={setOpen}>
          <ul class="grid gap-1.5 text-sm">
            {books.slice(0, 3).map(b => <li key={b}>{b}</li>)}
          </ul>
          <CollapsibleContent>
            <ul class="mt-1.5 grid gap-1.5 text-sm">
              {books.slice(3).map(b => <li key={b}>{b}</li>)}
            </ul>
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <Button variant="link" size="sm" class="mt-3 px-0">
              {open.value ? "Show fewer" as const : `Show ${books.length - 3} more`}
              <CollapsibleIndicator />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </CardContent>
    </Card>;
  };
});
export default Example;
