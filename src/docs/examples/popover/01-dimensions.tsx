// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
export const meta = {
  title: "Dimensions" as const,
  description: "The shadcn demo on a slip with a push-pin through its top edge. A CSS sheet: it costs no SVG." as const,
  layout: "center" as const,
  height: 340
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" class="self-start">
          Open popover
        </Button>
      </PopoverTrigger>
      <PopoverContent pin seed="dimensions" class="w-80">
        <div class="grid gap-4">
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
          </PopoverHeader>
          <div class="grid gap-2">
            {[["width", "Width", "100%"], ["maxWidth", "Max. width", "300px"], ["height", "Height", "25px"], ["maxHeight", "Max. height", "none"]].map(([id, label, value]) => <div key={id} class="grid grid-cols-3 items-center gap-4">
                <Label for={id}>{label}</Label>
                <Input id={id} defaultValue={value} class="col-span-2 h-8" />
              </div>)}
          </div>
        </div>
      </PopoverContent>
    </Popover>;
  };
});
export default Example;
