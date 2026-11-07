// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { CodeBlock } from "@/components/ui/code-block";
export const meta = {
  title: "A diff" as const,
  description: "Removed lines are struck through in red pencil, added lines are ticked in green, and the header counts them. Copy puts the result on the clipboard." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const PATCH = `-const shown = notes;
+const shown = picked.size
+  ? notes.filter((n) => picked.has(n.tag))
+  : notes;
 export const count = shown.length;
-export const label = "all";
+export const label = picked.size ? "filtered" : "all";`;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <CodeBlock diff code={PATCH} language="ts" filename="src/notes/filter.ts" lineNumbers class="mx-auto w-full max-w-xl" seed="diff" />;
  };
});
export default Example;
