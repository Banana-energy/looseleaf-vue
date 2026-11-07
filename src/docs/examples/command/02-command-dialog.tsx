// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";
import { Icon } from "@/components/ui/icon";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
export const meta = {
  title: "In a dialog, on a napkin" as const,
  description: "Press Ctrl + K (or Cmd + K) anywhere, or the button. The palette is set on a napkin with a pinked edge, over the dim; Escape puts it away and focus goes back to the button." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  watchDependencies(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, () => [], false);
  const run = computed(() => () => setOpen(false));
  return () => {
    return <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Icon name="search" />
        Search the notebook
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog open={open.value} onOpenChange={setOpen} title="Search the notebook" description="Jump to a page or run a command">
        <CommandInput placeholder="Jump to a page or run a command..." />
        <CommandList>
          <CommandEmpty>Nothing on that page.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={run.value}>
              <Icon name="file-text" />
              <span>Field notes</span>
            </CommandItem>
            <CommandItem onSelect={run.value}>
              <Icon name="book-open" />
              <span>Recipes</span>
            </CommandItem>
            <CommandItem onSelect={run.value}>
              <Icon name="folder" />
              <span>Garden log</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={run.value}>
              <Icon name="plus" />
              <span>New page</span>
              <CommandShortcut>Ctrl N</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={run.value}>
              <Icon name="copy" />
              <span>Duplicate page</span>
              <CommandShortcut>Ctrl D</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={run.value} disabled>
              <Icon name="trash" />
              <span>Empty the bin</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>;
  };
});
export default Example;
