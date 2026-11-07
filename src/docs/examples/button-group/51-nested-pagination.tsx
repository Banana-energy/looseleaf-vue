// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Nested: pages and arrows" as const,
  description: "Two groups inside one: five numbered buttons and a previous/next pair. The page you are on is a highlighter button (`aria-current=\"page\"`), the arrows stop at the ends, and the status line says where you are." as const,
  layout: "stack" as const
};
const PAGES = [1, 2, 3, 4, 5];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const page = shallowRef(initialState(2));
  const setPage = stateSetter(page);
  return () => {
    return <div class="grid justify-items-start gap-4">
      <ButtonGroup aria-label="Pagination">
        <ButtonGroup>
          {PAGES.map(n => <Button key={n} variant={n === page.value ? "secondary" as const : "outline" as const} size="sm" aria-current={n === page.value ? "page" as const : undefined} aria-label={`Page ${n}`} onClick={() => setPage(n)}>
              {n}
            </Button>)}
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" size="icon-sm" aria-label="Previous page" disabled={page.value === 1} onClick={() => setPage(page.value - 1)}>
            <Icon name="arrow-left" />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Next page" disabled={page.value === PAGES.length} onClick={() => setPage(page.value + 1)}>
            <Icon name="arrow-right" />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
      <p role="status" class="text-sm text-muted-foreground">
        Page {page.value} of {PAGES.length}
      </p>
    </div>;
  };
});
export default Example;
