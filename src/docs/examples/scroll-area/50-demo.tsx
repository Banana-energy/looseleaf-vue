// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, Fragment } from "vue";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
export const meta = {
  title: "Demo" as const,
  description: "Official `scroll-area-demo`: fifty version tags with a Separator between each. The box is a dashed pencil edge rather than `rounded-md border`, and the scroll mark is a graphite pull in a faint gutter. Scroll with the wheel, drag the mark, or focus the list and use the arrow keys." as const,
  layout: "center" as const,
  height: 320
};
const tags = Array.from({
  length: 50
}).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <ScrollArea class="h-72 w-48 border-y border-dashed border-pencil-mark/60">
      <div class="p-4">
        <h4 class="mb-4 text-sm leading-none font-medium">Tags</h4>
        {tags.map(tag => <Fragment key={tag}>
            <div class="text-sm">{tag}</div>
            <Separator class="my-2" />
          </Fragment>)}
      </div>
    </ScrollArea>;
  };
});
export default Example;
