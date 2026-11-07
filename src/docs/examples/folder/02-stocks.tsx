// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Folder, FolderContent, FolderTab, FolderTabs } from "@/components/ui/folder";
export const meta = {
  title: "Manila, yellow, white" as const,
  description: "The folder is whatever its stock is: manila, a legal-pad yellow or white card. A folder with one tab is just a labeled folder." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full gap-12 p-2">
      <Folder stock="sticky-yellow" defaultValue="one" class="max-w-xs">
        <FolderTabs aria-label="Recipes">
          <FolderTab value="one">Recipes</FolderTab>
        </FolderTabs>
        <FolderContent value="one" seed="y" tape="top">
          <p>A folder with one tab is just a labeled folder.</p>
        </FolderContent>
      </Folder>
      <Folder stock="paper" defaultValue="c">
        <FolderTabs aria-label="Photos">
          <FolderTab value="a">Sketches</FolderTab>
          <FolderTab value="b">Notes</FolderTab>
          <FolderTab value="c">Photos</FolderTab>
        </FolderTabs>
        <FolderContent value="a" seed="a">
          <p>Sketches</p>
        </FolderContent>
        <FolderContent value="b" seed="b">
          <p>Notes</p>
        </FolderContent>
        <FolderContent value="c" seed="c">
          <p>White card, three tabs, the last one open.</p>
        </FolderContent>
      </Folder>
    </div>;
  };
});
export default Example;
