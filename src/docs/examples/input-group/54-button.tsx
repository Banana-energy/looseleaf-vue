// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
export const meta = {
  title: "Buttons" as const,
  description: "shadcn's `input-group-button`: a copy button that turns into a tick, a popover from the button in the leading addon (the button is the trigger, so it is the thing that says it is expanded), a star that toggles, and a text button that ends the box. The original's `useCopyToClipboard` hook is a few lines of state here." as const,
  layout: "center" as const,
  height: 340
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const isCopied = shallowRef(initialState(false));
  const setIsCopied = stateSetter(isCopied);
  const isFavorite = shallowRef(initialState(false));
  const setIsFavorite = stateSetter(isFavorite);
  return () => {
    function copyToClipboard(text: string) {
      void navigator.clipboard?.writeText(text);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2000);
    }
    return <div class="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput placeholder="https://x.com/shadcn" readonly aria-label="Profile link" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Copy" title="Copy" size="icon-xs" onClick={() => copyToClipboard("https://x.com/shadcn")}>
            {isCopied.value ? <Icon name="check" /> : <Icon name="copy" />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <Popover>
            <PopoverTrigger asChild>
              <InputGroupButton variant="secondary" size="icon-xs" aria-label="Connection details">
                <Icon name="info" />
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent align="start" aria-label="Connection details" class="flex flex-col gap-1 text-sm">
              <p class="font-medium">Your connection is not secure.</p>
              <p>You should not enter any sensitive information on this site.</p>
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
        <InputGroupAddon class="ps-1.5 text-muted-foreground">https://</InputGroupAddon>
        <InputGroupInput id="input-group-button-secure" aria-label="Address" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={() => setIsFavorite(!isFavorite.value)} size="icon-xs" aria-label="Favorite" aria-pressed={isFavorite.value}>
            <Icon name="star" data-favorite={isFavorite.value} class="data-[favorite=true]:text-link" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Type to search..." aria-label="Search" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="secondary">Search</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>;
  };
});
export default Example;
