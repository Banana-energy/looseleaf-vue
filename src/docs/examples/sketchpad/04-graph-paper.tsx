// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { type SketchStroke, Sketchpad, SketchpadCanvas, SketchpadClear, SketchpadColors, SketchpadRedo, SketchpadSizes, SketchpadToolbar, SketchpadTools, SketchpadUndo } from "@/components/ui/sketchpad";
export const meta = {
  title: "Your own toolbar" as const,
  description: "The parts compose. A pencil-and-eraser sketchbook on graph paper, four colors, taped to the desk, with a plot already begun." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const along = (n: number, f: (t: number) => [number, number]): [number, number][] => Array.from({
  length: n + 1
}, (_, i) => f(i / n)).map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
const dot = (id: string, cx: number, cy: number): SketchStroke => ({
  id,
  tool: "felt" as const,
  color: "red" as const,
  size: 1.9,
  pts: along(10, t => [cx + 2.6 * Math.cos(t * Math.PI * 2), cy + 2.6 * Math.sin(t * Math.PI * 2)])
});
const PLOT: SketchStroke[] = [{
  id: "axis-y" as const,
  tool: "pencil" as const,
  color: "ink" as const,
  size: 1,
  pts: [[58, 36], [58, 168], [59, 300]]
}, {
  id: "axis-x" as const,
  tool: "pencil" as const,
  color: "ink" as const,
  size: 1,
  pts: [[58, 300], [270, 301], [486, 300]]
}, {
  id: "arrow-y" as const,
  tool: "pencil" as const,
  color: "ink" as const,
  size: 1,
  pts: [[49, 50], [58, 34], [67, 50]]
}, {
  id: "arrow-x" as const,
  tool: "pencil" as const,
  color: "ink" as const,
  size: 1,
  pts: [[470, 291], [488, 300], [470, 309]]
}, {
  id: "curve" as const,
  tool: "felt" as const,
  color: "ink-you" as const,
  size: 1,
  pts: along(48, t => [58 + t * 400, 300 - 232 * (1 - Math.pow(1 - t, 2.2)) - Math.sin(t * 19) * 3])
}, dot("d1", 98, 252), dot("d2", 178, 174), dot("d3", 298, 99), dot("d4", 418, 70)];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Sketchpad class="max-w-2xl" tools={["pencil", "felt", "eraser"]} defaultTool="pencil" width={520} height={340} defaultValue={PLOT}>
      <SketchpadToolbar class="justify-between">
        <SketchpadTools />
        <SketchpadColors colors={["ink", "ink-you", "red", "green"]} />
        <SketchpadSizes />
        <span class="flex items-center gap-2">
          <SketchpadUndo />
          <SketchpadRedo />
          <SketchpadClear>Wipe</SketchpadClear>
        </span>
      </SketchpadToolbar>
      <SketchpadCanvas paper="graph" label="Sketchbook page" paperProps={{
        tape: "both" as const,
        tapeKind: "washi-dots" as const
      }} />
    </Sketchpad>;
  };
});
export default Example;
