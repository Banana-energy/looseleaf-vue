// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
export const meta = {
  title: "Icons" as const,
  description: "shadcn's `input-group-icon`: icons as addons, at the start, at the end, or two together. They are drawn glyphs, not fonts, so each one is a slightly different line." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput placeholder="Search..." aria-label="Search" />
        <InputGroupAddon>
          <Icon name="search" />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput type="email" placeholder="Enter your email" aria-label="Email" />
        <InputGroupAddon>
          <Icon name="mail" />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Card number" aria-label="Card number" />
        <InputGroupAddon>
          <Icon name="credit-card" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Icon name="check" />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Card number" aria-label="Card number, second" />
        <InputGroupAddon align="inline-end">
          <Icon name="star" />
          <Icon name="info" />
        </InputGroupAddon>
      </InputGroup>
    </div>;
  };
});
export default Example;
