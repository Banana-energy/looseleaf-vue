// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
export const meta = {
  title: "Bindings" as const,
  description: "Five ways to finish the inner edge: spiral coils, three binder holes, a perforated tear line, a torn pad edge, or nothing. Perf and torn are drawn when the page opens; the others are cheap strips." as const,
  layout: "center" as const,
  height: 220
};
const BINDINGS = ["spiral", "holes", "perf", "torn", "none"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center justify-center gap-3">
      {BINDINGS.map(binding => <Sheet key={binding}>
          <SheetTrigger asChild>
            <Button variant="outline">{binding}</Button>
          </SheetTrigger>
          <SheetContent binding={binding} stock="pad" rules="ruled" seed={`binding-${binding}`}>
            <SheetHeader>
              <SheetTitle>Field notes</SheetTitle>
              <SheetDescription>binding=&ldquo;{binding}&rdquo; on ruled pad paper.</SheetDescription>
            </SheetHeader>
            <ul class="-mt-0.5 space-y-0 px-6 text-base/7">
              <li>Rain from six.</li>
              <li>Tea, two cups, then a third.</li>
              <li>Started the long letter to Ada.</li>
            </ul>
          </SheetContent>
        </Sheet>)}
    </div>;
  };
});
export default Example;
