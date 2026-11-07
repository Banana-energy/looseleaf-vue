// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Arrow } from "@/components/ui/arrow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export const meta = {
  title: "With a label" as const,
  description: "Text inside an Arrow is its label: real handwritten text, placed outside the tail on the side the arrow leaves from. Here it leaves the note at the top right and lands on the signature line." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 300
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="relative w-full max-w-sm pe-32">
      <Card tilt>
        <CardHeader>
          <CardTitle class="font-script text-2xl">Guest book</CardTitle>
          <CardDescription>Sign on the line</CardDescription>
        </CardHeader>
        <CardContent class="h-10 border-b border-dashed border-pencil-mark" />
      </Card>
      <Arrow direction="down-left" curve="curved" tone="blue" bend="up" class="absolute end-20 bottom-8 h-20 w-24">
        your name
      </Arrow>
    </div>;
  };
});
export default Example;
