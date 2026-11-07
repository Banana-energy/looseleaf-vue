// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxLoading, ComboboxTrigger, ComboboxValue } from "@/components/ui/combobox";
export const meta = {
  title: "Results from a server" as const,
  description: "Filtering is off (shouldFilter={false}) and the search text is watched: while a request is in flight the loops show and the empty message waits. Try \"gra\" (two people), then \"zzz\"." as const,
  layout: "center" as const,
  height: 380
};
const PEOPLE = ["Ada Lovelace", "Grace Hopper", "Graham Bell", "Katherine Johnson", "Alan Turing", "Margaret Hamilton"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const query = shallowRef(initialState(""));
  const setQuery = stateSetter(query);
  const results = shallowRef<string[]>(initialState(PEOPLE.slice(0, 3)));
  const setResults = stateSetter(results);
  const loading = shallowRef(initialState(false));
  const setLoading = stateSetter(loading);
  const value = shallowRef<string | null>(initialState(null));
  const setValue = stateSetter(value);
  watchDependencies(() => {
    setLoading(true);
    const t = window.setTimeout(() => {
      setResults(PEOPLE.filter(p => p.toLowerCase().includes(query.value.trim().toLowerCase())).slice(0, 5));
      setLoading(false);
    }, 600);
    return () => window.clearTimeout(t);
  }, () => [query.value], false);
  return () => {
    return <div class="self-start">
      <Combobox shouldFilter={false} loading={loading.value} inputValue={query.value} onInputValueChange={setQuery} value={value.value} onValueChange={setValue} label="Assignee">
        <ComboboxTrigger aria-label="Assignee" class="w-64">
          <ComboboxValue placeholder="Assign to..." />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search people..." />
          <ComboboxList>
            {loading.value && <ComboboxLoading>Searching...</ComboboxLoading>}
            <ComboboxEmpty>Nobody by that name.</ComboboxEmpty>
            {results.value.map(p => <ComboboxItem key={p} value={p}>
                {p}
              </ComboboxItem>)}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>;
  };
});
export default Example;
