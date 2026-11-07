// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Mascot } from "@/components/ui/mascot";
import { Stamp } from "@/components/ui/stamp";
const Footer01Brand = defineUi<{}>("Footer01Brand", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-start gap-x-6 gap-y-4 @3xl:flex-col">
      <div class="max-w-xs">
        <a href="#top" class="flex items-center gap-2 font-script text-4xl leading-none font-bold text-ink">
          <Mascot pose="idle" size={40} />
          penmark
        </a>
        <p class="mt-3 text-base/7 text-ink">Notes and tasks for small teams, drawn by hand in Lisbon and kept in a drawer in Porto.</p>
      </div>
      <Stamp shape="round" text="hand made" ring="PENMARK * DRAWN IN LISBON *" ink="ink-you" size={112} tilt={-9} seed="footer-stamp" label="Stamp: hand made, drawn in Lisbon" />
    </div>;
  };
});
export { Footer01Brand };
