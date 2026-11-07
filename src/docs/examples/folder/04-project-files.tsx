// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Folder, FolderContent, FolderTab, FolderTabs } from "@/components/ui/folder";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Project files" as const,
  description: "A real page: a project's tasks, notes and files as tabs on one folder, with a form inside the open panel. Each panel is ordinary DOM; only the open one is in the page." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 420
};
const tasks = ["Ink the outline", "Wash the sky", "Hatch the shade", "Sign it"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Folder defaultValue="tasks" class="mx-auto">
      <FolderTabs aria-label="Project files">
        <FolderTab value="tasks">Tasks</FolderTab>
        <FolderTab value="notes">Notes</FolderTab>
        <FolderTab value="files">Files</FolderTab>
      </FolderTabs>
      <FolderContent value="tasks" seed="tasks" fastener="clip">
        <fieldset class="space-y-2">
          <legend class="mb-3 font-script text-3xl leading-none font-bold">Tasks</legend>
          {tasks.map((t, i) => <div key={t} class="flex items-center gap-3">
              <Checkbox id={`task-${i}`} defaultChecked={i < 2} />
              <Label for={`task-${i}`}>{t}</Label>
            </div>)}
        </fieldset>
        <Button size="sm" class="mt-5">
          Add a task
        </Button>
      </FolderContent>
      <FolderContent value="notes" seed="notes">
        <p class="font-script text-3xl leading-none font-bold">Notes</p>
        <p class="mt-2">Nothing here yet. The best notes are in the margins.</p>
      </FolderContent>
      <FolderContent value="files" seed="files">
        <p class="font-script text-3xl leading-none font-bold">Files</p>
        <p class="mt-2">outline.pdf, sky.png, shade-study.png</p>
      </FolderContent>
    </Folder>;
  };
});
export default Example;
