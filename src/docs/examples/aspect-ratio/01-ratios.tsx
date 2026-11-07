// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Doodle } from "@/components/ui/doodle";
export const meta = {
  title: "Ratios" as const,
  description: "The same width, four ratios: 16:9, 4:3, 1:1 and 3:4, each a small print with a white border. Change the width of the container and each box keeps its shape." as const,
  layout: "stack" as const
};
const ratios = [{
  label: "16 / 9" as const,
  ratio: 16 / 9,
  doodle: "sun" as const,
  tint: "bg-sky/40" as const,
  turn: "-rotate-1" as const
}, {
  label: "4 / 3" as const,
  ratio: 4 / 3,
  doodle: "flower" as const,
  tint: "bg-lemon/45" as const,
  turn: "rotate-1" as const
}, {
  label: "1 / 1" as const,
  ratio: 1,
  doodle: "mushroom" as const,
  tint: "bg-bubblegum/40" as const,
  turn: "-rotate-[0.6deg]" as const
}, {
  label: "3 / 4" as const,
  ratio: 3 / 4,
  doodle: "star" as const,
  tint: "bg-grass/40" as const,
  turn: "rotate-[0.8deg]" as const
}] as const;
const WINDOW = "shadow-[inset_0_2px_4px_rgb(var(--ll-shade)/0.26),inset_0_0_0_1px_rgb(var(--ll-shade)/0.12)]";
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-2xl grid-cols-2 items-end gap-x-6 gap-y-6 sm:grid-cols-4">
      {ratios.map(r => <figure key={r.label} class="flex flex-col gap-3">
          <div class={`bg-slip p-2 shadow-slip ${r.turn}`}>
            <AspectRatio ratio={r.ratio} class={`grid place-items-center overflow-hidden ${r.tint} ${WINDOW}`}>
              <Doodle name={r.doodle} size={48} />
            </AspectRatio>
          </div>
          <figcaption class="text-center text-sm text-muted-foreground">{r.label}</figcaption>
        </figure>)}
    </div>;
  };
});
export default Example;
