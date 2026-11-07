// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Clipboard, ClipboardPaper } from "@/components/ui/clipboard";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "A clipboard" as const,
  description: "Hardboard with the grain of its fiber, a chrome spring clip over the paper, and a checklist on the ruled sheet (each row is one 28 px line)." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const items = ["Passport, tickets", "Waterproof notebook", "Two rolls of washi", "Tea (a lot)", "The very small pencil"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Clipboard seed="pack" tilt={-1.1} class="max-w-sm">
      <ClipboardPaper as="section" aria-labelledby="pack-title" seed="pack-p">
        <h3 id="pack-title" class="font-script text-[1.75rem] leading-7 font-bold">
          Packing list
        </h3>
        {items.map((item, i) => <div key={item} class="flex min-h-7 items-center gap-3">
            <Checkbox id={`pk-${i}`} defaultChecked={i < 2} />
            <Label for={`pk-${i}`} class="text-[17px] leading-7 font-normal">
              {item}
            </Label>
          </div>)}
      </ClipboardPaper>
    </Clipboard>;
  };
});
export default Example;
