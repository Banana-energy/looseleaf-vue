// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
export const meta = {
  title: "Stocks and fasteners" as const,
  description: "Any stock, held down by a pin of any color or by tape. A torn edge is drawn when the popover opens (the only case where it costs SVG)." as const,
  layout: "center" as const,
  height: 380
};
const NOTES = [{
  label: "Pinned slip" as const,
  title: "Pinned" as const,
  body: "A push-pin in stationery sky." as const,
  props: {
    pin: "sky" as const
  }
}, {
  label: "Taped kraft" as const,
  title: "Taped" as const,
  body: "Kraft paper under a strip of masking tape." as const,
  props: {
    stock: "kraft" as const,
    tape: "top" as const
  }
}, {
  label: "Torn index card" as const,
  title: "Torn" as const,
  body: "An index card with a torn bottom edge." as const,
  props: {
    stock: "index-card" as const,
    edge: {
      bottom: "torn" as const
    }
  }
}, {
  label: "Sticky pink" as const,
  title: "Sticky" as const,
  body: "Turned a degree and a half." as const,
  props: {
    stock: "sticky-pink" as const,
    tilt: 1.5,
    pin: "grape" as const
  }
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center justify-center gap-3">
      {NOTES.map(n => <Popover key={n.label}>
          <PopoverTrigger asChild>
            <Button variant="outline">{n.label}</Button>
          </PopoverTrigger>
          <PopoverContent class="w-60" seed={n.title} {...domProps(n.props)}>
            <PopoverHeader>
              <PopoverTitle>{n.title}</PopoverTitle>
              <PopoverDescription class="text-foreground/80">{n.body}</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>)}
    </div>;
  };
});
export default Example;
