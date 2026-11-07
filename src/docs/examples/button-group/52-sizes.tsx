// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Sizes" as const,
  description: "A group takes the size of its buttons: give every child the same `size` and the same height, and use the matching square size (`icon-sm`, `icon`, `icon-lg`) for the icon button at the end. Extra small is ours." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-col items-start gap-8">
      <ButtonGroup aria-label="Extra small">
        <Button variant="outline" size="xs">
          Extra small
        </Button>
        <Button variant="outline" size="xs">
          Button
        </Button>
        <Button variant="outline" size="xs">
          Group
        </Button>
        <Button variant="outline" size="icon-xs" aria-label="Add">
          <Icon name="plus" />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Small">
        <Button variant="outline" size="sm">
          Small
        </Button>
        <Button variant="outline" size="sm">
          Button
        </Button>
        <Button variant="outline" size="sm">
          Group
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Add">
          <Icon name="plus" />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Default">
        <Button variant="outline">Default</Button>
        <Button variant="outline">Button</Button>
        <Button variant="outline">Group</Button>
        <Button variant="outline" size="icon" aria-label="Add">
          <Icon name="plus" />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Large">
        <Button variant="outline" size="lg">
          Large
        </Button>
        <Button variant="outline" size="lg">
          Button
        </Button>
        <Button variant="outline" size="lg">
          Group
        </Button>
        <Button variant="outline" size="icon-lg" aria-label="Add">
          <Icon name="plus" size={20} />
        </Button>
      </ButtonGroup>
    </div>;
  };
});
export default Example;
