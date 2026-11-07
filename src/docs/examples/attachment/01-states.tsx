// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentProgress, AttachmentTitle } from "@/components/ui/attachment";
export const meta = {
  title: "The five states" as const,
  description: "Done (a clipped slip), uploading (a pencil bar), processing (the same bar, pulsing), error (red pencil and a retry) and idle (a dashed slot waiting for a file)." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-auto flex w-full max-w-xs flex-col items-start gap-6 px-4 pt-3 pb-4">
      <Attachment class="w-full" state="done" seed="done">
        <AttachmentMedia>
          <Icon name="file-text" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>field-notes.pdf</AttachmentTitle>
          <AttachmentDescription>2.4 MB · pdf</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove field-notes.pdf">
            <Icon name="x" />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment class="w-full" state="uploading" seed="uploading">
        <AttachmentMedia>
          <Icon name="file-code" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>tags-list.tsx</AttachmentTitle>
          <AttachmentDescription>Uploading 42 %</AttachmentDescription>
          <AttachmentProgress value={42} aria-label="Upload progress" />
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Cancel upload">
            <Icon name="x" />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment class="w-full" state="processing" seed="processing">
        <AttachmentMedia>
          <Icon name="file" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>recipes.csv</AttachmentTitle>
          <AttachmentDescription>Reading the rows</AttachmentDescription>
          <AttachmentProgress aria-label="Processing" />
        </AttachmentContent>
      </Attachment>
      <Attachment class="w-full" state="error" seed="error">
        <AttachmentMedia>
          <Icon name="archive" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>holiday-photos.zip</AttachmentTitle>
          <AttachmentDescription>Too large. Max 25 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Try again">
            <Icon name="rotate-cw" />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment class="w-full" state="idle" seed="idle">
        <AttachmentMedia>
          <Icon name="upload" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Add a file</AttachmentTitle>
          <AttachmentDescription>or drop it here</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </div>;
  };
});
export default Example;
