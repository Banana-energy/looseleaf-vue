// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Corkboard, CorkboardNote } from "@/components/ui/corkboard";
export const meta = {
  title: "Default" as const,
  description: "Pick a note up and move it. Or focus one, then use the arrow keys, R to turn it, Enter to bring it to the front." as const,
  layout: "stack" as const,
  height: 380,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Corkboard class="h-[360px] max-w-2xl">
      <CorkboardNote id="mum" x={20} y={26}>
        Call mum about Sunday
      </CorkboardNote>
      <CorkboardNote id="ink" x={250} y={40} stock="sticky-pink" rotate={2.5}>
        Buy more ink!! (the blue felt)
      </CorkboardNote>
      <CorkboardNote id="tape" x={130} y={190} stock="sticky-green" pinned={false} rotate={-2}>
        Tape it up before Friday
      </CorkboardNote>
    </Corkboard>;
  };
});
export default Example;
