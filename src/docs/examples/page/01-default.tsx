// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Page, PageContent, PageDescription, PageFooter, PageHeader, PageTitle } from "@/components/ui/page";
export const meta = {
  title: "A page" as const,
  description: "Header, content and footer on a sheet of paper. The title is underlined by hand; the column is centered and as wide as you say." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Page seed="field-notes" width="md">
      <PageHeader>
        <PageTitle>Field notes</PageTitle>
        <PageDescription>A week of small observations, written where the light was good.</PageDescription>
      </PageHeader>
      <PageContent>
        <p>
          Most of what I remember from a book is in the margins: an arrow, a question mark, a small argument with a dead author. The rest is weather.
        </p>
        <p>Tuesday. Rain on the window, three cups of tea, and one very small plan for a very big week.</p>
        <div>
          <Button>Save the page</Button>
        </div>
      </PageContent>
      <PageFooter>
        <span>Draft</span>
        <span class="ll-num">- 3 -</span>
      </PageFooter>
    </Page>;
  };
});
export default Example;
