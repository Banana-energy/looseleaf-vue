// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "App header (composed)" as const,
  description: "A real use: the bar sits in an app header beside the title and an account button. Choosing a row reports what happened, and the bar stays one tab stop for keyboard users." as const,
  layout: "center" as const,
  height: 340,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const said = shallowRef(initialState("Nothing chosen yet."));
  const setSaid = stateSetter(said);
  const pick = computed(() => (what: string) => () => setSaid(what));
  return () => {
    return <Paper stock="paper" seed="app-header" class="z-(--ll-z-raised) w-full max-w-2xl self-start px-5 pt-3 pb-4">
      <header class="flex items-center gap-3">
        <span class="flex items-center gap-2 font-script text-2xl leading-none font-semibold">
          <Icon name="book-open" size={22} /> Looseleaf
        </span>
        <Menubar seed="header" aria-label="Application">
          <MenubarMenu>
            <MenubarTrigger>Notebook</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={pick.value("New notebook")}>
                <Icon name="file-plus" /> New <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onSelect={pick.value("Opened")}>
                <Icon name="folder-open" /> Open… <MenubarShortcut>⌘O</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onSelect={pick.value("Saved")}>
                <Icon name="save" /> Save <MenubarShortcut>⌘S</MenubarShortcut>
              </MenubarItem>
              <MenubarItem variant="destructive" onSelect={pick.value("Moved to trash")}>
                <Icon name="trash" /> Move to trash
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Help</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={pick.value("Guide")}>
                <Icon name="life-buoy" /> Guide
              </MenubarItem>
              <MenubarItem onSelect={pick.value("Shortcuts")}>
                <Icon name="command" /> Shortcuts <MenubarShortcut>⌘/</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <Button variant="ghost" size="icon" class="ms-auto" aria-label="Account">
          <Icon name="circle-user" size={20} />
        </Button>
      </header>
      <p class="mt-3 text-sm text-muted-foreground" aria-live="polite">
        {said.value}
      </p>
    </Paper>;
  };
});
export default Example;
