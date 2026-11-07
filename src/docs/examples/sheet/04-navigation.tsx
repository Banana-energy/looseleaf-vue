// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
export const meta = {
  title: "Mobile navigation" as const,
  description: "A menu page from the left with holes for a binder. The list scrolls inside the page (`overflow-y-auto` on the list, never on the sheet) and every link closes it." as const,
  layout: "center" as const,
  height: 220
};
const LINKS = ["Notebooks", "Drawings", "Recipes", "Garden log", "Reading list", "Field notes", "Letters", "Postcards", "Receipts", "Archive", "Bin"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open menu">
          <Icon name="menu" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" binding="holes" stock="pad" seed="nav">
        <SheetHeader>
          <SheetTitle>Looseleaf</SheetTitle>
          <SheetDescription>Everything you have written, in one binder.</SheetDescription>
        </SheetHeader>
        <nav aria-label="Main" class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-4 py-3">
          {LINKS.map(label => <SheetClose key={label} asChild>
              <Button asChild variant="ghost" class="justify-start">
                <a href={`#${label.toLowerCase().replace(/ /g, "-")}`}>{label}</a>
              </Button>
            </SheetClose>)}
        </nav>
      </SheetContent>
    </Sheet>;
  };
});
export default Example;
