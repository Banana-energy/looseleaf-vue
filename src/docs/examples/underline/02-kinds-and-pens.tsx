// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Underline } from "@/components/ui/underline";
export const meta = {
  title: "Kinds and pens" as const,
  description: "Single, double, wavy and scribbled lines; felt, blue felt, red felt, pencil and marker; fine, regular and brush." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid max-w-lg gap-4 text-[17px] leading-[1.55]">
      <p>
        <Underline>single</Underline>, <Underline kind="double">double</Underline>, <Underline kind="wavy" tone="blue">wavy</Underline>, and a{" "}
        <Underline kind="scribble" tone="red">quick scribble</Underline>.
      </p>
      <p>
        <Underline tone="blue">blue felt</Underline>, <Underline tone="red">red felt</Underline>, <Underline tone="green">green felt</Underline>,{" "}
        <Underline tone="pencil">soft pencil</Underline> and <Underline tone="marker">marker</Underline>.
      </p>
      <p>
        <Underline weight="fine">fine-liner</Underline>, <Underline>felt tip</Underline>, <Underline weight="brush" tone="blue">brush pen</Underline>.
      </p>
    </div>;
  };
});
export default Example;
