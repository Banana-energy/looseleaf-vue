// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { StickerSheet, StickerSheetItem } from "@/components/ui/sticker-sheet";
export const meta = {
  title: "A sheet to peel" as const,
  description: "Press a sticker (or Enter) and it lifts off, leaving its kiss-cut outline behind. Press the outline to stick it back. Hover one and its corner curls." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const NAMES = ["rocket", "cloud-smile", "sun-shades", "ringed-planet", "done", "rainbow", "first-place", "number-one", "a-plus", "hundred", "moon-sleepy", "sale"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <StickerSheet title="Sticker sheet no. 4" defaultPeeled={["done", "hundred"]}>
      {NAMES.map(name => <StickerSheetItem key={name} name={name} />)}
    </StickerSheet>;
  };
});
export default Example;
