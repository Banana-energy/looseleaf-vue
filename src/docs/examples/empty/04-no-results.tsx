// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
export const meta = {
  title: "Search with no results" as const,
  description: "A real use: a filterable list that turns into an empty state when nothing matches, with an action that puts the list back. Type something that is not a name." as const,
  layout: "center" as const,
  height: 520
};
const people = ["Ada Lovelace", "Jo Okafor", "Mika Kobayashi", "Sam Reyes", "Priya Nair", "Tomas Berg"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const query = shallowRef(initialState("ghost pepper"));
  const setQuery = stateSetter(query);
  const shown = computed(() => people.filter(p => p.toLowerCase().includes(query.value.trim().toLowerCase())));
  return () => {
    return <Card seed="contacts" class="w-full max-w-md">
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
      </CardHeader>
      <CardContent class="grid gap-4">
        <Input aria-label="Search contacts" placeholder="Search by name" value={query.value} onChange={(e: Event) => setQuery((e.target as HTMLInputElement).value)} />
        {shown.value.length ? <ul class="grid gap-2 text-sm" aria-label="Contacts">
            {shown.value.map(p => <li key={p}>{p}</li>)}
          </ul> : <Empty class="p-2 md:p-4">
            <EmptyHeader>
              <EmptyMedia pose="shrug" size={104} />
              <EmptyTitle>No contacts found</EmptyTitle>
              <EmptyDescription>Nobody is called “{query.value}”. Check the spelling, or start again.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm" variant="outline" onClick={() => setQuery("")}>
                Show everyone
              </Button>
            </EmptyContent>
          </Empty>}
      </CardContent>
    </Card>;
  };
});
export default Example;
