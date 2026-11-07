// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
export const meta = {
  title: "Responsive: popover or drawer" as const,
  description: "One list, two shells: a popover next to the button on a wide screen, a drawer from the bottom on a phone, where a small floating box is hard to hit. The media query is read with useSyncExternalStore, so the server renders the popover and a phone swaps after hydration." as const,
  layout: "center" as const,
  height: 360
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
function useMediaQuery(_source0: MaybeRefOrGetter<string>) {
  const query = computed(() => toValue(_source0));
  const _nestedHook0 = useExternalStore(notify => {
    const mq = window.matchMedia(query.value);
    mq.addEventListener("change", notify);
    return () => mq.removeEventListener("change", notify);
  }, () => window.matchMedia(query.value).matches);
  return computed(() => {
    return _nestedHook0.value;
  });
}
const StatusList = defineUi<{
  onPick: (status: Status) => void;
}>("StatusList", ["onPick"], (_props, {
  slots: _slots
}) => {
  const onPick = computed(() => _props["onPick"]);
  return () => {
    return <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {STATUSES.map(s => <CommandItem key={s.value} value={s.value} onSelect={() => onPick.value(s)}>
              {s.label}
            </CommandItem>)}
        </CommandGroup>
      </CommandList>
    </Command>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  const selected = shallowRef<Status | null>(initialState(null));
  const setSelected = stateSetter(selected);
  const isDesktop = useMediaQuery(() => "(min-width: 768px)");
  const pick = computed(() => (s: Status) => {
    setSelected(s);
    setOpen(false);
  });
  const trigger = renderValue(() => <Button variant="outline" role="combobox" aria-expanded={open.value} aria-label="Status" class="w-[150px] justify-start">
      {selected.value ? selected.value.label : "+ Set status" as const}
    </Button>);
  return () => {
    if (isDesktop.value) {
      return <div class="self-start">
        <Popover open={open.value} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{trigger.value}</PopoverTrigger>
          <PopoverContent class="w-52 p-0" align="start" aria-label="Set status">
            <StatusList onPick={pick.value} />
          </PopoverContent>
        </Popover>
      </div>;
    }
    return <Drawer open={open.value} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger.value}</DrawerTrigger>
      <DrawerContent seed="status">
        <DrawerHeader class="sr-only">
          <DrawerTitle>Set status</DrawerTitle>
          <DrawerDescription>Choose a status for this task.</DrawerDescription>
        </DrawerHeader>
        <div class="mt-4 border-t border-dashed border-pencil-mark/60">
          <StatusList onPick={pick.value} />
        </div>
      </DrawerContent>
    </Drawer>;
  };
});
export default Example;
