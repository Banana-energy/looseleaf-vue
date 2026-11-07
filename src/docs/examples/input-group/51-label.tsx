// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export const meta = {
  title: "Labels" as const,
  description: "shadcn's `input-group-label`: a Label can be an addon, so the @ in front of a handle is a real label for the field, or a title above it (`block-start`) with a help button at the far end." as const,
  layout: "center" as const,
  height: 300
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <TooltipProvider>
      <div class="grid w-full max-w-sm gap-4">
        <InputGroup>
          <InputGroupInput id="input-group-label-handle" placeholder="shadcn" />
          <InputGroupAddon>
            <Label for="input-group-label-handle">@</Label>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput id="input-group-label-email" placeholder="ada@looseleaf.example" />
          <InputGroupAddon align="block-start">
            <Label for="input-group-label-email" class="text-foreground">
              Email
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton variant="ghost" aria-label="Help" class="ms-auto rounded-full" size="icon-xs">
                  <Icon name="info" />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>We&apos;ll use this to send you notifications</p>
              </TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </TooltipProvider>;
  };
});
export default Example;
