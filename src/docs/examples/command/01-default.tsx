// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";
export const meta = {
  title: "Default" as const,
  description: "The shadcn demo on a slip. Type to cut the list down (\"cal\"), use the arrow keys, Enter to choose. The row you are on wears the highlighter; Calculator is disabled; the last three end in a keycap." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 440
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Command class="h-auto w-[22rem]" label="Commands">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Icon name="calendar" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Icon name="face-slightly-smiling" />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <Icon name="calculator" />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <Icon name="user" />
            <span>Profile</span>
            <CommandShortcut>Ctrl P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Icon name="credit-card" />
            <span>Billing</span>
            <CommandShortcut>Ctrl B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Icon name="settings" />
            <span>Settings</span>
            <CommandShortcut>Ctrl S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>;
  };
});
export default Example;
