// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
export const meta = {
  title: "Upload queue" as const,
  description: "A real-world use: three files at different speeds, an indeterminate bar while one is being checked, a green bar and a tick when it is done. Progress is announced through aria-valuenow; the percentage is text." as const,
  layout: "stack" as const
};
type Upload = {
  name: string;
  size: string;
  pct: number | null;
};
const start: Upload[] = [{
  name: "field-notes.pdf" as const,
  size: "2.4 MB" as const,
  pct: 8
}, {
  name: "garden-plan.png" as const,
  size: "860 KB" as const,
  pct: 52
}, {
  name: "receipts.zip" as const,
  size: "14 MB" as const,
  pct: null
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const files = shallowRef(initialState(start));
  const setFiles = stateSetter(files);
  const running = shallowRef(initialState(false));
  const setRunning = stateSetter(running);
  watchDependencies(() => {
    if (!running.value) return;
    const t = setInterval(() => {
      setFiles(fs => fs.map((f, i) => f.pct === null ? {
        ...f,
        pct: 0
      } : {
        ...f,
        pct: Math.min(100, f.pct + 9 + i * 5)
      }));
    }, 500);
    return () => clearInterval(t);
  }, () => [running.value], false);
  const done = computed(() => files.value.every(f => f.pct === 100));
  return () => {
    return <div class="grid w-full max-w-md gap-5">
      {files.value.map(f => <div key={f.name} class="grid gap-1.5">
          <div class="flex items-baseline justify-between gap-3">
            <span class="flex items-center gap-1.5 text-[15px] font-bold">
              {f.pct === 100 && <Icon name="check" size={16} class="text-green" />}
              {f.name}
            </span>
            <span class="ll-num text-sm text-ink-muted">{f.pct === null ? "checking" as const : f.pct === 100 ? f.size : `${f.pct}% of ${f.size}`}</span>
          </div>
          <Progress value={f.pct} tone={f.pct === 100 ? "green" as const : "marker" as const} size="sm" aria-label={f.name} />
        </div>)}
      <div class="flex gap-3">
        <Button size="sm" onClick={() => setRunning(r => !r)}>
          {done.value ? "All done" as const : running.value ? "Pause" as const : "Start" as const}
        </Button>
        <Button size="sm" variant="outline" onClick={() => {
          setRunning(false);
          setFiles(start);
        }}>
          Reset
        </Button>
      </div>
    </div>;
  };
});
export default Example;
