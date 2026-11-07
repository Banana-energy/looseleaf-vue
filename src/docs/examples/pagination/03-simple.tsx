// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Icon } from "@/components/ui/icon";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
export const meta = {
  title: "Simple pager" as const,
  description: "Previous, a line of text, Next: for a feed or a list you page through. Sizes are Button sizes; here the arrows are square icon buttons with a label of their own, and a load-more link uses the large size." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const page = shallowRef(initialState(3));
  const setPage = stateSetter(page);
  const total = computed(() => 12);
  const go = computed(() => (n: number) => (e: MouseEvent) => {
    e.preventDefault();
    setPage(Math.min(total.value, Math.max(1, n)));
  });
  return () => {
    return <div class="grid justify-items-center gap-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#prev" size="icon-sm" aria-label="Go to previous page" disabled={page.value === 1} onClick={go.value(page.value - 1)}>
              <Icon name="chevron-left" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <span class="px-3 font-script text-xl" aria-live="polite">
              page {page.value} of {total.value}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#next" size="icon-sm" aria-label="Go to next page" disabled={page.value === total.value} onClick={go.value(page.value + 1)}>
              <Icon name="chevron-right" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#older" size="sm" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#newer" size="sm" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#more" size="lg" class="px-8">
              Load more notes
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>;
  };
});
export default Example;
