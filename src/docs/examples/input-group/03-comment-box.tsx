// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
export const meta = {
  title: "Comment box" as const,
  description: "Block addons stack above or below a textarea inside the same drawn box: a header line on top, a counter and a send button underneath. The box grows with the text and is redrawn to fit." as const,
  layout: "stack" as const
};
const MAX = 140;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const text = shallowRef(initialState(""));
  const setText = stateSetter(text);
  return () => {
    return <InputGroup class="max-w-md">
      <InputGroupAddon align="block-start">
        <Icon name="message-square" />
        <InputGroupText>Reply to Ada</InputGroupText>
      </InputGroupAddon>
      <InputGroupTextarea placeholder="Write something kind..." aria-label="Reply" rows={3} maxlength={MAX} value={text.value} onChange={(e: Event) => setText((e.target as HTMLTextAreaElement).value)} />
      <InputGroupAddon align="block-end">
        <InputGroupText class="ll-num">
          {text.value.length}/{MAX}
        </InputGroupText>
        <InputGroupButton variant="default" size="sm" class="ms-auto" disabled={!text.value.trim()}>
          <Icon name="send" />
          Send
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>;
  };
});
export default Example;
