// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "A filter inside a menu" as const,
  description: "The shadcn recipe for \"apply a label\": a row's action menu has a sub-menu, and the sub-menu holds a Command, so a long list of labels can be searched with the keyboard. The palette puts its own slip away inside a menu, because the menu is already the paper." as const,
  layout: "center" as const,
  height: 480
};
const LABELS = ["feature", "bug", "enhancement", "documentation", "design", "question", "maintenance"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const label = shallowRef(initialState("feature"));
  const setLabel = stateSetter(label);
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  return () => {
    return <Paper stock="paper" seed="task-row" class="flex w-full max-w-lg items-center justify-between gap-3 self-start px-4 py-2">
      <p class="flex items-center gap-3 font-bold">
        <Badge>{label.value}</Badge>
        <span class="font-normal text-muted-foreground">Create a new project</span>
      </p>
      <DropdownMenu open={open.value} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Task actions">
            <Icon name="ellipsis" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-56" seed="task-actions">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>Assign to...</DropdownMenuItem>
            <DropdownMenuItem>Set due date...</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Apply label</DropdownMenuSubTrigger>
              <DropdownMenuSubContent class="p-0">
                <Command label="Labels">
                  <CommandInput placeholder="Filter label..." autoFocus />
                  <CommandList>
                    <CommandEmpty>No label found.</CommandEmpty>
                    <CommandGroup>
                      {LABELS.map(l => <CommandItem key={l} value={l} onSelect={() => {
                        setLabel(l);
                        setOpen(false);
                      }}>
                          {l}
                        </CommandItem>)}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Paper>;
  };
});
export default Example;
