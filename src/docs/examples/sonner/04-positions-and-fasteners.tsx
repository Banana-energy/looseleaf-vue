// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { toast } from "@/lib/sonner-primitive";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
export const meta = {
  title: "Positions, tape and pin" as const,
  description: "Six places to stack toasts (slips not on the right are dropped from above instead of tossed from the corner), and two ways to hold them down: masking tape or a push-pin." as const,
  layout: "center" as const
};
const ID = "sonner-positions";
const POSITIONS = ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"] as const;
const DECORATIONS = ["none", "tape", "pin"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const position = shallowRef<typeof POSITIONS[number]>(initialState("bottom-right"));
  const setPosition = stateSetter(position);
  const decoration = shallowRef<typeof DECORATIONS[number]>(initialState("tape"));
  const setDecoration = stateSetter(decoration);
  return () => {
    return <div class="grid justify-items-center gap-4">
      <div class="flex flex-wrap justify-center gap-3" role="group" aria-label="Position">
        {POSITIONS.map(p => <Button key={p} size="sm" variant={p === position.value ? "secondary" as const : "outline" as const} aria-pressed={p === position.value} onClick={() => setPosition(p)}>
            {p}
          </Button>)}
      </div>
      <div class="flex flex-wrap justify-center gap-3" role="group" aria-label="Decoration">
        {DECORATIONS.map(d => <Button key={d} size="sm" variant={d === decoration.value ? "secondary" as const : "outline" as const} aria-pressed={d === decoration.value} onClick={() => setDecoration(d)}>
            {d}
          </Button>)}
      </div>
      <Button onClick={() => toast.success("Copied to clipboard", {
        toasterId: ID,
        description: `${position.value}, ${decoration.value}`
      })}>Toast</Button>
      <Toaster id={ID} position={position.value} decoration={decoration.value} />
    </div>;
  };
});
export default Example;
