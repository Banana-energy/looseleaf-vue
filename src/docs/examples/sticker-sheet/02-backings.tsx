// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { StickerSheet } from "@/components/ui/sticker-sheet";
export const meta = {
  title: "Backing paper and size" as const,
  description: "The backing is release paper with a sheen (glassine, the default), kraft or plain paper. Columns and size set the grid; shorthand `stickers` skips the items when you do not need labels or ids." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-start justify-center gap-8">
      <StickerSheet title="Badges" columns={3} size={64} stickers={["wip", "new", "beta", "pro", "ok", "wow"]} defaultPeeled={["beta"]} />
      <StickerSheet title="Kraft" backing="kraft" columns={3} size={64} stickers={["rocket", "cloud-smile", "sun-shades", "done", "rainbow", "sale"]} />
      <StickerSheet title="Plain" backing="paper" columns={2} size={80} stickers={["first-place", "number-one", "a-plus", "hundred"]} />
    </div>;
  };
});
export default Example;
