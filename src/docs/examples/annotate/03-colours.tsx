// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Annotate } from "@/components/ui/annotate";
export const meta = {
  title: "Colors and weights" as const,
  description: "A highlighter takes a tone; every other mark takes a pen. Fine-liner, felt tip or brush." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid max-w-lg gap-5 text-[17px] leading-[2]">
      <p class="flex flex-wrap gap-x-5 gap-y-2">
        <Annotate type="highlight" color="yellow">yellow</Annotate>
        <Annotate type="highlight" color="pink">pink</Annotate>
        <Annotate type="highlight" color="green">green</Annotate>
        <Annotate type="highlight" color="blue">blue</Annotate>
        <Annotate type="highlight" color="orange">orange</Annotate>
        <Annotate type="highlight" color="lilac">lilac</Annotate>
        <Annotate type="highlight" color="teal">teal</Annotate>
      </p>
      <p class="flex flex-wrap gap-x-6 gap-y-3 ps-1">
        <Annotate type="circle" color="ink">ink</Annotate>
        <Annotate type="circle" color="blue">blue</Annotate>
        <Annotate type="circle" color="red">red</Annotate>
        <Annotate type="circle" color="green">green</Annotate>
        <Annotate type="circle" color="pencil">pencil</Annotate>
        <Annotate type="circle" color="red" weight="brush">brush</Annotate>
      </p>
    </div>;
  };
});
export default Example;
