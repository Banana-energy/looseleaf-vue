// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Dropzone } from "@/components/ui/dropzone";
export const meta = {
  title: "Drop or browse" as const,
  description: "Drag files over it (Stubby comes out with a sheet of paper), drop them, or click / Tab and press Enter to browse. Pick something that is not an image, or bigger than 2 MB, or a fifth file, and the reason appears in red." as const,
  layout: "center" as const,
  height: 480
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="w-full max-w-lg">
      <Dropzone accept="image/*" maxSize={2 * 1024 * 1024} maxFiles={4} />
    </div>;
  };
});
export default Example;
