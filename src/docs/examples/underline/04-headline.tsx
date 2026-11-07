// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Underline } from "@/components/ui/underline";
export const meta = {
  title: "Under a headline" as const,
  description: "A double brush line under a title, a wavy pencil line under a caption: the pen grows with the type." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card class="w-full max-w-md" tilt>
      <CardHeader>
        <CardTitle class="font-script text-4xl leading-tight">
          <Underline kind="double" weight="brush" tone="blue">
            Spring reading list
          </Underline>
        </CardTitle>
      </CardHeader>
      <CardContent class="grid gap-2 text-[17px] leading-[1.55]">
        <p>
          Three books for the <Underline kind="wavy" tone="pencil">slow weeks</Underline>: a novel, a field guide and something with pictures.
        </p>
      </CardContent>
    </Card>;
  };
});
export default Example;
