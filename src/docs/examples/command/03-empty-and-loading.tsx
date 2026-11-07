// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandLoading } from "@/components/ui/command";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Empty and loading" as const,
  description: "Results that come from a server: filtering is off (`shouldFilter={false}`), the loops show while a search is on its way, and Stubby comes out with his magnifier when the answer is nothing. Try \"inv\", then \"zzz\"." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 330
};
const DOCS = ["Invoice 0142", "Invoice 0143", "Invoice 0150", "Inventory count", "Invitation list"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const query = shallowRef(initialState(""));
  const setQuery = stateSetter(query);
  const results = shallowRef<string[]>(initialState([]));
  const setResults = stateSetter(results);
  const busy = shallowRef(initialState(false));
  const setBusy = stateSetter(busy);
  watchDependencies(() => {
    if (!query.value) {
      setResults([]);
      setBusy(false);
      return;
    }
    setBusy(true);
    const t = window.setTimeout(() => {
      setResults(DOCS.filter(d => d.toLowerCase().includes(query.value.toLowerCase())));
      setBusy(false);
    }, 700);
    return () => window.clearTimeout(t);
  }, () => [query.value], false);
  return () => {
    return <Command shouldFilter={false} class="h-auto w-[22rem]" label="Search documents">
      <CommandInput value={query.value} onValueChange={setQuery} placeholder="Search documents..." />
      <CommandList>
        {busy.value && <CommandLoading>Searching...</CommandLoading>}
        {!busy.value && query.value && results.value.length === 0 && <CommandEmpty>No documents found.</CommandEmpty>}
        {!busy.value && results.value.length > 0 && <CommandGroup heading="Documents">
            {results.value.map(d => <CommandItem key={d} value={d}>
                <Icon name="file-text" />
                <span>{d}</span>
              </CommandItem>)}
          </CommandGroup>}
      </CommandList>
      {!query.value && <p class="px-3 py-6 text-center font-script text-xl text-ink-muted">Type to search.</p>}
    </Command>;
  };
});
export default Example;
