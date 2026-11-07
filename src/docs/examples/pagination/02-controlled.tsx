// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
export const meta = {
  title: "Controlled, with gaps" as const,
  description: "Nine pages with the classic windowing: the first and last always show, the current page has a neighbor on each side, the rest fold into ellipses. Previous is inert on page 1 and Next on page 9; the links have real hrefs, so open in a new tab works." as const,
  layout: "center" as const
};
const LAST = 9;
function windowed(page: number): Array<number | "gap-l" | "gap-r"> {
  const out: Array<number | "gap-l" | "gap-r"> = [];
  for (let p = 1; p <= LAST; p++) {
    if (p === 1 || p === LAST || Math.abs(p - page) <= 1) out.push(p);else if (p < page && out[out.length - 1] !== "gap-l") out.push("gap-l");else if (p > page && out[out.length - 1] !== "gap-r") out.push("gap-r");
  }
  return out;
}
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const page = shallowRef(initialState(5));
  const setPage = stateSetter(page);
  const go = computed(() => (n: number) => (e: MouseEvent) => {
    e.preventDefault();
    setPage(Math.min(LAST, Math.max(1, n)));
  });
  return () => {
    return <div class="grid justify-items-center gap-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={`#page-${page.value - 1}`} disabled={page.value === 1} onClick={go.value(page.value - 1)} />
          </PaginationItem>
          {windowed(page.value).map(p => <PaginationItem key={p}>
              {typeof p === "number" ? <PaginationLink href={`#page-${p}`} isActive={p === page.value} aria-label={`Page ${p}`} onClick={go.value(p)}>
                  {p}
                </PaginationLink> : <PaginationEllipsis />}
            </PaginationItem>)}
          <PaginationItem>
            <PaginationNext href={`#page-${page.value + 1}`} disabled={page.value === LAST} onClick={go.value(page.value + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p class="text-sm text-muted-foreground" aria-live="polite">
        Page {page.value} of {LAST}
      </p>
    </div>;
  };
});
export default Example;
