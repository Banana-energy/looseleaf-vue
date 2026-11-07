// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { EmptySearchList, PEOPLE, findPeople } from "@/blocks/empty-search/components/empty-search-people";
const SUGGESTIONS = ["Ada", "Printer", "Lagos"];
type EmptySearchProps = {
  defaultQuery?: string;
};
const EmptySearch = defineUi<EmptySearchProps>("EmptySearch", ["defaultQuery"], (_props, {
  slots: _slots
}) => {
  const defaultQuery = computed(() => _props["defaultQuery"] === undefined ? "ghost pepper" as const : _props["defaultQuery"]);
  const titleId = useId();
  const inputRef = shallowRef<HTMLInputElement | null>(null);
  const query = shallowRef(initialState(defaultQuery.value));
  const setQuery = stateSetter(query);
  const people = computed(() => findPeople(query.value));
  const set = computed(() => (value: string) => {
    setQuery(value);
    inputRef.value?.focus();
  });
  return () => {
    return <section aria-labelledby={titleId} class="@container w-full">
      <div class="px-8 py-10 @xl:py-14">
        <Card tape="corner" tapeKind="masking" seed="empty-search" class="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>
              <h2 id={titleId}>Contacts</h2>
            </CardTitle>
            <CardDescription>{PEOPLE.length} people in your address book</CardDescription>
          </CardHeader>

          <CardContent class="grid gap-4">
            <InputGroup>
              <InputGroupAddon>
                <Icon name="search" />
              </InputGroupAddon>
              <InputGroupInput ref={inputRef} type="search" aria-label="Search contacts" placeholder="Search by name or place" value={query.value} onChange={(e: Event) => setQuery((e.target as HTMLInputElement).value)} />
              {query.value ? <InputGroupAddon align="inline-end">
                  <InputGroupButton type="button" size="icon-xs" aria-label="Clear search" onClick={() => set.value("")}>
                    <Icon name="x" />
                  </InputGroupButton>
                </InputGroupAddon> : null}
            </InputGroup>

            <p role="status" class="sr-only">
              {people.value.length === 0 ? "No results." as const : `${people.value.length} ${people.value.length === 1 ? "person" as const : "people" as const} found.`}
            </p>

            {people.value.length > 0 ? <EmptySearchList people={people.value} /> : <Empty class="border border-dashed">
                <EmptyHeader>
                  <EmptyMedia pose="search" size={120} />
                  <EmptyTitle class="wrap-anywhere">No results for &ldquo;{query.value.trim()}&rdquo;</EmptyTitle>
                  <EmptyDescription>Nobody is called that. Check the spelling, or try a shorter word.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button type="button" onClick={() => set.value("")}>
                    Clear search
                  </Button>
                  <div class="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                    <span class="text-sm text-ink-muted">Try</span>
                    {SUGGESTIONS.map(s => <Button key={s} type="button" variant="outline" size="sm" onClick={() => set.value(s)}>
                        {s}
                      </Button>)}
                  </div>
                </EmptyContent>
              </Empty>}
          </CardContent>
        </Card>
      </div>
    </section>;
  };
});
export default EmptySearch;
export type { EmptySearchProps };
