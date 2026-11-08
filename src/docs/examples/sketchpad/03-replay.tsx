// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Sketchpad, type SketchStroke, type SketchpadHandle } from "@/components/ui/sketchpad";
import type { SketchPoint } from "@/lib/ink/recipes/sketchpad-ink";
export const meta = {
  title: "Replay" as const,
  description: "A read-only sketchpad that draws itself on again, stroke after stroke, along each center line. Reduced motion shows the finished picture." as const,
  layout: "stack" as const
};
// 生成可回放的等间距笔画点；这里使用普通函数，避免把数据生成器误当成 Vue 组件。
const STEP = (count: number, fn: (progress: number) => SketchPoint): SketchPoint[] => Array.from({
  length: count + 1
}, (_, index) => fn(index / count));
const HEART: SketchStroke[] = [{
  id: "heart" as const,
  tool: "marker" as const,
  color: "bubblegum" as const,
  size: 1.2,
  pts: STEP(40, t => {
    const a = t * Math.PI * 2 - Math.PI / 2;
    return [220 + 16 * Math.pow(Math.sin(a), 3) * 6.4, 150 - (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * 6.4];
  })
}, {
  id: "arrow" as const,
  tool: "felt" as const,
  color: "ink" as const,
  size: 1,
  pts: STEP(12, t => [70 + t * 300, 240 - t * 170])
}, {
  id: "head" as const,
  tool: "felt" as const,
  color: "ink" as const,
  size: 1,
  pts: [[336, 70], [372, 68], [366, 102]]
}, {
  id: "note" as const,
  tool: "brush" as const,
  color: "ink-you" as const,
  size: 0.9,
  pts: STEP(30, t => [90 + t * 250, 268 + Math.sin(t * 16) * 9 * (1 - t / 2)])
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const api = shallowRef<SketchpadHandle | null>(null);
  return () => {
    return <div class="flex w-full max-w-lg flex-col items-start gap-3">
      <Sketchpad readOnly replay apiRef={api} width={440} height={320} defaultValue={HEART} />
      <Button variant="outline" size="sm" onClick={() => api.value?.replay()}>
        Draw it again
      </Button>
    </div>;
  };
});
export default Example;
