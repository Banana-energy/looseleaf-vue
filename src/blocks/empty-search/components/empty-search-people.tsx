// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
type EmptySearchPerson = {
  name: string;
  role: string;
};
const PEOPLE: EmptySearchPerson[] = [{
  name: "Ada Lovelace" as const,
  role: "Editor, London" as const
}, {
  name: "Jo Okafor" as const,
  role: "Illustrator, Lagos" as const
}, {
  name: "Mika Kobayashi" as const,
  role: "Bookbinder, Osaka" as const
}, {
  name: "Sam Reyes" as const,
  role: "Printer, Lisbon" as const
}, {
  name: "Priya Nair" as const,
  role: "Operations, Pune" as const
}, {
  name: "Tomas Berg" as const,
  role: "Finance, Malmö" as const
}];
function findPeople(query: string, people: EmptySearchPerson[] = PEOPLE): EmptySearchPerson[] {
  const q = query.trim().toLowerCase();
  if (!q) return people;
  return people.filter(p => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q));
}
const EmptySearchList = defineUi<{
  people: EmptySearchPerson[];
}>("EmptySearchList", ["people"], (_props, {
  slots: _slots
}) => {
  const people = computed(() => _props["people"]);
  return () => {
    return <ul class="grid list-none gap-1" aria-label="Contacts">
      {people.value.map(p => <li key={p.name} class="flex items-center gap-3 py-1.5">
          <Avatar>
            <AvatarFallback name={p.name} />
          </Avatar>
          <div class="min-w-0">
            <p class="truncate text-[17px] leading-6 font-bold">{p.name}</p>
            <p class="truncate text-sm leading-5 text-ink-muted">{p.role}</p>
          </div>
        </li>)}
    </ul>;
  };
});
export { EmptySearchList, PEOPLE, findPeople };
export type { EmptySearchPerson };
