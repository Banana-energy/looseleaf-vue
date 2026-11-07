// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
import { ScrollArea } from "@/components/ui/scroll-area";
export const meta = {
  title: "Both directions" as const,
  description: "`orientation=\"both\"` shows both marks (here `type=\"always\"`, so they stay in view); the corner where they meet stays empty. A scroll container with nothing focusable inside is reachable by keyboard in current browsers; the viewport draws a blue ring inside its edge when it has focus." as const,
  layout: "center" as const,
  height: 300
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="paper" seed="grid" class="h-64 w-80">
      <ScrollArea orientation="both" type="always" class="size-full">
        <div class="grid w-[640px] grid-cols-8 gap-0 p-3 font-mono text-xs">
          {Array.from({
            length: 96
          }, (_, i) => <span key={i} class="grid h-14 place-items-center border border-pencil-mark/50">
              {i % 8 + 1}·{Math.floor(i / 8) + 1}
            </span>)}
        </div>
      </ScrollArea>
    </Paper>;
  };
});
export default Example;
