// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Folder, FolderContent, FolderTab, FolderTabs } from "@/components/ui/folder";
export const meta = {
  title: "A folder with tabs" as const,
  description: "The front tab is the folder's color and runs into the body; the others stand behind it. Arrow keys move between tabs; Home and End jump." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Folder defaultValue="inbox" class="mx-auto">
      <FolderTabs aria-label="Mail">
        <FolderTab value="inbox">Inbox</FolderTab>
        <FolderTab value="drafts">Drafts</FolderTab>
        <FolderTab value="sent">Sent</FolderTab>
        <FolderTab value="archive" disabled>
          Archive
        </FolderTab>
      </FolderTabs>
      <FolderContent value="inbox" seed="in">
        <h3 class="font-script text-3xl leading-none font-bold">Inbox</h3>
        <p class="mt-2">Three letters are waiting: one from Ada, and a parcel notice that has been waiting longer.</p>
      </FolderContent>
      <FolderContent value="drafts" seed="dr">
        <h3 class="font-script text-3xl leading-none font-bold">Drafts</h3>
        <p class="mt-2">Two drafts, both begun, neither finished.</p>
      </FolderContent>
      <FolderContent value="sent" seed="se">
        <h3 class="font-script text-3xl leading-none font-bold">Sent</h3>
        <p class="mt-2">Nothing yet this week.</p>
      </FolderContent>
    </Folder>;
  };
});
export default Example;
