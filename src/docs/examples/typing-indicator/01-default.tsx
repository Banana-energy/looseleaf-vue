// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { TypingIndicator } from "@/components/ui/typing-indicator";
export const meta = {
  title: "Three dots and a scrawl" as const,
  description: "The pencil writes the dots one after another, walks back and starts again. The second variant scrawls a line of cursive instead." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-start justify-center gap-x-12 gap-y-6">
      <figure class="grid justify-items-center gap-3">
        <TypingIndicator seed="dots" />
        <figcaption class="text-sm text-muted-foreground">dots</figcaption>
      </figure>
      <figure class="grid justify-items-center gap-3">
        <TypingIndicator variant="squiggle" seed="scrawl" />
        <figcaption class="text-sm text-muted-foreground">scrawl</figcaption>
      </figure>
      <figure class="grid justify-items-center gap-3">
        <TypingIndicator pen="you" pencil={false} seed="you" />
        <figcaption class="text-sm text-muted-foreground">blue felt, no pencil</figcaption>
      </figure>
    </div>;
  };
});
export default Example;
