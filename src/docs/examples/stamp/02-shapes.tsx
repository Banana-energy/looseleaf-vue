// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Stamp } from "@/components/ui/stamp";
export const meta = {
  title: "Shapes and inks" as const,
  description: "A box, a ring with rim text, a twelve-point seal, and big diagonal letters. Pad inks are red, blue felt, green or ink, never a stationery accent." as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center gap-8">
      <Stamp text="Received" sub="Mar 14 2026" ink="ink-you" h={72} />
      <Stamp text="Members" shape="round" ring="MEMBERS - EST 2026 -" ink="ink-you" size={96} />
      <Stamp text="New" shape="burst" sub="issue" ink="ink" size={96} />
      <Stamp text="Void" shape="void" ink="red" w={160} h={64} />
    </div>;
  };
});
export default Example;
