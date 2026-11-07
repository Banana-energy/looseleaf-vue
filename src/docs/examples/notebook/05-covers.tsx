// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { NotebookCover, NotebookCoverLabel } from "@/components/ui/notebook";
export const meta = {
  title: "On the shelf" as const,
  description: "The closed notebook: cloth over board, a darker spine stitched to it, an elastic band, and a paper label. Any stationery color, or black." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const shelf = [{
  tone: "tomato" as const,
  name: "Field notes" as const
}, {
  tone: "teal" as const,
  name: "Recipes" as const
}, {
  tone: "sky" as const,
  name: "Sketches" as const
}, {
  tone: "grape" as const,
  name: "Letters" as const,
  band: false
}, {
  tone: "ink" as const,
  name: "Accounts" as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap justify-center gap-x-6 gap-y-8 p-2">
      {shelf.map(n => <NotebookCover key={n.name} tone={n.tone} band={"band" in n ? n.band : true} seed={n.name} role="group" aria-label={`${n.name} notebook`}>
          <NotebookCoverLabel>{n.name}</NotebookCoverLabel>
        </NotebookCover>)}
    </div>;
  };
});
export default Example;
