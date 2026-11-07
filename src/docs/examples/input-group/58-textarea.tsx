// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
export const meta = {
  title: "Textarea with header and footer" as const,
  description: "shadcn's `input-group-textarea`: a code box with a file name and two icon buttons above (`block-start` plus `border-b`) and a cursor position and a Run button below. The corner-down-left glyph is not drawn yet, so Run wears a play icon." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-md gap-4">
      <InputGroup>
        <InputGroupTextarea id="input-group-textarea-code" placeholder="console.log('Hello, world!');" class="min-h-[200px]" aria-label="Code" />
        <InputGroupAddon align="block-end" class="border-t">
          <InputGroupText>Line 1, Column 1</InputGroupText>
          <InputGroupButton size="sm" class="ms-auto" variant="default">
            Run <Icon name="play" />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupAddon align="block-start" class="border-b">
          <InputGroupText class="font-mono font-medium">
            <Icon name="file-code" />
            script.js
          </InputGroupText>
          <InputGroupButton class="ms-auto" size="icon-xs" aria-label="Refresh">
            <Icon name="rotate-cw" />
          </InputGroupButton>
          <InputGroupButton variant="ghost" size="icon-xs" aria-label="Copy">
            <Icon name="copy" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>;
  };
});
export default Example;
