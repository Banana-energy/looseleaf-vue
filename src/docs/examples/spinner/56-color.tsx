// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Spinner } from "@/components/ui/spinner";
export const meta = {
  title: "Color" as const,
  description: "Official `spinner-color`: five 24 px spinners, each in its own text color. shadcn uses the palette's red, green, blue, yellow and purple; here they are red felt-tip, green pencil, blue biro, orange marker and grape marker (yellow highlighter is too pale to read as a line on paper)." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex items-center gap-6">
      <Spinner class="size-6 text-red" aria-label="Loading, red" />
      <Spinner class="size-6 text-green" aria-label="Loading, green" />
      <Spinner class="size-6 text-ink-you" aria-label="Loading, blue" />
      <Spinner class="size-6 text-orange-text" aria-label="Loading, orange" />
      <Spinner class="size-6 text-grape" aria-label="Loading, purple" />
    </div>;
  };
});
export default Example;
