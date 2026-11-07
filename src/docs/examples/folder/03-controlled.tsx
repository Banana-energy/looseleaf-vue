// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Folder, FolderContent, FolderTab, FolderTabs } from "@/components/ui/folder";
export const meta = {
  title: "Controlled" as const,
  description: "The open tab is your state: `value` and `onValueChange`, as on Tabs. Here a button jumps to the next one." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const months = ["Sep", "Oct", "Nov"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const value = shallowRef(initialState("Sep"));
  const setValue = stateSetter(value);
  return () => {
    return <div class="mx-auto flex max-w-xl flex-col gap-6">
      <Folder value={value.value} onValueChange={setValue}>
        <FolderTabs aria-label="Months">
          {months.map(m => <FolderTab key={m} value={m}>
              {m}
            </FolderTab>)}
        </FolderTabs>
        {months.map(m => <FolderContent key={m} value={m} seed={m}>
            <p class="font-script text-3xl leading-none font-bold">{m}</p>
            <p class="mt-2">Notes for {m}.</p>
          </FolderContent>)}
      </Folder>
      <Button variant="secondary" class="self-start" onClick={() => setValue(months[(months.indexOf(value.value) + 1) % months.length])}>
        Next month
      </Button>
    </div>;
  };
});
export default Example;
