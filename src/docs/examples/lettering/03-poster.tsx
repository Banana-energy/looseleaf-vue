// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Lettering } from "@/components/ui/lettering";
import { Paper } from "@/components/ui/paper";
import { Sticker } from "@/components/ui/sticker";
export const meta = {
  title: "A poster" as const,
  description: "Hero lettering, a lead line and a sticker on a sheet of paper." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 320
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="paper" tilt tape="both" seed="poster" class="relative w-full max-w-xl px-8 pt-9 pb-8">
      <Lettering as="h2" size="xl" tone="marker" wobble={0.6}>
        Paper Club
      </Lettering>
      <p class="mt-4 max-w-sm text-lg text-ink-soft">Third Thursday of the month. Bring something you wrote on the back of something else.</p>
      <Sticker name="wow" size={80} rotate={12} class="absolute end-6 bottom-4" />
    </Paper>;
  };
});
export default Example;
