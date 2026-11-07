// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Clipboard, ClipboardPaper } from "@/components/ui/clipboard";
export const meta = {
  title: "Hardboard and plastic" as const,
  description: "The same board in hardboard and in colored plastic. The paper stays cream, so nothing on it changes contrast." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const tones = ["hardboard", "teal", "tomato"] as const;
const lists = [["milk", "eggs", "tea"], ["rent", "post", "call"], ["jam", "figs", "rye"]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap justify-center gap-x-8 gap-y-12 p-4">
      {tones.map((tone, i) => <figure key={tone} class="grid w-48 gap-3">
          <Clipboard tone={tone} seed={tone} tilt={i % 2 ? 1 : -1} class="min-h-72">
            <ClipboardPaper seed={`${tone}-p`} class="min-h-40 ps-12 pe-3">
              {lists[i].map(item => <p key={item} class="font-hand text-[17px] leading-7">
                  {item}
                </p>)}
            </ClipboardPaper>
          </Clipboard>
          <figcaption class="text-center font-type text-sm text-ink">{tone}</figcaption>
        </figure>)}
    </div>;
  };
});
export default Example;
