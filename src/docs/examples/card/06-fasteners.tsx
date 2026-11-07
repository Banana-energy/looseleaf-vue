// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export const meta = {
  title: "Pinned, clipped, stapled" as const,
  description: "The `fastener` slot holds a card down. Calm density hides every prop, so a dense dashboard keeps its plain sheets." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-auto grid max-w-2xl gap-x-9 gap-y-14 p-6 pt-12 sm:grid-cols-2">
      {(["pin", "clip", "staple", "binder-clip"] as const).map(fastener => <Card key={fastener} fastener={fastener} seed={fastener} class="gap-2 pt-12 pb-6">
          <CardHeader>
            <CardTitle>{fastener}</CardTitle>
          </CardHeader>
          <CardContent class="text-sm">held with a {fastener.replace("-", " ")}</CardContent>
        </Card>)}
    </div>;
  };
});
export default Example;
