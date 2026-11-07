// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Icon } from "@/components/ui/icon";
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "Right-click anywhere" as const,
  description: "The shadcn demo: back, forward and reload with keycaps, a sub-menu, ticked rows and a radio group. The slip opens where you clicked (or press the menu key on the focused note)." as const,
  layout: "center" as const,
  height: 480,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const bookmarks = shallowRef(initialState(true));
  const setBookmarks = stateSetter(bookmarks);
  const urls = shallowRef(initialState(false));
  const setUrls = stateSetter(urls);
  const person = shallowRef(initialState("pedro"));
  const setPerson = stateSetter(person);
  return () => {
    return <ContextMenu>
      <ContextMenuTrigger asChild>
        <Paper stock="graph" seed="region" tabindex={0} aria-label="Right click, or press the menu key" class="grid h-44 w-80 place-items-center text-center">
          <span class="font-script text-2xl">
            Right-click anywhere
            <span class="block font-hand text-sm text-muted-foreground">long-press on touch</span>
          </span>
        </Paper>
      </ContextMenuTrigger>
      <ContextMenuContent class="w-72" seed="ctx">
        <ContextMenuItem inset>
          Back <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          Forward <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Reload <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More tools</ContextMenuSubTrigger>
          <ContextMenuSubContent class="w-52">
            <ContextMenuItem>
              Save page as… <ContextMenuShortcut>⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>Create shortcut…</ContextMenuItem>
            <ContextMenuItem>Name window…</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer tools</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">
              <Icon name="trash" /> Delete
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked={bookmarks.value} onCheckedChange={setBookmarks}>
          Show bookmarks <ContextMenuShortcut>⇧⌘B</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked={urls.value} onCheckedChange={setUrls}>
          Show full URLs
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value={person.value} onValueChange={setPerson}>
          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>;
  };
});
export default Example;
