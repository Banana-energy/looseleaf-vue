// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export const meta = {
  title: "Delays and shortcut hints" as const,
  description: "A per-tooltip delayDuration overrides the provider's: instant for a quick label, patient for an explanation. A shortcut hint sits in the note in the mono font." as const,
  layout: "center" as const,
  height: 240
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <TooltipProvider delayDuration={500}>
      <div class="flex flex-wrap items-center justify-center gap-4 pt-10">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Search">
              <Icon name="search" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Instant: Search</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Copy">
              <Icon name="copy" />
            </Button>
          </TooltipTrigger>
          <TooltipContent class="flex items-center gap-2">
            Copy
            <span class="font-mono text-xs opacity-70">⌘C</span>
          </TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <Button variant="outline">Sync now</Button>
          </TooltipTrigger>
          <TooltipContent class="max-w-56">Patient: sends every unsaved page to the cloud and waits for the answer.</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>;
  };
});
export default Example;
