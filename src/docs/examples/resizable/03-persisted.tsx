// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Paper } from "@/components/ui/paper";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, useDefaultLayout, useGroupRef, type LayoutStorage } from "@/components/ui/resizable";
export const meta = {
  title: "Remembered layout" as const,
  description: "`useDefaultLayout` saves and restores a layout through any object with `getItem` and `setItem`. Here that is a plain in-memory Map (no localStorage): resize, press Remount, and the panels come back where you left them. Reset uses the group's imperative `setLayout`." as const,
  layout: "center" as const
};
const memory = new Map<string, string>();
const storage: LayoutStorage = {
  getItem: key => memory.get(key) ?? null,
  setItem: (key, value) => void memory.set(key, value)
};
const Studio = defineUi<{}>("Studio", [], (_props, {
  slots: _slots
}) => {
  const group = useGroupRef();
  const _hook1 = useDefaultLayout(() => ({
    id: "docs-remembered" as const,
    storage,
    panelIds: ["notes", "canvas"]
  }));
  const defaultLayout = computed(() => _hook1.value.defaultLayout);
  const onLayoutChanged = computed(() => _hook1.value.onLayoutChanged);
  return () => {
    return <div class="grid gap-3">
      <Paper stock="slip" tilt={false} seed="remembered">
        <ResizablePanelGroup groupRef={group.value} orientation="horizontal" id="docs-remembered" defaultLayout={defaultLayout.value} onLayoutChanged={onLayoutChanged.value} class="h-40">
          <ResizablePanel id="notes" defaultSize="35%" minSize="15%">
            <div class="p-4 font-script text-xl font-semibold">Notes</div>
          </ResizablePanel>
          <ResizableHandle withHandle aria-label="Resize the notes" />
          <ResizablePanel id="canvas" defaultSize="65%" minSize="30%">
            <div class="p-4 font-script text-xl font-semibold">Canvas</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Paper>
      <Button variant="outline" size="sm" class="justify-self-start" onClick={() => group.value.value?.setLayout({
        notes: 35,
        canvas: 65
      })}>
        Reset to 35 / 65
      </Button>
    </div>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const mounted = shallowRef(initialState(true));
  const setMounted = stateSetter(mounted);
  return () => {
    return <div class="grid w-full max-w-md gap-4">
      {mounted.value ? <Studio /> : <p class="grid h-40 place-items-center text-sm text-muted-foreground">Unmounted. Bring it back and it will remember.</p>}
      <div class="flex gap-2">
        <Button size="sm" onClick={() => setMounted(m => !m)}>
          {mounted.value ? "Unmount" as const : "Remount" as const}
        </Button>
      </div>
    </div>;
  };
});
export default Example;
