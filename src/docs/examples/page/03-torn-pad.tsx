// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Page, PageContent, PageDescription, PageFooter, PageHeader, PageTitle } from "@/components/ui/page";
export const meta = {
  title: "Torn from a pad" as const,
  description: "`torn` is a shorthand for the edge. Pair it with a slip, a highlighted title and a tape strip." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="@container w-full">
      <div class="grid gap-10 p-2 @2xl:grid-cols-2">
        <Page torn stock="slip" width="sm" tape="top" seed="pad" class="min-h-[20rem]">
          <PageHeader>
            <PageTitle underline="highlight">Order pad</PageTitle>
            <PageDescription>Top edge ragged.</PageDescription>
          </PageHeader>
          <PageContent>
            <p>2 x oat latte, one for the road.</p>
            <p>1 x croissant, warm.</p>
          </PageContent>
          <PageFooter>
            <span>no. 0042</span>
          </PageFooter>
        </Page>
        <Page torn="both" stock="paper" width="sm" fastener="clip" seed="scrap" class="min-h-[20rem]">
          <PageHeader>
            <PageTitle underline="none">A scrap</PageTitle>
            <PageDescription>Torn at both ends and clipped to something.</PageDescription>
          </PageHeader>
          <PageContent>
            <p>Not every page has to be a whole one.</p>
          </PageContent>
        </Page>
      </div>
    </div>;
  };
});
export default Example;
