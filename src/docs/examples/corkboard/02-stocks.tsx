// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Corkboard, CorkboardNote } from "@/components/ui/corkboard";
import { StickyNote } from "@/components/ui/sticky-note";
export const meta = {
  title: "Any paper" as const,
  description: "A note is a Paper: sticky notes, an index card with a list, a kraft tag, a photo. With bare, any paper object of the library can be the note. Same drag, same keys." as const,
  layout: "stack" as const,
  height: 420,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Corkboard class="h-[420px] max-w-3xl" label="Ideas">
      <CorkboardNote id="list" x={20} y={24} stock="index-card" class="w-56" label="Ideas list" pinColor="grass">
        <p class="font-bold">ideas</p>
        <p>1. a thing that boils</p>
        <p>2. a thing that tears</p>
      </CorkboardNote>
      <CorkboardNote id="tag" x={270} y={40} stock="kraft" class="w-40" rotate={-4} pinColor="tomato">
        fragile, hand-drawn
      </CorkboardNote>
      <CorkboardNote id="photo" x={24} y={236} stock="photo" class="w-44" rotate={3} pinColor="sky">
        summer, 1987
      </CorkboardNote>
      <CorkboardNote id="sticky" x={270} y={210} bare rotate={1.5} pinColor="grape" label="Sticky note">
        <StickyNote color="orange" curl tilt={false} class="w-40 p-4 font-script text-xl">
          pick me up: a real StickyNote
        </StickyNote>
      </CorkboardNote>
    </Corkboard>;
  };
});
export default Example;
