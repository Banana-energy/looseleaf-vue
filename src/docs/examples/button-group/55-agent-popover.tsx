// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
export const meta = {
  title: "A button that opens a popover" as const,
  description: "The chevron half of a split button can open anything, not only a menu: here a slip with a text area and a few lines of explanation. The popover is named with aria-label (Reka UI gives it role=dialog), and focus goes back to the chevron when it closes." as const,
  layout: "stack" as const,
  height: 440
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <ButtonGroup aria-label="Copilot">
      <Button variant="outline">
        <Icon name="bot" /> Copilot
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open the task popover">
            <Icon name="chevron-down" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" class="w-80 p-0 text-sm" aria-label="Agent tasks" seed="copilot">
          <div class="px-4 py-3">
            <div class="font-bold">Agent tasks</div>
          </div>
          <Separator />
          <div class="grid gap-2 p-4">
            <Textarea placeholder="Describe your task in natural language." aria-label="Task" class="mb-2 resize-none" />
            <p class="font-bold">Start a new task with Copilot</p>
            <p class="text-muted-foreground">
              Describe your task in natural language. Copilot will work in the background and open a pull request for your review.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </ButtonGroup>;
  };
});
export default Example;
