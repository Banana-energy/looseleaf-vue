// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentProgress, AttachmentTitle, AttachmentTrigger } from "@/components/ui/attachment";
export const meta = {
  title: "A live upload" as const,
  description: "Progress is a CSS variable: the hatched fill is drawn once and clipped to the value, so a fast upload never redraws anything. The finished slip gets its clip and becomes pressable." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const value = shallowRef(initialState(0));
  const setValue = stateSetter(value);
  const run = shallowRef(initialState(0));
  const setRun = stateSetter(run);
  watchDependencies(() => {
    setValue(0);
    const id = window.setInterval(() => setValue(v => v >= 100 ? v : Math.min(100, v + 7)), 220);
    return () => window.clearInterval(id);
  }, () => [run.value], false);
  const done = computed(() => value.value >= 100);
  return () => {
    return <div class="mx-auto flex w-full max-w-sm flex-col items-start gap-4 px-4 pt-3 pb-4">
      <Attachment state={done.value ? "done" as const : "uploading" as const} seed="live" class="w-full">
        <AttachmentMedia>
          <Icon name="file-code" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>tags-list.tsx</AttachmentTitle>
          <AttachmentDescription>{done.value ? "Uploaded" as const : `Uploading ${value.value} %`}</AttachmentDescription>
          {done.value ? null : <AttachmentProgress value={value.value} aria-label="Upload progress" />}
        </AttachmentContent>
        {done.value ? <AttachmentTrigger aria-label="Open tags-list.tsx" onClick={() => setRun(r => r + 1)} /> : null}
        <AttachmentActions>
          <AttachmentAction aria-label={done.value ? "Remove tags-list.tsx" as const : "Cancel upload" as const}>
            <Icon name="x" />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Button variant="ghost" size="sm" onClick={() => setRun(r => r + 1)}>
        Upload again
      </Button>
    </div>;
  };
});
export default Example;
