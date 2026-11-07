// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export const meta = {
  title: "Four groups" as const,
  description: "shadcn's `input-group-demo`: a search with a result count, a URL with a prefix and a tooltip button, a prompt box with a menu and a send button, and a field with a verified badge. The badge is a drawn `badge-check` where the original has a filled circle." as const,
  layout: "center" as const,
  height: 480
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <TooltipProvider>
      <div class="grid w-full max-w-sm gap-6">
        <InputGroup>
          <InputGroupInput placeholder="Search..." aria-label="Search" />
          <InputGroupAddon>
            <Icon name="search" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="example.com" class="ps-1!" aria-label="Website" />
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton class="rounded-full" size="icon-xs" aria-label="Info">
                  <Icon name="info" />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupTextarea placeholder="Ask, Search or Chat..." aria-label="Prompt" />
          <InputGroupAddon align="block-end">
            <InputGroupButton variant="outline" class="rounded-full" size="icon-xs" aria-label="Add">
              <Icon name="plus" />
            </InputGroupButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton variant="ghost">Auto</InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start">
                <DropdownMenuItem>Auto</DropdownMenuItem>
                <DropdownMenuItem>Agent</DropdownMenuItem>
                <DropdownMenuItem>Manual</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <InputGroupText class="ms-auto">52% used</InputGroupText>
            <Separator orientation="vertical" class="h-4!" />
            <InputGroupButton variant="default" class="rounded-full" size="icon-xs" disabled>
              <Icon name="arrow-up" />
              <span class="sr-only">Send</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="@shadcn" aria-label="Handle" />
          <InputGroupAddon align="inline-end">
            <Icon name="badge-check" label="Verified" />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </TooltipProvider>;
  };
});
export default Example;
