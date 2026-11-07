// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
export const meta = {
  title: "Custom control" as const,
  description: "shadcn's `input-group-custom`: any control can be the group's field if it carries `data-slot=\"input-group-control\"`. The original uses native textarea; this one is a plain textarea with `field-sizing: content`, which grows with the text without a package." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-sm gap-6">
      <InputGroup>
        <textarea data-slot="input-group-control" aria-label="Autoresize textarea" class="flex field-sizing-content min-h-16 w-full resize-none bg-transparent px-3 py-2.5 text-base outline-none md:text-sm" placeholder="Autoresize textarea..." />
        <InputGroupAddon align="block-end">
          <InputGroupButton class="ms-auto" size="sm" variant="default">
            Submit
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>;
  };
});
export default Example;
