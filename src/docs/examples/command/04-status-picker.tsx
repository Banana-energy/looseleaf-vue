// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
export const meta = {
  title: "A status picker in a popover" as const,
  description: "The classic use: a Command inside a Popover. The popover is the paper (the palette's own slip switches itself off), the chosen status gets a tick, and picking one closes the slip." as const,
  layout: "center" as const,
  height: 380
};
const STATUSES = [{
  value: "backlog" as const,
  label: "Backlog" as const
}, {
  value: "todo" as const,
  label: "To do" as const
}, {
  value: "in-progress" as const,
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
  const status = shallowRef(initialState("todo"));
  const setStatus = stateSetter(status);
  const current = computed(() => STATUSES.find(s => s.value === status.value));
  return () => {
    return <div class="flex items-center gap-3 self-start">
      <span class="font-hand text-sm text-ink-muted">Status</span>
      <Popover open={open.value} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" class="w-36 justify-between" aria-label="Change status">
            {current.value?.label}
            <Icon name="chevrons-up-down" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-52 p-0" align="start" aria-label="Status">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandGroup>
                {STATUSES.map(s => <CommandItem key={s.value} value={s.label} onSelect={() => {
                  setStatus(s.value);
                  setOpen(false);
                }}>
                    <span>{s.label}</span>
                    {s.value === status.value && <Icon name="check" class="ms-auto text-ink-you" />}
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
