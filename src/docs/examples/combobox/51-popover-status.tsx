// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
export const meta = {
  title: "Popover and Command, by hand" as const,
  description: "The composable recipe behind the Combobox: a button with `role=\"combobox\"`, a Popover that opens to its side, and a Command inside it for the search and the rows. Reach for it when you want full control of the trigger; the Combobox component wraps the same parts and adds the form value." as const,
  layout: "center" as const,
  height: 340
};
type Status = {
  value: string;
  label: string;
};
const STATUSES: Status[] = [{
  value: "backlog" as const,
  label: "Backlog" as const
}, {
  value: "todo" as const,
  label: "Todo" as const
}, {
  value: "in progress" as const,
  label: "In progress" as const
}, {
  value: "done" as const,
  label: "Done" as const
}, {
  value: "canceled" as const,
  label: "Canceled" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  const selected = shallowRef<Status | null>(initialState(null));
  const setSelected = stateSetter(selected);
  return () => {
    return <div class="flex items-center gap-4 self-start">
      <p class="text-sm text-muted-foreground">Status</p>
      <Popover open={open.value} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open.value} aria-label="Status" class="w-[150px] justify-start">
            {selected.value ? selected.value.label : "+ Set status" as const}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-52 p-0" side="right" align="start" aria-label="Set status">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {STATUSES.map(s => <CommandItem key={s.value} value={s.value} onSelect={() => {
                  setSelected(s);
                  setOpen(false);
                }}>
                    {s.label}
                  </CommandItem>)}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>;
  };
});
export default Example;
