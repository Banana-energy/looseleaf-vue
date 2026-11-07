// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarLabel, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "Format menu that acts" as const,
  description: "Controlled rows change the page under the bar: bold and italic are ticked rows, the paper is a radio group. Every state lives in your component; the menus just report it." as const,
  layout: "center" as const,
  height: 420,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const bold = shallowRef(initialState(false));
  const setBold = stateSetter(bold);
  const italic = shallowRef(initialState(false));
  const setItalic = stateSetter(italic);
  const paper = shallowRef<"ruled" | "graph" | "none">(initialState("ruled"));
  const setPaper = stateSetter(paper);
  return () => {
    return <div class="grid w-full max-w-md gap-4">
      <Menubar seed="editor" class="w-full">
        <MenubarMenu>
          <MenubarTrigger>Format</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Text</MenubarLabel>
            <MenubarCheckboxItem checked={bold.value} onCheckedChange={setBold}>
              Bold <MenubarShortcut>⌘B</MenubarShortcut>
            </MenubarCheckboxItem>
            <MenubarCheckboxItem checked={italic.value} onCheckedChange={setItalic}>
              Italic <MenubarShortcut>⌘I</MenubarShortcut>
            </MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Paper</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value={paper.value} onValueChange={v => setPaper(v as typeof paper)}>
              <MenubarRadioItem value="ruled">Ruled</MenubarRadioItem>
              <MenubarRadioItem value="graph">Graph</MenubarRadioItem>
              <MenubarRadioItem value="none">Plain</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarLabel>Shown under your writing</MenubarLabel>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <Paper stock={paper.value === "graph" ? "graph" as const : "paper" as const} rules={paper.value} seed="editor-page" class={`min-h-40 p-6 ${paper.value === "ruled" ? "pt-4 ps-14" as const : "" as const}`}>
        <p class={`font-hand text-lg ${bold.value ? "font-bold" as const : "" as const} ${italic.value ? "italic" as const : "" as const}`}>Things to buy: ink, a good eraser, tape.</p>
      </Paper>
    </div>;
  };
});
export default Example;
