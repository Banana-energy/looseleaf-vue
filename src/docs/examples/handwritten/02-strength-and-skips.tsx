// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Handwritten } from "@/components/ui/handwritten";
export const meta = {
  title: "Strength, and what it leaves alone" as const,
  description: "0.5, 1 and 2. Code, keys and links inside are never touched; data-handwritten=\"off\" opts anything else out." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid max-w-xl gap-4 text-[17px] leading-[1.7]">
      <Handwritten as="p" strength={0.5}>strength 0.5: barely there, a careful hand.</Handwritten>
      <Handwritten as="p" strength={1}>strength 1: the default hand, every word a hair off.</Handwritten>
      <Handwritten as="p" strength={2}>strength 2: a hurried hand, in a bus, in the rain.</Handwritten>
      <Handwritten as="p">
        Press <kbd class="font-mono text-sm">Ctrl</kbd> then run <code class="font-mono text-sm">npm test</code> or read <a href="#" class="font-bold text-link underline">the docs</a>{" "}
        <span data-handwritten="off">(these words are typeset)</span> and carry on.
      </Handwritten>
    </div>;
  };
});
export default Example;
