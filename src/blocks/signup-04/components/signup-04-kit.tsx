// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
import { StickerSheet } from "@/components/ui/sticker-sheet";
const KIT = ["rocket", "cactus", "sun-shades", "coffee-to-go", "cat-loaf", "party-popper", "rainbow", "thumbs-up", "donut"];
const SignupKit = defineUi<{}>("SignupKit", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="kraft" tilt={false} shadow="none" seed="signup-04-kraft" class="absolute inset-0 flex flex-col items-center justify-center gap-5 p-4 text-center">
      <div>
        <p class="font-script text-[2.25rem] leading-none font-bold text-ink">your welcome kit</p>
        <p class="mt-1 text-sm text-ink-soft">Peel one off. It is yours to keep.</p>
      </div>
      <StickerSheet title="Welcome kit" stickers={KIT} columns={3} size={60} seed="signup-04-sheet" />
    </Paper>;
  };
});
export { SignupKit };
