// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Notebook, NotebookPage, NotebookTitle } from "@/components/ui/notebook";
import { Sticker } from "@/components/ui/sticker";
export const meta = {
  title: "A packing list" as const,
  description: "A real notebook page: one checkbox per ruled line (each row is exactly 28 px, so the boxes and words sit on the lines), and a sticker stuck to the corner." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const items = ["Passport, tickets, the good pen", "Waterproof notebook", "Two rolls of washi tape", "Tea (a lot)", "The very small pencil"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Notebook as="section" binding="rings" pages={3} seed="trip" class="mx-auto min-h-[24rem] w-full max-w-md" aria-label="Packing list">
      <Sticker name="done" size={64} rotate={10} class="absolute -top-4 -right-3 z-10" />
      <NotebookPage>
        <NotebookTitle>Packing list</NotebookTitle>
        {items.map((item, i) => <div key={item} class="flex h-7 items-center gap-3">
            <Checkbox id={`pack-${i}`} defaultChecked={i < 2} />
            <Label for={`pack-${i}`} class="text-[17px] leading-7 font-normal">
              {item}
            </Label>
          </div>)}
      </NotebookPage>
    </Notebook>;
  };
});
export default Example;
