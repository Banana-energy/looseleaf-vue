// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { Toggle } from "@/components/ui/toggle";
export const meta = {
  title: "Variants" as const,
  description: "Default is a whisper of pencil that becomes a highlighted, boxed button when it is on. Outline keeps its ink box the whole time. Icon-only toggles need an aria-label." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-col gap-5">
      <div class="flex flex-wrap items-center gap-4">
        <Toggle aria-label="Show hidden pages">
          <Icon name="eye" />
        </Toggle>
        <Toggle aria-label="Show hidden pages, on" defaultPressed>
          <Icon name="eye" />
        </Toggle>
        <Toggle>
          <Icon name="bell" />
          Watch
        </Toggle>
        <Toggle defaultPressed>
          <Icon name="bell" />
          Watching
        </Toggle>
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <Toggle variant="outline" aria-label="Show hidden pages">
          <Icon name="eye" />
        </Toggle>
        <Toggle variant="outline" aria-label="Show hidden pages, on" defaultPressed>
          <Icon name="eye" />
        </Toggle>
        <Toggle variant="outline">
          <Icon name="bell" />
          Watch
        </Toggle>
        <Toggle variant="outline" defaultPressed>
          <Icon name="bell" />
          Watching
        </Toggle>
      </div>
    </div>;
  };
});
export default Example;
