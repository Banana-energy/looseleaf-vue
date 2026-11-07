// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Dropzone, DropzoneArea, DropzoneDescription, DropzoneIcon, DropzoneTitle, useDropzone } from "@/components/ui/dropzone";
export const meta = {
  title: "One file: a profile picture" as const,
  description: "multiple={false}: one file, a new one replaces the old. A narrow zone whose own content follows the state through useDropzone (here: the chosen picture as a taped polaroid)." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 380
};
const Preview = defineUi<{}>("Preview", [], (_props, {
  slots: _slots
}) => {
  const _hook0 = useDropzone();
  const files = computed(() => _hook0.value.files);
  const url = shallowRef<string | null>(initialState(null));
  const setUrl = stateSetter(url);
  const file = computed(() => files.value[0]);
  watchDependencies(() => {
    if (!file.value) return;
    let u: string;
    try {
      u = URL.createObjectURL(file.value);
    } catch {
      return;
    }
    setUrl(u);
    return () => {
      URL.revokeObjectURL(u);
      setUrl(null);
    };
  }, () => [file.value], false);
  return () => {
    if (!file.value) return null;
    return <span class="relative -my-1 grid size-24 -rotate-3 place-items-center border-4 border-photo bg-photo shadow-[0_2px_4px_rgb(var(--ll-shade)/.35)]">
      {url.value ? <img src={url.value} alt={`Preview of ${file.value.name}`} class="size-full object-cover" /> : <span class="font-hand text-sm">{file.value.name}</span>}
    </span>;
  };
});
const Content = defineUi<{}>("Content", [], (_props, {
  slots: _slots
}) => {
  const _hook0 = useDropzone();
  const files = computed(() => _hook0.value.files);
  return () => {
    return files.value.length === 0 ? <>
      <DropzoneIcon />
      <DropzoneTitle>
        Drop a photo or <span class="text-ink-you underline decoration-wavy decoration-1 underline-offset-4">browse</span>
      </DropzoneTitle>
      <DropzoneDescription />
    </> : <>
      <Preview />
      <DropzoneDescription>{files.value[0].name} (drop another to replace it)</DropzoneDescription>
    </>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="w-72">
      <Dropzone multiple={false} accept="image/png,image/jpeg" maxSize={1024 * 1024}>
        <DropzoneArea class="min-h-56 p-4">
          <Content />
        </DropzoneArea>
      </Dropzone>
    </div>;
  };
});
export default Example;
