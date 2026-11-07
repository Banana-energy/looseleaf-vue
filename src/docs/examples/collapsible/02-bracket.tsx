// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleIndicator, CollapsibleTrigger } from "@/components/ui/collapsible";
export const meta = {
  title: "Margin bracket and indicator" as const,
  description: "`bracket` writes a brace beside the opened text and lets it soak in; `CollapsibleIndicator` is the same chevron as the accordion's and turns over with the panel." as const,
  layout: "center" as const,
  height: 260
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Collapsible defaultOpen class="w-full max-w-sm">
      <CollapsibleTrigger asChild>
        <Button variant="link" class="px-0">
          What is in the box?
          <CollapsibleIndicator />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent bracket="curly" class="pt-2 text-sm text-muted-foreground">
        <p>One pencil stub, sharpened crooked. Three felt tips that still work. A yellow highlighter, half dry.</p>
        <p class="mt-2">A ruler with a chip out of the end.</p>
      </CollapsibleContent>
    </Collapsible>;
  };
});
export default Example;
