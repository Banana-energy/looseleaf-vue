// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "UI and doodle tone" as const,
  description: "In UI tone an icon is ink only. In doodle tone its accent wash shows, and `accent` picks another color." as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-col gap-4 text-ink">
      <div class="flex items-center gap-5">
        <span class="w-16 text-sm text-pencil-text">ui</span>
        {["triangle-alert", "info", "bell", "search", "user", "calendar", "circle-check"].map(name => <Icon key={name} name={name} size={32} />)}
      </div>
      <div class="flex items-center gap-5">
        <span class="w-16 text-sm text-pencil-text">doodle</span>
        {["triangle-alert", "info", "bell", "search", "user", "calendar", "circle-check"].map(name => <Icon key={name} name={name} size={32} tone="doodle" />)}
      </div>
      <div class="flex items-center gap-5">
        <span class="w-16 text-sm text-pencil-text">accent</span>
        {(["tomato", "tangerine", "grass", "teal", "sky", "grape", "bubblegum"] as const).map(accent => <Icon key={accent} name="bell" size={32} tone="doodle" accent={accent} />)}
      </div>
    </div>;
  };
});
export default Example;
