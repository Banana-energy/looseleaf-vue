// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
export const meta = {
  title: "As a link" as const,
  description: "asChild draws the button on your own element. The drawing lands inside the anchor; a disabled link is announced as disabled and cannot be followed." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center gap-4">
      <Button asChild>
        <a href="https://example.com/notebook" target="_blank" rel="noreferrer">
          Open the notebook
        </a>
      </Button>
      <Button asChild variant="outline">
        <a href="https://example.com/pricing" target="_blank" rel="noreferrer">
          Pricing
        </a>
      </Button>
      <Button asChild variant="link">
        <a href="https://example.com/docs" target="_blank" rel="noreferrer">
          Read the docs
        </a>
      </Button>
      <Button asChild disabled variant="secondary">
        <a href="https://example.com/soon">Coming soon</a>
      </Button>
    </div>;
  };
});
export default Example;
