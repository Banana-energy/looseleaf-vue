// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Sketchpad, type SketchStroke } from "@/components/ui/sketchpad";
export const meta = {
  title: "Every pen" as const,
  description: "Felt, brush, pencil, marker and highlighter on one page. Same points, five materials: the grain and the blend come from the pen, not from the data." as const,
  layout: "stack" as const
};
const TOOLS = [{
  tool: "felt" as const,
  color: "ink" as const
}, {
  tool: "brush" as const,
  color: "ink-you" as const
}, {
  tool: "pencil" as const,
  color: "ink" as const
}, {
  tool: "marker" as const,
  color: "tangerine" as const
}, {
  tool: "highlighter" as const,
  color: "hi" as const
}] as const;
const PAGE: SketchStroke[] = TOOLS.map((t, row) => ({
  id: t.tool,
  tool: t.tool,
  color: t.color,
  size: 1,
  pts: Array.from({
    length: 112
  }, (_, i): [number, number, number] => {
    const a = i * 0.62;
    return [34 + i * 5.2 + 10 * Math.cos(a), 52 + row * 62 + 13 * Math.sin(a) - 4 * Math.sin(i / 9), 0.55 + 0.4 * Math.cos(a)];
  })
}));
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Sketchpad readOnly width={640} height={330} class="max-w-2xl" defaultValue={PAGE} />;
  };
});
export default Example;
