// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from "@/components/ui/attachment";
import { Icon } from "@/components/ui/icon";
import { PromptInput, PromptInputAttachments, PromptInputBody, PromptInputButton, PromptInputFooter, PromptInputSubmit, PromptInputTextarea, PromptInputTools, usePromptInput } from "@/components/ui/prompt-input";
export const meta = {
  title: "With attachments" as const,
  description: "Chips in the row above the text, a file button in the tools, a send that also works with no words when `allowEmpty` is set. Pick a file to add a chip; the remove button takes it away again." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
type File = {
  id: number;
  name: string;
  size: string;
};
const RemoveFile = defineUi<{
  name: string;
  onRemove: () => void;
}>("RemoveFile", ["name", "onRemove"], (_props, {
  slots: _slots
}) => {
  const name = computed(() => _props["name"]);
  const onRemove = computed(() => _props["onRemove"]);
  const _hook2 = usePromptInput();
  const focus = computed(() => _hook2.value.focus);
  return () => {
    return <AttachmentAction aria-label={`Remove ${name.value}`} onClick={() => {
      onRemove.value();
      focus.value();
    }}>
      <Icon name="x" />
    </AttachmentAction>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const files = shallowRef<File[]>(initialState([{
    id: 1,
    name: "field-notes.pdf" as const,
    size: "2.4 MB" as const
  }]));
  const setFiles = stateSetter(files);
  const pick = shallowRef<HTMLInputElement | null>(null);
  const next = shallowRef(2);
  return () => {
    return <div class="mx-auto w-full max-w-xl px-2 pb-3">
      <PromptInput seed="attach" allowEmpty={files.value.length > 0} onSubmit={() => setFiles([])}>
        <PromptInputAttachments>
          {files.value.map(f => <Attachment key={f.id} size="sm" seed={f.name}>
              <AttachmentMedia>
                <Icon name="file-text" />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{f.name}</AttachmentTitle>
                <AttachmentDescription>{f.size}</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <RemoveFile name={f.name} onRemove={() => setFiles(all => all.filter(x => x.id !== f.id))} />
              </AttachmentActions>
            </Attachment>)}
        </PromptInputAttachments>
        <PromptInputBody>
          <PromptInputTextarea aria-label="Message" placeholder="Say something about them..." />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <input ref={pick} type="file" multiple hidden onChange={(e: Event) => {
              const chosen = Array.from((e.currentTarget as HTMLInputElement).files ?? []);
              setFiles(all => [...all, ...chosen.map(f => ({
                id: next.value++,
                name: f.name,
                size: `${Math.max(1, Math.round(f.size / 1024))} KB`
              }))]);
              (e.currentTarget as HTMLInputElement).value = "";
            }} />
            <PromptInputButton size="icon-sm" aria-label="Attach a file" onClick={() => pick.value?.click()}>
              <Icon name="paperclip" />
            </PromptInputButton>
          </PromptInputTools>
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>
    </div>;
  };
});
export default Example;
