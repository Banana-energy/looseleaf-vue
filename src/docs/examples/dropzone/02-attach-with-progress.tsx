// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dropzone, DropzoneArea, DropzoneDescription, DropzoneIcon, DropzoneItem, DropzoneList, DropzoneRejections, DropzoneTitle } from "@/components/ui/dropzone";
export const meta = {
  title: "Attach files, with progress" as const,
  description: "No upload is built in: you drive each row from your own request. Here a timer stands in for the network: rows fill their highlighter line, finish with a green tick, and one file is made to fail so you can see the red rule and its wavy line." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 640
};
type Status = {
  progress: number;
  state: "uploading" | "done" | "error";
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const files = shallowRef<File[]>(initialState([]));
  const setFiles = stateSetter(files);
  const status = shallowRef<Map<File, Status>>(initialState(new Map()));
  const setStatus = stateSetter(status);
  const started = shallowRef(new Set<File>());
  const timers = shallowRef(new Map<File, number>());
  watchDependencies(() => {
    for (const [f, id] of timers.value) {
      if (!files.value.includes(f)) {
        window.clearInterval(id);
        timers.value.delete(f);
      }
    }
    for (const f of files.value) {
      if (started.value.has(f)) continue;
      started.value.add(f);
      let progress = 0;
      setStatus(m => new Map(m).set(f, {
        progress,
        state: "uploading" as const
      }));
      const id = window.setInterval(() => {
        progress = Math.min(100, progress + 8 + f.size % 7);
        const state = progress >= 100 ? f.name.includes("fail") ? "error" as const : "done" as const : "uploading" as const;
        setStatus(m => new Map(m).set(f, {
          progress,
          state
        }));
        if (progress >= 100) {
          window.clearInterval(id);
          timers.value.delete(f);
        }
      }, 240);
      timers.value.set(f, id);
    }
  }, () => [files.value], false);
  watchDependencies(() => {
    const running = timers.value;
    return () => running.forEach(id => window.clearInterval(id));
  }, () => [], false);
  const busy = computed(() => files.value.some(f => status.value.get(f)?.state === "uploading"));
  return () => {
    return <Card seed="attach" tape="top" class="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Attach to this note</CardTitle>
        <CardDescription>Photos and PDFs, up to 3 MB each. A file with &quot;fail&quot; in its name will fail.</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-3 py-4">
        <Dropzone accept="image/*,.pdf" maxSize={3 * 1024 * 1024} files={files.value} onFilesChange={setFiles}>
          <DropzoneArea class="min-h-32">
            <DropzoneIcon />
            <DropzoneTitle />
            <DropzoneDescription />
          </DropzoneArea>
          <DropzoneRejections />
          <DropzoneList>
            {file => {
              const s = status.value.get(file);
              return <DropzoneItem file={file} status={s?.state ?? "idle"} progress={s?.progress} error={s?.state === "error" ? "The upload failed. Remove it and try again." as const : undefined} />;
            }}
          </DropzoneList>
        </Dropzone>
      </CardContent>
      <CardFooter class="justify-between gap-3 border-t">
        <p class="font-hand text-sm text-ink-muted" aria-live="polite">
          {files.value.length === 0 ? "Nothing attached." as const : busy.value ? "Sending..." as const : `${files.value.length} attached.`}
        </p>
        <Button disabled={files.value.length === 0 || busy.value}>Save note</Button>
      </CardFooter>
    </Card>;
  };
});
export default Example;
