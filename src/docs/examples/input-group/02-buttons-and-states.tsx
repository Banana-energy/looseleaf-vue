// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
export const meta = {
  title: "Buttons and states" as const,
  description: "Buttons go inside an addon (ghost, xs by default). The control's own state paints the group: aria-invalid draws the red box, disabled the dashed one, and `data-disabled` on the group disables it as a whole." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const copied = shallowRef(initialState(false));
  const setCopied = stateSetter(copied);
  return () => {
    return <div class="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupInput defaultValue="https://looseleaf.dev/r/field-notes" readonly aria-label="Share link" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Copy link" title="Copy" size="icon-xs" onClick={() => setCopied(true)}>
            <Icon name={copied.value ? "check" as const : "copy" as const} />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <Icon name="mail" />
        </InputGroupAddon>
        <InputGroupInput type="email" defaultValue="not-an-email" aria-invalid="true" aria-label="Email" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <Icon name="lock" />
        </InputGroupAddon>
        <InputGroupInput defaultValue="locked by your admin" disabled aria-label="Locked" />
      </InputGroup>
      <InputGroup data-disabled="true">
        <InputGroupInput placeholder="A group can be disabled as a whole" disabled aria-label="Disabled group" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton disabled variant="secondary">
            Send
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>;
  };
});
export default Example;
