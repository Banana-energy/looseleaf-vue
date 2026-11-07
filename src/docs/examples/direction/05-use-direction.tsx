// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DirectionProvider, useDirection } from "@/components/ui/direction";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
export const meta = {
  title: "useDirection and islands" as const,
  description: "Your own widgets can read the direction too. This pager decides which arrow key goes forward from useDirection(), and its arrow drawings flip themselves. The English block is a left-to-right island inside the Hebrew page: it has its own provider, and its popover opens left to right." as const,
  layout: "center" as const,
  height: 460
};
const Pager = defineUi<{
  pages: number;
  label: string;
}>("Pager", ["pages", "label"], (_props, {
  slots: _slots
}) => {
  const pages = computed(() => _props["pages"]);
  const label = computed(() => _props["label"]);
  const dir = useDirection();
  const page = shallowRef(initialState(1));
  const setPage = stateSetter(page);
  const go = computed(() => (by: number) => setPage(p => Math.min(pages.value, Math.max(1, p + by))));
  return () => {
    return <div role="group" aria-label={label.value} class="flex items-center gap-2" onKeydown={(e: KeyboardEvent) => {
      const forward = dir.value === "rtl" ? "ArrowLeft" as const : "ArrowRight" as const;
      const back = dir.value === "rtl" ? "ArrowRight" as const : "ArrowLeft" as const;
      if (e.key === forward) go.value(1);else if (e.key === back) go.value(-1);else return;
      e.preventDefault();
    }}>
      <Button variant="outline" size="icon-sm" disabled={page.value === 1} onClick={() => go.value(-1)} aria-label={dir.value === "rtl" ? "הקודם" as const : "Previous" as const}>
        <Icon name="arrow-left" />
      </Button>
      <span class="ll-num min-w-16 text-center text-sm">
        {page.value} / {pages.value}
      </span>
      <Button variant="outline" size="icon-sm" disabled={page.value === pages.value} onClick={() => go.value(1)} aria-label={dir.value === "rtl" ? "הבא" as const : "Next" as const}>
        <Icon name="arrow-right" />
      </Button>
    </div>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <DirectionProvider direction="rtl">
      <Card lang="he" seed="direction-island" class="w-full max-w-md">
        <CardHeader>
          <CardTitle>ציטוט מהמחברת</CardTitle>
          <CardDescription>הכותרת בעברית והציטוט באנגלית. לחצו על חץ כדי לדפדף.</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-5">
          <Pager pages={5} label="דפי המחברת" />
          <DirectionProvider direction="ltr" lang="en" class="grid gap-3 border-s-2 border-dashed border-pencil-mark ps-3">
            <blockquote class="font-script text-xl">Draw the thing you can see, then the thing you meant.</blockquote>
            <div class="flex items-center gap-3">
              <Pager pages={3} label="Quote pages" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="About this quote">
                    <Icon name="info" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-60" seed="direction-island-popover" aria-label="About this quote">
                  <PopoverTitle>Left to right</PopoverTitle>
                  <PopoverDescription>This slip opens outside the island, so it is told its direction and carries dir="ltr" itself.</PopoverDescription>
                </PopoverContent>
              </Popover>
            </div>
          </DirectionProvider>
        </CardContent>
      </Card>
    </DirectionProvider>;
  };
});
export default Example;
