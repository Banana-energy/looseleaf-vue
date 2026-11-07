// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Asterisk } from "@/components/ui/asterisk";
export const meta = {
  title: "Marks and pens" as const,
  description: "Asterisk, star, dagger and double dagger; red, ink, blue and pencil. Text inside comes first and the mark follows it." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid max-w-lg gap-3 text-[17px]">
      <p class="flex flex-wrap gap-x-6">
        <Asterisk>asterisk</Asterisk>
        <Asterisk mark="star">star</Asterisk>
        <Asterisk mark="dagger">dagger</Asterisk>
        <Asterisk mark="double-dagger">double dagger</Asterisk>
      </p>
      <p class="flex flex-wrap gap-x-6">
        <Asterisk tone="red">red</Asterisk>
        <Asterisk tone="ink">ink</Asterisk>
        <Asterisk tone="blue">blue</Asterisk>
        <Asterisk tone="pencil">pencil</Asterisk>
      </p>
    </div>;
  };
});
export default Example;
