// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export const meta = {
  title: "A message composer (with an input group)" as const,
  description: "A plain add button, then an InputGroup with a toggle inside it: the group's own box holds the field and the voice button. Turning voice mode on disables the field and changes its prompt; the toggle is `aria-pressed` and lights up as a highlighter." as const,
  layout: "stack" as const,
  height: 200
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const voice = shallowRef(initialState(false));
  const setVoice = stateSetter(voice);
  return () => {
    return <TooltipProvider>
      <ButtonGroup class="w-full max-w-md" aria-label="New message">
        <ButtonGroup>
          <Button variant="outline" size="icon" aria-label="Attach">
            <Icon name="plus" />
          </Button>
        </ButtonGroup>
        <ButtonGroup class="flex-1">
          <InputGroup>
            <InputGroupInput placeholder={voice.value ? "Record and send audio..." as const : "Send a message..." as const} aria-label="Message" disabled={voice.value} />
            <InputGroupAddon align="inline-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton size="icon-xs" variant={voice.value ? "secondary" as const : "ghost" as const} aria-pressed={voice.value} aria-label="Voice mode" onClick={() => setVoice(!voice.value)}>
                    <Icon name="audio-lines" />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>Voice mode</TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
        </ButtonGroup>
      </ButtonGroup>
    </TooltipProvider>;
  };
});
export default Example;
