// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Icon } from "@/components/ui/icon";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "Pen picker on a sticky note" as const,
  description: "A composed use: right-click a sticky note to choose the pen it is written with. The menu is a second sticky, in another color so it reads as its own note, taped down; the radio rows tick the choice." as const,
  layout: "center" as const,
  height: 400,
  stage: "desk" as const
};
const PENS: Record<string, string> = {
  felt: "felt tip" as const,
  pencil: "pencil" as const,
  marker: "marker" as const,
  highlighter: "highlighter" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const pen = shallowRef(initialState("felt"));
  const setPen = stateSetter(pen);
  const lines = shallowRef(initialState(2));
  const setLines = stateSetter(lines);
  return () => {
    return <ContextMenu>
      <ContextMenuTrigger asChild>
        <Paper stock="sticky-yellow" seed="pen-note" tape="top" tabindex={0} aria-label="Sticky note. Press the menu key for pens." class="w-64 p-5 pt-6">
          <p class="font-script text-2xl leading-tight">buy more ink!</p>
          <p class="mt-2 text-sm text-ink-soft">
            written with a {PENS[pen.value]} · {lines.value} line{lines.value === 1 ? "" as const : "s" as const}
          </p>
        </Paper>
      </ContextMenuTrigger>
      <ContextMenuContent class="w-56" stock="sticky-blue" tape="corner" seed="pen-menu">
        <ContextMenuLabel>Pen</ContextMenuLabel>
        <ContextMenuRadioGroup value={pen.value} onValueChange={setPen}>
          {Object.entries(PENS).map(([value, label]) => <ContextMenuRadioItem key={value} value={value}>
              {label}
            </ContextMenuRadioItem>)}
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem onSelect={() => setLines(n => n + 1)}>
            <Icon name="plus" /> Add a line <ContextMenuShortcut>⌘↵</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled={lines.value < 2} onSelect={() => setLines(n => Math.max(1, n - 1))}>
            <Icon name="minus" /> Remove a line
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>;
  };
});
export default Example;
