// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Tally } from "@/components/ui/tally";
export const meta = {
  title: "Counts, sizes and pens" as const,
  description: "Add a mark and watch the bundles build. Sizes sm, md, lg; ink, blue, red and pencil pens." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const n = shallowRef(initialState(13));
  const setN = stateSetter(n);
  return () => {
    return <div class="grid max-w-lg gap-5">
      <div class="flex items-center gap-4">
        <Button size="icon-sm" variant="outline" onClick={() => setN(v => Math.max(0, v - 1))} aria-label="One fewer">
          <Icon name="minus" />
        </Button>
        <Tally count={n.value} size="lg" />
        <Button size="icon-sm" onClick={() => setN(v => Math.min(99, v + 1))} aria-label="One more">
          <Icon name="plus" />
        </Button>
      </div>
      <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Tally count={9} size="sm" />
        <Tally count={9} tone="blue" />
        <Tally count={9} tone="red" size="lg" />
        <Tally count={9} tone="pencil" weight="fine" />
      </div>
    </div>;
  };
});
export default Example;
