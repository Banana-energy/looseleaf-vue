// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { ConfettiTrigger } from "@/components/ui/confetti";
export const meta = {
  title: "Ring, streamers, one color" as const,
  description: "spread 360 sends a ring; shapes and colors narrow the pieces. A Valentine's burst of pink dots and stars." as const,
  layout: "center" as const,
  height: 260
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center justify-center gap-4">
      <ConfettiTrigger asChild spread={360} velocity={700} count={90} shapes={["dot", "strip"]}>
        <Button variant="outline">Ring</Button>
      </ConfettiTrigger>
      <ConfettiTrigger asChild angle={60} spread={40} count={50} shapes={["curl"]} drift={120}>
        <Button variant="outline">Streamers</Button>
      </ConfettiTrigger>
      <ConfettiTrigger asChild colors={["bubblegum", "tomato"]} shapes={["dot", "star"]} count={60}>
        <Button variant="outline">Pink</Button>
      </ConfettiTrigger>
    </div>;
  };
});
export default Example;
