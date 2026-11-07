// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "With an icon" as const,
  description: "Icons sit before or after the label. Button tightens its padding when it sees one, sizes the pencilled icon to 16 px (12 px in xs) and keeps the drawing behind both." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center gap-4">
      <Button>
        <Icon name="plus" /> New note
      </Button>
      <Button variant="outline">
        <Icon name="search" /> Search
      </Button>
      <Button variant="secondary">
        Next <Icon name="arrow-right" />
      </Button>
      <Button variant="outline" size="lg">
        <Icon name="trash" /> Discard
      </Button>
      <Button variant="ghost" size="sm">
        <Icon name="copy" /> Copy link
      </Button>
      <Button variant="outline" size="xs">
        <Icon name="pencil" size={12} /> Edit
      </Button>
      <Button variant="link">
        Read more <Icon name="arrow-up-right" />
      </Button>
    </div>;
  };
});
export default Example;
