// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Page, PageContent, PageDescription, PageHeader, PageTitle } from "@/components/ui/page";
export const meta = {
  title: "Punched, ringed, stained" as const,
  description: "`holes` punches three holes down the start edge (or two across the top); the desk shows through. `reinforced` adds gummed rings, `stain` a coffee ring." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="@container w-full">
      <div class="grid gap-10 p-2 @2xl:grid-cols-2">
        <Page holes reinforced stain seed="binder" width="sm" class="min-h-[26rem]">
          <PageHeader>
            <PageTitle underline="double">For the binder</PageTitle>
            <PageDescription>Three holes, gummed rings, one coffee.</PageDescription>
          </PageHeader>
          <PageContent>
            <p>The rings are stuck on by hand and never quite concentric. The stain is faint on purpose.</p>
          </PageContent>
        </Page>
        <Page holes="top" stock="graph" seed="legal" width="sm" class="min-h-[26rem]">
          <PageHeader>
            <PageTitle underline="wavy">Filed at the top</PageTitle>
            <PageDescription>Two holes, a hand apart, like legal paper.</PageDescription>
          </PageHeader>
          <PageContent>
            <p>The start padding grows with the punch, so the text never touches it.</p>
          </PageContent>
        </Page>
      </div>
    </div>;
  };
});
export default Example;
