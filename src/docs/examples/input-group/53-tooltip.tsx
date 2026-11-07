// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export const meta = {
  title: "Tooltips" as const,
  description: "shadcn's `input-group-tooltip`: help buttons that explain themselves. Two sit at the end as ghost icon buttons; in the third the note opens to the left (`side=\"left\"`), on the leading addon. The original makes the addon itself the trigger; here the button inside it is, so the tooltip is tied to the control that has focus." as const,
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
          <InputGroupInput placeholder="Enter password" type="password" aria-label="Password" />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton variant="ghost" aria-label="Info" size="icon-xs">
                  <Icon name="info" />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Password must be at least 8 characters</p>
              </TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="Your email address" aria-label="Email address" />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton variant="ghost" aria-label="Help" size="icon-xs">
                  <Icon name="circle-question-mark" />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>We&apos;ll use this to send you notifications</p>
              </TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="Enter API key" aria-label="API key" />
          <InputGroupAddon>
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton variant="ghost" aria-label="Help" size="icon-xs">
                  <Icon name="circle-question-mark" />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Click for help with API keys</p>
              </TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </TooltipProvider>;
  };
});
export default Example;
