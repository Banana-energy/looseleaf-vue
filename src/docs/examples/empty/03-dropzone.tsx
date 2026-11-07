// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "Placeholder frame" as const,
  description: "`border` in `className` asks for the sketched dashed frame, with a tick at each corner where the hand marked out the rectangle first. It replaces the CSS border. Here it is a working drop target: drag files over it (it lights up), or use the button; a doodle is the media, and `doodle` takes any name from the Doodle component." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 400
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const files = shallowRef<File[]>(initialState([]));
  const setFiles = stateSetter(files);
  const over = shallowRef(initialState(false));
  const setOver = stateSetter(over);
  const picker = shallowRef<HTMLInputElement | null>(null);
  const take = computed(() => (list: FileList | null) => {
    if (list?.length) setFiles(Array.from(list));
  });
  return () => {
    return <Paper stock="paper" tape="top" tapeKind="washi-dots" seed="drop" class="w-full max-w-lg p-5">
      <Empty seed="dropzone" class="border transition-colors duration-(--ll-dur-fade) data-[over]:bg-hi-select/40" data-over={over.value ? "" as const : undefined} onDragover={e => {
        e.preventDefault();
        setOver(true);
      }} onDragleave={() => setOver(false)} onDrop={e => {
        e.preventDefault();
        setOver(false);
        take.value(e.dataTransfer.files);
      }}>
        <EmptyHeader>
          <EmptyMedia doodle="paper-plane" size={88} />
          <EmptyTitle>{files.value.length ? "Ready to send" as const : "Drop files here" as const}</EmptyTitle>
          <EmptyDescription aria-live="polite">
            {files.value.length ? files.value.map(f => f.name).join(", ") : "or choose them from your computer. PNG, JPG or PDF, up to 10 MB." as const}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <input ref={picker} type="file" multiple hidden onChange={(e: Event) => take.value((e.target as HTMLInputElement).files)} />
          <Button type="button" onClick={() => picker.value?.click()}>
            <Icon name="upload" />
            {files.value.length ? "Choose others" as const : "Choose files" as const}
          </Button>
        </EmptyContent>
      </Empty>
    </Paper>;
  };
});
export default Example;
