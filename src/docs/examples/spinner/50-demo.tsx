// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
export const meta = {
  title: "Demo" as const,
  description: "Official `spinner-demo`: a muted row that reads \"Processing payment...\" with a spinner as its media and the amount at the end. The scribble is a hand-wound spiral whose line is drawn and undrawn round and round; with reduced motion it stands still, whole." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex w-full max-w-xs flex-col gap-4">
      <Item variant="muted">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle class="line-clamp-1">Processing payment...</ItemTitle>
        </ItemContent>
        <ItemContent class="flex-none justify-end">
          <span class="text-sm tabular-nums">$100.00</span>
        </ItemContent>
      </Item>
    </div>;
  };
});
export default Example;
