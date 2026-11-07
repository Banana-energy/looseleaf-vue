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
  title: "A row of buttons" as const,
  description: "Outline buttons side by side share their seams: the edge between two of them is drawn once. Icon buttons, and a column, work the same way." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-start gap-x-10 gap-y-6">
      <ButtonGroup aria-label="Range">
        <Button variant="outline">Years</Button>
        <Button variant="outline">Months</Button>
        <Button variant="outline">Days</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Page">
        <Button variant="outline" size="icon" aria-label="Previous">
          <Icon name="chevron-left" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Search">
          <Icon name="search" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Next">
          <Icon name="chevron-right" />
        </Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical" aria-label="Zoom">
        <Button variant="outline" size="icon" aria-label="Zoom in">
          <Icon name="plus" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Zoom out">
          <Icon name="minus" />
        </Button>
      </ButtonGroup>
    </div>;
  };
});
export default Example;
