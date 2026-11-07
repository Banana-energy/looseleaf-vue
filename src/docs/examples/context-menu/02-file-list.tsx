// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Icon } from "@/components/ui/icon";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "On a list row" as const,
  description: "asChild makes each row its own region, so the menu knows which row you clicked. The chosen row is remembered below the list; rows are focusable, so the menu key works from the keyboard." as const,
  layout: "center" as const,
  height: 420,
  stage: "desk" as const
};
const FILES = [["Field notes.md", "file-text"], ["Garden log.md", "file-text"], ["Recipes", "folder"], ["Sketches", "folder"]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const picked = shallowRef(initialState("Right-click a row."));
  const setPicked = stateSetter(picked);
  return () => {
    return <Paper stock="paper" seed="files" class="w-full max-w-sm p-4">
      <h3 class="font-script text-2xl leading-none font-semibold">Notebooks</h3>
      <ul class="mt-3 grid gap-0.5">
        {FILES.map(([name, icon]) => <li key={name}>
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div tabindex={0} class="flex items-center gap-2.5 px-2 py-1.5 outline-hidden hover:ll-swipe focus-visible:ll-swipe">
                  <Icon name={icon} /> {name}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent class="w-52">
                <ContextMenuItem onSelect={() => setPicked(`Opened ${name}`)}>
                  <Icon name="folder-open" /> Open
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => setPicked(`Renamed ${name}`)}>
                  <Icon name="pencil" /> Rename <ContextMenuShortcut>F2</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => setPicked(`Copied ${name}`)}>
                  <Icon name="copy" /> Duplicate <ContextMenuShortcut>⌘D</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem variant="destructive" onSelect={() => setPicked(`Trashed ${name}`)}>
                  <Icon name="trash" /> Move to trash
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </li>)}
      </ul>
      <p class="mt-3 border-t border-dashed border-pencil-mark/60 pt-2 text-sm text-muted-foreground" aria-live="polite">
        {picked.value}
      </p>
    </Paper>;
  };
});
export default Example;
