// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Doodle } from "@/components/ui/doodle";
import { Napkin, NapkinContent, NapkinFooter, NapkinTitle } from "@/components/ui/napkin";
import { Sticker } from "@/components/ui/sticker";
export const meta = {
  title: "Ideas on a napkin" as const,
  description: "Doodles and stickers go on a napkin as on any paper; here a star and a sticker beside the note." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Napkin fold="half" stain seed="idea" tilt={-1.5} class="min-h-64 w-80">
      <Doodle name="star" size={56} class="absolute end-6 top-3 z-10" />
      <NapkinTitle>The idea</NapkinTitle>
      <NapkinContent>a shop where everything is made of paper, even the till</NapkinContent>
      <NapkinFooter>(tell nobody)</NapkinFooter>
      <Sticker name="done" size={64} rotate={10} class="absolute -right-4 -bottom-4 z-10" />
    </Napkin>;
  };
});
export default Example;
