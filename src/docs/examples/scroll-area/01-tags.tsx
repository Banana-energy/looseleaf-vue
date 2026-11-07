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
  title: "Tags" as const,
  description: "Shadcn's list, with a pencil scroll mark instead of a bar. The mark fades in when the pointer is over the area or it scrolls, and the thumb is a graphite pull that slides down a faint gutter." as const,
  layout: "center" as const,
  height: 320
};
const tags = Array.from({
  length: 50
}, (_, i) => `v1.${2 - Math.floor(i / 10)}.${9 - i % 10}-beta.${50 - i}`);
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="slip" tilt={false} seed="tags" class="w-56">
      <ScrollArea class="h-72 w-full">
        <div class="p-4">
          <h4 class="mb-3 font-script text-xl leading-none font-semibold">Tags</h4>
          {tags.map(tag => <div key={tag} class="border-b border-dashed border-pencil-mark/40 py-2 text-sm">
              {tag}
            </div>)}
        </div>
      </ScrollArea>
    </Paper>;
  };
});
export default Example;
